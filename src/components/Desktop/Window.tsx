
import React, { useState, useRef } from 'react';
import { X, Minus, Square } from 'lucide-react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import { useWindowContext } from '../../context/WindowContext';
import XTerminal from '../Terminal/XTerminal';
import FileExplorer from '../FileExplorer/FileExplorer';
import Settings from '../Settings';
import Help from '../Help';

interface WindowProps {
  id: string;
  title: string;
  component: string;
  width: number;
  height: number;
  x: number;
  y: number;
  isActive: boolean;
  zIndex: number;
}

const Window: React.FC<WindowProps> = ({ id, title, component, width, height, x, y, isActive, zIndex }) => {
  const { closeWindow, minimizeWindow, focusWindow } = useWindowContext();
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x, y });
  const [dimensions, setDimensions] = useState({ width, height });
  const [prevDimensions, setPrevDimensions] = useState({ width, height });
  const [prevPosition, setPrevPosition] = useState({ x, y });
  const nodeRef = useRef(null);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeWindow(id);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(id);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMaximized) {
      setDimensions(prevDimensions);
      setPosition(prevPosition);
    } else {
      setPrevDimensions(dimensions);
      setPrevPosition(position);
      setDimensions({ width: window.innerWidth - 10, height: window.innerHeight - 100 });
      setPosition({ x: 5, y: 5 });
    }
    setIsMaximized(!isMaximized);
  };

  const handleFocus = () => {
    focusWindow(id);
  };

  const handleDragStop = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleResize = (e: any, direction: any, ref: any, d: any) => {
    setDimensions({
      width: dimensions.width + d.width,
      height: dimensions.height + d.height
    });
  };

  const renderComponent = () => {
    switch (component) {
      case 'Terminal':
        return <XTerminal />;
      case 'FileExplorer':
        return <FileExplorer />;
      case 'Settings':
        return <Settings />;
      case 'Help':
        return <Help />;
      default:
        return <div>Component not found: {component}</div>;
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-titlebar"
      bounds="parent"
      position={position}
      onStop={handleDragStop}
      disabled={isMaximized}
    >
      <div 
        ref={nodeRef}
        className={`window absolute pointer-events-auto ${isActive ? 'neon-border' : 'border-gray-800'}`}
        style={{ 
          width: dimensions.width, 
          height: dimensions.height, 
          zIndex,
        }}
        onClick={handleFocus}
      >
        <Resizable
          size={{ width: dimensions.width, height: dimensions.height }}
          onResizeStop={handleResize}
          enable={{
            top: !isMaximized,
            right: !isMaximized,
            bottom: !isMaximized,
            left: !isMaximized,
            topRight: !isMaximized,
            bottomRight: !isMaximized,
            bottomLeft: !isMaximized,
            topLeft: !isMaximized
          }}
          minWidth={300}
          minHeight={200}
        >
          <div className="flex flex-col h-full bg-black/90 backdrop-blur-md border border-cyber-neon-blue/30 rounded-md overflow-hidden">
            <div className="window-titlebar flex items-center px-3 py-2 bg-gray-900/70 border-b border-cyber-neon-blue/20 text-white select-none cursor-move">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClose}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                ></button>
                <button
                  onClick={handleMinimize}
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
                ></button>
                <button
                  onClick={handleMaximize}
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                ></button>
              </div>
              <div className="flex-1 text-center text-sm font-mono text-cyber-neon-purple">
                {title}
              </div>
              <div className="w-12"></div> {/* For balanced spacing */}
            </div>
            <div className="window-content flex-1 overflow-auto p-2">
              {renderComponent()}
            </div>
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
};

export default Window;
