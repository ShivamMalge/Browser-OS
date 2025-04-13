
import React, { useState, useEffect } from 'react';
import Taskbar from './Taskbar';
import { FileSystemProvider } from '../../context/FileSystemContext';
import { WindowProvider } from '../../context/WindowContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const Desktop = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Add some visual effects after component mounts
    setInitialized(true);
    
    // Add the scanline effect
    const scanline = document.createElement('div');
    scanline.className = 'scanline animate-scanline';
    document.body.appendChild(scanline);
    
    return () => {
      document.body.removeChild(scanline);
    };
  }, []);

  return (
    <FileSystemProvider>
      <WindowProvider>
        <div className={`min-h-screen flex flex-col cyber-grid-bg transition-opacity duration-1000 ${initialized ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex-grow relative">
            <DesktopContent />
          </div>
          <Taskbar />
        </div>
      </WindowProvider>
    </FileSystemProvider>
  );
};

const DesktopContent = () => {
  const [time, setTime] = useState(new Date());
  
  // Apply keyboard shortcuts inside the WindowProvider context
  useKeyboardShortcuts();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <>
      <div className="absolute top-4 right-4 text-xl neon-blue-text font-mono">
        {time.toLocaleTimeString()}
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <h1 className="text-5xl font-bold neon-text mb-4">CYBER OS</h1>
        <p className="text-xl neon-purple-text mb-2">// SIMULATION ACTIVE</p>
        <p className="text-sm text-gray-400">Use the dock below to launch applications</p>
      </div>
    </>
  );
};

export default Desktop;
