
import React, { useEffect, useRef, useState } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import { resolvePath } from '../../utils/fileSystem';
import { commandParser } from './commandParser';

const Terminal: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [output, setOutput] = useState<JSX.Element[]>([
    <div key="welcome" className="mb-2">
      <span className="neon-green-text">Welcome to CyberOS Terminal v1.0</span>
      <br />
      <span>Type <span className="neon-blue-text">help</span> to see available commands</span>
    </div>
  ]);
  
  const fileSystem = useFileSystem();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when output changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    // Focus input when terminal is clicked
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick);
    }

    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick);
      }
    };
  }, []);

  const addToOutput = (text: string | JSX.Element) => {
    setOutput(prev => [...prev, 
      <div key={`out-${prev.length}`} className="mb-1">
        {typeof text === 'string' ? <span>{text}</span> : text}
      </div>
    ]);
  };

  const addToCommandHistory = (command: string) => {
    setCommandHistory(prev => [command, ...prev].slice(0, 50));
    setHistoryIndex(-1);
  };

  const clearTerminal = () => {
    setOutput([
      <div key="welcome" className="mb-2">
        <span className="neon-green-text">Terminal cleared.</span>
      </div>
    ]);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const fullCommand = input.trim();
      
      // Add command to output
      addToOutput(
        <div>
          <span className="neon-purple-text">user@cyber</span>
          <span className="text-white">:</span>
          <span className="neon-blue-text">{currentPath}</span>
          <span className="text-white">$ </span>
          <span>{fullCommand}</span>
        </div>
      );
      
      // Add to history
      addToCommandHistory(fullCommand);
      setInput('');
      
      // Process command
      try {
        // Special case for clear command
        if (fullCommand.trim().toLowerCase() === 'clear') {
          clearTerminal();
          return;
        }
        
        const result = await commandParser({
          command: fullCommand,
          currentPath,
          fileSystem,
          setCurrentPath
        });
        
        if (result) {
          addToOutput(result);
        }
      } catch (error: any) {
        addToOutput(<span className="text-red-400">{error.message || 'An error occurred'}</span>);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion implementation
      if (input.trim()) {
        const parts = input.trim().split(' ');
        const lastPart = parts[parts.length - 1];
        
        if (parts[0].toLowerCase() === 'cd' || parts[0].toLowerCase() === 'cat' || parts[0].toLowerCase() === 'ls') {
          // Get current directory contents for tab completion
          const currentFolder = fileSystem.getNodeByPath(currentPath);
          if (currentFolder && currentFolder.children) {
            const items = currentFolder.children
              .map(childId => fileSystem.files[childId])
              .filter(item => item.name.startsWith(lastPart));
            
            if (items.length === 1) {
              // Complete with the only matching item
              parts[parts.length - 1] = items[0].name;
              setInput(parts.join(' '));
            }
          }
        }
      }
    }
  };

  return (
    <div 
      ref={terminalRef} 
      className="terminal h-full w-full overflow-auto font-mono text-sm"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(12, 12, 20, 0.99), rgba(12, 12, 20, 0.99)), url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%232A2A3C\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 5v1H0V0h5z\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: '6px 6px'
      }}
    >
      <div className="p-3">
        {output}
        <div className="flex items-center">
          <span className="neon-purple-text">user@cyber</span>
          <span className="text-white">:</span>
          <span className="neon-blue-text">{currentPath}</span>
          <span className="text-white">$ </span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none border-none text-green-400 ml-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <span className="animate-blink text-green-400">▋</span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
