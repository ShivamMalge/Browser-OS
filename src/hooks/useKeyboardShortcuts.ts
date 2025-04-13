
import { useEffect } from 'react';
import { useWindowContext } from '../context/WindowContext';

export const useKeyboardShortcuts = () => {
  const { openWindow } = useWindowContext();
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+F (Files)
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        openWindow({
          id: 'fileExplorer',
          title: 'File Explorer',
          component: 'FileExplorer',
          width: 800,
          height: 500,
          x: 150,
          y: 150,
        });
      }
      
      // Check for Ctrl+Windows+S (Settings)
      else if (event.ctrlKey && event.metaKey && event.key === 's') {
        event.preventDefault();
        openWindow({
          id: 'settings',
          title: 'Settings',
          component: 'Settings',
          width: 600,
          height: 400,
          x: 200,
          y: 200,
        });
      }
      
      // Check for Ctrl+H (Help)
      else if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        openWindow({
          id: 'help',
          title: 'Help',
          component: 'Help',
          width: 500,
          height: 400,
          x: 250,
          y: 250,
        });
      }
      
      // Check for Ctrl+K (Terminal)
      else if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        openWindow({
          id: 'terminal',
          title: 'Terminal',
          component: 'Terminal',
          width: 700,
          height: 400,
          x: 100,
          y: 100,
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openWindow]);
};
