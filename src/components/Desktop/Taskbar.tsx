
import React from 'react';
import { Terminal, FolderOpen, Settings, HelpCircle } from 'lucide-react';
import { useWindowContext } from '../../context/WindowContext';

const Taskbar = () => {
  const { windows, openWindow, activeWindowId } = useWindowContext();

  const openTerminal = () => {
    console.log("Opening Terminal");
    openWindow({
      id: 'terminal',
      title: 'Terminal',
      component: 'Terminal',
      width: 700,
      height: 400,
      x: 100,
      y: 100,
    });
  };

  const openFileExplorer = () => {
    console.log("Opening File Explorer");
    openWindow({
      id: 'fileExplorer',
      title: 'File Explorer',
      component: 'FileExplorer',
      width: 800,
      height: 500,
      x: 150, 
      y: 150,
    });
  };

  const openSettings = () => {
    console.log("Opening Settings");
    openWindow({
      id: 'settings',
      title: 'Settings',
      component: 'Settings',
      width: 600,
      height: 400,
      x: 200,
      y: 200,
    });
  };

  const openHelp = () => {
    console.log("Opening Help");
    openWindow({
      id: 'help',
      title: 'Help',
      component: 'Help',
      width: 500,
      height: 400,
      x: 250,
      y: 250,
    });
  };

  return (
    <div className="h-20 bg-black/60 backdrop-blur-md border-t border-cyber-neon-pink/30 flex items-center justify-center z-10">
      <div className="dock flex items-center space-x-4 p-2">
        <button onClick={openTerminal} className="dock-item group">
          <Terminal className="text-cyber-neon-green group-hover:animate-pulse-glow" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-green text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">Terminal</span>
        </button>
        
        <button onClick={openFileExplorer} className="dock-item group">
          <FolderOpen className="text-cyber-neon-blue group-hover:animate-pulse-glow" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">Files</span>
        </button>
        
        <button onClick={openSettings} className="dock-item group">
          <Settings className="text-cyber-neon-purple group-hover:animate-pulse-glow" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-purple text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">Settings</span>
        </button>
        
        <button onClick={openHelp} className="dock-item group">
          <HelpCircle className="text-cyber-neon-pink group-hover:animate-pulse-glow" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-pink text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">Help</span>
        </button>
      </div>

      {/* Taskbar indicators for open windows */}
      <div className="absolute bottom-2 flex space-x-2">
        {windows.map(window => (
          <div 
            key={window.id} 
            className={`h-1 w-6 rounded-full ${window.id === activeWindowId ? 'bg-cyber-neon-blue' : 'bg-gray-500'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Taskbar;
