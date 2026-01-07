'use client';

import React, { useEffect, useState } from 'react';

// Simple test component to debug what's happening
export default function TransitMapTest() {
  const [status, setStatus] = useState('Starting...');
  const [trainsData, setTrainsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPIs = async () => {
      // Test 1: Trains API
      try {
        setStatus('Fetching /api/crn/trains...');
        const trainsRes = await fetch('/api/crn/trains');
        
        if (!trainsRes.ok) {
          setError(`Trains API returned ${trainsRes.status}: ${trainsRes.statusText}`);
          return;
        }
        
        const trains = await trainsRes.json();
        setTrainsData(trains);
        setStatus(`Success! Found ${trains.trains?.length || 0} trains`);
        
      } catch (err) {
        setError(`Fetch error: ${err}`);
      }
    };

    testAPIs();
  }, []);

  return (
    <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg">
      <h3 className="text-amber-500 font-bold text-lg mb-4">Transit Map API Test</h3>
      
      <div className="space-y-3">
        <div>
          <span className="text-gray-400">Status: </span>
          <span className="text-white">{status}</span>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 p-3 rounded">
            <span className="text-red-400">{error}</span>
          </div>
        )}
        
        {trainsData && (
          <div className="bg-green-500/20 border border-green-500 p-3 rounded">
            <span className="text-green-400">API Working!</span>
            <pre className="text-xs text-gray-300 mt-2 overflow-auto max-h-40">
              {JSON.stringify(trainsData, null, 2).substring(0, 1000)}...
            </pre>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>If you see an error above, check:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Is your Minecraft server running?</li>
          <li>Is Create Railways Navigator mod installed and running?</li>
          <li>Check the terminal running `npm run dev` for errors</li>
          <li>Is the CRN_SERVER_URL correct in your route.ts files?</li>
        </ul>
      </div>
    </div>
  );
}
