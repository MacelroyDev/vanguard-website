'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

// Minimal test component to debug the issue

interface TransitMapDebugProps {
  apiBaseUrl: string;
  className?: string;
}

export default function TransitMapDebug({ apiBaseUrl, className = '' }: TransitMapDebugProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [trainCount, setTrainCount] = useState<number>(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [rawResponse, setRawResponse] = useState<string>('');

  // Test canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) {
      setStatus('Canvas or container ref is null');
      return;
    }

    const rect = container.getBoundingClientRect();
    setCanvasSize({ width: rect.width, height: rect.height });
    
    if (rect.width === 0 || rect.height === 0) {
      setStatus('Container has zero dimensions - check CSS');
      return;
    }

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setStatus('Could not get 2D context');
      return;
    }
    
    ctx.scale(dpr, dpr);
    
    // Draw test pattern
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    ctx.fillStyle = '#f59e0b';
    ctx.font = '16px monospace';
    ctx.fillText('Canvas is working!', 20, 30);
    ctx.fillText(`Size: ${rect.width}x${rect.height}`, 20, 50);
    
    // Draw grid to prove rendering works
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    for (let x = 0; x < rect.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
    
    setStatus('Canvas rendered successfully');
  }, []);

  // Test API fetch
  useEffect(() => {
    const testFetch = async () => {
      try {
        setStatus('Fetching from API...');
        
        const url = `${apiBaseUrl}/api/trains.rt`;
        console.log('Fetching:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          setError(`HTTP ${response.status}: ${response.statusText}`);
          return;
        }
        
        const text = await response.text();
        setRawResponse(text.substring(0, 500) + '...');
        console.log('Raw response:', text);
        
        // Try to parse
        let jsonStr = text;
        
        // Handle SSE format
        if (text.startsWith('data:')) {
          jsonStr = text.replace(/^data:\s*/, '').trim();
        }
        
        const data = JSON.parse(jsonStr);
        
        if (data.trains) {
          setTrainCount(data.trains.length);
          setStatus(`Success! Found ${data.trains.length} trains`);
        } else {
          setStatus('Parsed JSON but no trains array found');
          console.log('Parsed data:', data);
        }
        
      } catch (err) {
        console.error('Fetch error:', err);
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError('CORS error - API is blocking requests from this origin. You need to set up a proxy.');
        } else if (err instanceof SyntaxError) {
          setError('JSON parse error - response format unexpected');
        } else {
          setError(`Error: ${err}`);
        }
      }
    };
    
    testFetch();
  }, [apiBaseUrl]);

  return (
    <div className={`relative bg-zinc-900 ${className}`} ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Debug overlay */}
      <div className="absolute top-4 left-4 bg-zinc-800 border border-zinc-700 p-4 rounded max-w-md">
        <h3 className="text-amber-500 font-bold mb-2">Debug Info</h3>
        
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-400">Status: </span>
            <span className="text-white">{status}</span>
          </div>
          
          <div>
            <span className="text-gray-400">Canvas Size: </span>
            <span className="text-white">{canvasSize.width}x{canvasSize.height}</span>
          </div>
          
          <div>
            <span className="text-gray-400">API URL: </span>
            <span className="text-white text-xs break-all">{apiBaseUrl}</span>
          </div>
          
          <div>
            <span className="text-gray-400">Trains Found: </span>
            <span className="text-green-500">{trainCount}</span>
          </div>
          
          {error && (
            <div className="mt-2 p-2 bg-red-500/20 border border-red-500/50 rounded">
              <span className="text-red-400">{error}</span>
            </div>
          )}
          
          {rawResponse && (
            <div className="mt-2">
              <span className="text-gray-400">Raw Response (first 500 chars):</span>
              <pre className="text-xs text-gray-500 mt-1 overflow-auto max-h-32 bg-zinc-900 p-2 rounded">
                {rawResponse}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
