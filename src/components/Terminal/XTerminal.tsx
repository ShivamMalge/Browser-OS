
import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useFileSystem } from '../../context/FileSystemContext';
import commandParser from './commandParser';
import 'xterm/css/xterm.css';

// Component to handle terminal output when a command returns JSX
const TerminalOutput: React.FC<{ output: JSX.Element }> = ({ output }) => {
  return (
    <div className="terminal-output">
      {output}
    </div>
  );
};

const XTerminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const fileSystem = useFileSystem();
  const currentPathRef = useRef<string>('/');
  const inputBufferRef = useRef<string>('');
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [jsxOutput, setJsxOutput] = useState<JSX.Element | null>(null);

  useEffect(() => {
    // Initialize xterm
    if (terminalRef.current) {
      // Create Terminal instance
      xtermRef.current = new Terminal({
        cursorBlink: true,
        cursorStyle: 'block',
        fontFamily: 'monospace',
        fontSize: 14,
        theme: {
          background: '#0c0c14',
          foreground: '#00ff00',
          cursor: '#00ff00',
          cursorAccent: '#0c0c14',
          selectionBackground: 'rgba(0, 255, 0, 0.3)',
        },
      });
      
      // Create fit addon
      fitAddonRef.current = new FitAddon();
      xtermRef.current.loadAddon(fitAddonRef.current);
      
      // Open terminal in the container
      xtermRef.current.open(terminalRef.current);
      
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
      
      // Print welcome message
      xtermRef.current.writeln('\x1b[1;92mWelcome to CyberOS Terminal v3.0\x1b[0m');
      xtermRef.current.writeln('Type \x1b[1;94mhelp\x1b[0m to see available commands');
      xtermRef.current.writeln('');
      
      // Print prompt
      printPrompt();
      
      // Handle key input
      xtermRef.current.onKey(({ key, domEvent }) => {
        const terminal = xtermRef.current;
        if (!terminal) return;
        
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
        
        // Handle backspace
        if (domEvent.key === 'Backspace') {
          if (inputBufferRef.current.length > 0) {
            inputBufferRef.current = inputBufferRef.current.slice(0, -1);
            // Move cursor backward, clear last character, move cursor backward again
            terminal.write('\b \b');
          }
        }
        // Handle Enter
        else if (domEvent.key === 'Enter') {
          const command = inputBufferRef.current.trim();
          
          terminal.writeln('');
          
          if (command) {
            // Add to history
            commandHistoryRef.current = [command, ...commandHistoryRef.current].slice(0, 50);
            historyIndexRef.current = -1;
            
            // Process command
            processCommand(command);
          } else {
            printPrompt();
          }
          
          inputBufferRef.current = '';
        }
        // Handle Tab (for tab completion)
        else if (domEvent.key === 'Tab') {
          domEvent.preventDefault();
          handleTabCompletion();
        }
        // Handle up arrow (command history)
        else if (domEvent.key === 'ArrowUp') {
          handleHistoryNavigation(1);
        }
        // Handle down arrow (command history)
        else if (domEvent.key === 'ArrowDown') {
          handleHistoryNavigation(-1);
        }
        // Handle printable characters
        else if (printable) {
          inputBufferRef.current += key;
          terminal.write(key);
        }
      });
      
      // Handle resize
      const handleResize = () => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        xtermRef.current?.dispose();
      };
    }
  }, []);
  
  const printPrompt = () => {
    if (!xtermRef.current) return;
    
    xtermRef.current.write(
      '\x1b[1;95muser@cyber\x1b[0m:\x1b[1;94m' + 
      currentPathRef.current + 
      '\x1b[0m$ '
    );
  };
  
  const handleTabCompletion = () => {
    if (!xtermRef.current) return;
    
    const input = inputBufferRef.current;
    const parts = input.split(' ');
    
    // If we're trying to complete a command
    if (parts.length === 1) {
      const availableCommands = [
        'cd', 'ls', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'echo', 'clear',
        'help', 'nmap', 'ssh', 'sqlmap', 'decrypt', 'scan', 'crack', 'unlock',
        'find', 'grep', 'chmod', 'whoami', 'ifconfig', 'netstat', 'ps', 'top',
        'sudo', 'openssl'
      ];
      
      const matchingCommands = availableCommands.filter(cmd => 
        cmd.startsWith(parts[0].toLowerCase()) && cmd !== parts[0]
      );
      
      if (matchingCommands.length === 1) {
        // Clear current input
        while (inputBufferRef.current.length > 0) {
          xtermRef.current.write('\b \b');
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
        }
        
        // Write completed command
        xtermRef.current.write(matchingCommands[0]);
        inputBufferRef.current = matchingCommands[0];
      } else if (matchingCommands.length > 1) {
        // Display all possible completions
        xtermRef.current.writeln('');
        xtermRef.current.writeln(matchingCommands.join('  '));
        printPrompt();
        xtermRef.current.write(input);
      }
    }
    // Try to complete a file/folder path
    else if (parts.length > 1) {
      const currentInput = parts[parts.length - 1];
      const parentPath = currentInput.includes('/') 
        ? currentPathRef.current + '/' + currentInput.substring(0, currentInput.lastIndexOf('/'))
        : currentPathRef.current;
      
      const searchName = currentInput.includes('/')
        ? currentInput.substring(currentInput.lastIndexOf('/') + 1)
        : currentInput;
      
      // Get folder contents at the parent path
      const parentNode = fileSystem.getNodeByPath(parentPath);
      if (parentNode && parentNode.type === 'folder' && parentNode.children) {
        // Find matching files/folders
        const matches = parentNode.children
          .map(id => fileSystem.files[id])
          .filter(node => node.name.startsWith(searchName) && node.name !== searchName);
        
        if (matches.length === 1) {
          // Complete the path
          const newInput = parts.slice(0, -1).join(' ') + ' ' + 
            (currentInput.includes('/') 
              ? currentInput.substring(0, currentInput.lastIndexOf('/') + 1)
              : '') + 
            matches[0].name;
          
          // Clear current input
          while (inputBufferRef.current.length > 0) {
            xtermRef.current.write('\b \b');
            inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          }
          
          // Write completed input
          xtermRef.current.write(newInput);
          inputBufferRef.current = newInput;
        } else if (matches.length > 1) {
          // Display all possible completions
          xtermRef.current.writeln('');
          xtermRef.current.writeln(matches.map(m => m.name).join('  '));
          printPrompt();
          xtermRef.current.write(inputBufferRef.current);
        }
      }
    }
  };
  
  const handleHistoryNavigation = (direction: number) => {
    if (!xtermRef.current || commandHistoryRef.current.length === 0) return;
    
    if (direction > 0) {
      // Navigate up in history
      const newIndex = Math.min(
        commandHistoryRef.current.length - 1,
        historyIndexRef.current + 1
      );
      historyIndexRef.current = newIndex;
    } else {
      // Navigate down in history
      if (historyIndexRef.current > 0) {
        historyIndexRef.current -= 1;
      } else if (historyIndexRef.current === 0) {
        historyIndexRef.current = -1;
      }
    }
    
    // Clear current input
    while (inputBufferRef.current.length > 0) {
      xtermRef.current.write('\b \b');
      inputBufferRef.current = inputBufferRef.current.slice(0, -1);
    }
    
    // Write history item or empty if at the beginning
    const historyItem = historyIndexRef.current >= 0 
      ? commandHistoryRef.current[historyIndexRef.current] 
      : '';
      
    xtermRef.current.write(historyItem);
    inputBufferRef.current = historyItem;
  };
  
  const processCommand = async (command: string) => {
    if (!xtermRef.current) return;
    
    // Special case for clear command
    if (command.toLowerCase() === 'clear') {
      xtermRef.current.clear();
      printPrompt();
      return;
    }
    
    try {
      const result = await commandParser({
        command,
        currentPath: currentPathRef.current,
        fileSystem,
        setCurrentPath: (path) => {
          currentPathRef.current = path;
        }
      });
      
      if (result) {
        if (typeof result === 'string') {
          xtermRef.current.writeln(result);
          setJsxOutput(null);
        } else {
          // For JSX result, set for rendering in DOM
          setJsxOutput(result);
          xtermRef.current.writeln('[Command output displayed below]');
        }
      }
    } catch (error: any) {
      xtermRef.current.writeln('\x1b[1;91m' + (error.message || 'An error occurred') + '\x1b[0m');
      setJsxOutput(null);
    }
    
    printPrompt();
  };
  
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-grow" ref={terminalRef}></div>
      {jsxOutput && (
        <div className="p-2 border-t border-cyber-neon-purple/30 max-h-60 overflow-auto">
          <TerminalOutput output={jsxOutput} />
        </div>
      )}
    </div>
  );
};

export default XTerminal;
