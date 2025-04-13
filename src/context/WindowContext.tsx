
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Window from '../components/Desktop/Window';

interface Window {
  id: string;
  title: string;
  component: string;
  width: number;
  height: number;
  x: number;
  y: number;
  isMinimized?: boolean;
}

interface WindowContextType {
  windows: Window[];
  activeWindowId: string | null;
  openWindow: (window: Window) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  getWindowZIndex: (id: string) => number;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [windowOrder, setWindowOrder] = useState<string[]>([]);

  const openWindow = (window: Window) => {
    console.log("Opening window:", window);
    // Check if window already exists
    const existingWindowIndex = windows.findIndex(w => w.id === window.id);
    
    if (existingWindowIndex !== -1) {
      // If minimized, un-minimize and focus
      if (windows[existingWindowIndex].isMinimized) {
        setWindows(prev => 
          prev.map(w => w.id === window.id ? { ...w, isMinimized: false } : w)
        );
      }
      focusWindow(window.id);
      return;
    }
    
    // Add new window
    const newWindow = { ...window, isMinimized: false };
    setWindows(prev => [...prev, newWindow]);
    setWindowOrder(prev => [...prev, window.id]);
    setActiveWindowId(window.id);
  };

  const closeWindow = (id: string) => {
    console.log(`Closing window: ${id}`);
    setWindows(prev => prev.filter(window => window.id !== id));
    setWindowOrder(prev => prev.filter(windowId => windowId !== id));
    
    // Set active window to the top-most window
    if (activeWindowId === id && windowOrder.length > 1) {
      const remainingWindows = windowOrder.filter(windowId => windowId !== id);
      setActiveWindowId(remainingWindows[remainingWindows.length - 1]);
    } else if (windowOrder.length <= 1) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: string) => {
    console.log(`Minimizing window: ${id}`);
    setWindows(prev => 
      prev.map(window => 
        window.id === id ? { ...window, isMinimized: true } : window
      )
    );
    
    // Focus the next window if the minimized window was active
    if (activeWindowId === id) {
      const index = windowOrder.indexOf(id);
      if (index > 0) {
        setActiveWindowId(windowOrder[index - 1]);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const focusWindow = (id: string) => {
    console.log(`Focusing window: ${id}`);
    // If window is minimized, restore it
    setWindows(prev => 
      prev.map(window => 
        window.id === id ? { ...window, isMinimized: false } : window
      )
    );
    
    // Reorder windows to bring the focused window to front
    setWindowOrder(prev => {
      const newOrder = prev.filter(windowId => windowId !== id);
      newOrder.push(id);
      return newOrder;
    });
    
    setActiveWindowId(id);
  };

  const getWindowZIndex = (id: string) => {
    const index = windowOrder.indexOf(id);
    return index + 10; // Base z-index of 10
  };

  return (
    <WindowContext.Provider value={{
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      focusWindow,
      getWindowZIndex
    }}>
      {children}
      <div className="windows-container absolute top-0 left-0 w-full h-full pointer-events-none">
        {windows
          .filter(window => !window.isMinimized)
          .map(window => (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              component={window.component}
              width={window.width}
              height={window.height}
              x={window.x}
              y={window.y}
              isActive={window.id === activeWindowId}
              zIndex={getWindowZIndex(window.id)}
            />
          ))}
      </div>
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
};
