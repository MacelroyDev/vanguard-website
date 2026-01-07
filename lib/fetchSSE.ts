// ============================================================
// Save this as: src/lib/fetchSSE.ts
// ============================================================

export async function fetchSSE(url: string): Promise<any> {
  const controller = new AbortController();
  
  const response = await fetch(url, {
    method: 'GET',
    signal: controller.signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  
  // Read chunks until we have complete JSON
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    
    // Try to find complete JSON in the buffer
    // SSE format is "data: {...}\n\n" or just "data: {...}\n"
    let jsonStr = buffer;
    
    // Remove "data: " prefix if present
    if (jsonStr.startsWith('data:')) {
      jsonStr = jsonStr.substring(5).trim();
    }
    
    // Check if we have complete JSON by trying to parse it
    // Look for a complete object by counting braces
    if (jsonStr.startsWith('{')) {
      let braceCount = 0;
      let inString = false;
      let escapeNext = false;
      let endIndex = -1;
      
      for (let i = 0; i < jsonStr.length; i++) {
        const char = jsonStr[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\' && inString) {
          escapeNext = true;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i + 1;
              break;
            }
          }
        }
      }
      
      // If we found a complete JSON object
      if (endIndex > 0) {
        jsonStr = jsonStr.substring(0, endIndex);
        
        // Try to parse it to verify it's valid
        try {
          const data = JSON.parse(jsonStr);
          
          // Success! Cancel the stream and return
          reader.cancel().catch(() => {});
          controller.abort();
          
          console.log(`fetchSSE: Successfully parsed ${url}, buffer size: ${buffer.length}`);
          return data;
        } catch (e) {
          // Parse failed, keep reading
          console.log(`fetchSSE: Parse attempt failed, continuing to read...`);
        }
      }
    }
    
    // Safety limit - 10MB should be more than enough
    if (buffer.length > 10 * 1024 * 1024) {
      console.error('fetchSSE: Buffer exceeded 10MB, aborting');
      break;
    }
  }
  
  // If we get here, try one final parse
  reader.cancel().catch(() => {});
  controller.abort();
  
  let jsonStr = buffer;
  if (jsonStr.startsWith('data:')) {
    jsonStr = jsonStr.substring(5).trim();
  }
  
  // Try to extract JSON object
  const startIdx = jsonStr.indexOf('{');
  if (startIdx >= 0) {
    jsonStr = jsonStr.substring(startIdx);
  }
  
  return JSON.parse(jsonStr);
}