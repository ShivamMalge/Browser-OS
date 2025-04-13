
import React, { useState, useEffect } from 'react';
import { FileNode, useFileSystem } from '../../context/FileSystemContext';
import { FolderOpen, File, ArrowUp, Plus, Trash, Edit, Save, Lock, Unlock, Key, Eye, EyeOff } from 'lucide-react';

const FileExplorer: React.FC = () => {
  const fileSystem = useFileSystem();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [filePassword, setFilePassword] = useState('');
  const [showProtected, setShowProtected] = useState(false);
  const [protectFileDialog, setProtectFileDialog] = useState(false);
  const [protectPassword, setProtectPassword] = useState('');

  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      setFileContent(selectedFile.content || '');
      setFilePassword('');
    }
  }, [selectedFile]);

  const handleFileClick = (file: FileNode) => {
    fileSystem.selectNode(file.id);
    
    // If file is protected, prompt for password
    if (file.type === 'file' && file.isProtected && !showProtected) {
      setSelectedFile(file);
      setShowProtected(false);
    } else {
      setSelectedFile(file);
      setIsEditing(false);
    }
  };

  const handleFolderClick = (folder: FileNode) => {
    fileSystem.navigateTo(folder.path);
    fileSystem.selectNode(null);
    setSelectedFile(null);
    setIsEditing(false);
    setShowProtected(false);
  };

  const handleGoUp = () => {
    const currentPath = fileSystem.currentPath;
    if (currentPath === '/') return;
    
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    fileSystem.navigateTo(parentPath || '/');
    fileSystem.selectNode(null);
    setSelectedFile(null);
    setIsEditing(false);
    setShowProtected(false);
  };

  const handleEditFile = () => {
    if (selectedFile && selectedFile.type === 'file') {
      if (selectedFile.isProtected && !showProtected) {
        alert('You must enter the correct password to edit this file');
      } else {
        setIsEditing(true);
      }
    }
  };

  const handleSaveFile = async () => {
    if (selectedFile && selectedFile.type === 'file') {
      await fileSystem.updateFileContent(selectedFile.id, fileContent);
      setIsEditing(false);
    }
  };

  const handleDeleteFile = async () => {
    if (selectedFile) {
      // If file is protected, prompt for password
      if (selectedFile.type === 'file' && selectedFile.isProtected && !showProtected) {
        alert('You must enter the correct password to delete this file');
        return;
      }
      
      await fileSystem.deleteFileOrFolder(selectedFile.id);
      setSelectedFile(null);
      setShowProtected(false);
    }
  };

  const handleCreateItem = async (type: 'file' | 'folder') => {
    if (!newItemName.trim()) return;
    
    try {
      if (type === 'file') {
        await fileSystem.createNewFile(newItemName, fileSystem.currentPath);
      } else {
        await fileSystem.createNewFolder(newItemName, fileSystem.currentPath);
      }
      
      setNewItemName('');
      setIsCreatingFile(false);
      setIsCreatingFolder(false);
    } catch (error) {
      console.error('Error creating item:', error);
      alert(error instanceof Error ? error.message : 'Error creating item');
    }
  };

  const handleCheckPassword = () => {
    if (selectedFile && selectedFile.isProtected && selectedFile.password === filePassword) {
      setShowProtected(true);
      setFilePassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleProtectFile = async () => {
    if (selectedFile && selectedFile.type === 'file') {
      try {
        if (protectPassword.trim() === '') {
          alert('Password cannot be empty');
          return;
        }
        
        await fileSystem.setFileProtection(
          selectedFile.id, 
          true, 
          protectPassword
        );
        
        // Refresh the selected file
        const updatedNode = fileSystem.getNodeByPath(selectedFile.path);
        if (updatedNode) {
          setSelectedFile(updatedNode);
        }
        
        setProtectFileDialog(false);
        setProtectPassword('');
      } catch (error) {
        console.error('Error protecting file:', error);
      }
    }
  };

  const handleUnprotectFile = async () => {
    if (selectedFile && selectedFile.type === 'file' && selectedFile.isProtected) {
      try {
        await fileSystem.setFileProtection(
          selectedFile.id,
          false,
          ''
        );
        
        // Refresh the selected file
        const updatedNode = fileSystem.getNodeByPath(selectedFile.path);
        if (updatedNode) {
          setSelectedFile(updatedNode);
          setShowProtected(false);
        }
      } catch (error) {
        console.error('Error unprotecting file:', error);
      }
    }
  };

  return (
    <div className="h-full flex">
      {/* File browser */}
      <div className="w-1/3 border-r border-cyber-neon-purple/30 overflow-auto">
        <div className="p-2 border-b border-cyber-neon-purple/30 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={handleGoUp}
              className="p-1 rounded hover:bg-cyber-neon-purple/20"
              disabled={fileSystem.currentPath === '/'}
            >
              <ArrowUp size={16} className={fileSystem.currentPath === '/' ? 'text-gray-500' : 'text-cyber-neon-blue'} />
            </button>
            <span className="ml-2 text-sm truncate">{fileSystem.currentPath}</span>
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={() => setIsCreatingFile(true)}
              className="p-1 rounded hover:bg-cyber-neon-purple/20"
              title="New File"
            >
              <File size={16} className="text-cyber-neon-green" />
            </button>
            <button 
              onClick={() => setIsCreatingFolder(true)}
              className="p-1 rounded hover:bg-cyber-neon-purple/20"
              title="New Folder"
            >
              <FolderOpen size={16} className="text-cyber-neon-blue" />
            </button>
          </div>
        </div>
        
        {/* Create new item form */}
        {(isCreatingFile || isCreatingFolder) && (
          <div className="p-2 border-b border-cyber-neon-purple/30">
            <div className="flex items-center">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={isCreatingFile ? "New file name" : "New folder name"}
                className="flex-1 bg-black/50 border border-cyber-neon-purple/30 rounded p-1 text-sm"
                autoFocus
              />
              <button 
                onClick={() => handleCreateItem(isCreatingFile ? 'file' : 'folder')}
                className="ml-2 p-1 rounded bg-cyber-neon-purple/20 hover:bg-cyber-neon-purple/40"
              >
                <Plus size={16} className="text-cyber-neon-green" />
              </button>
              <button 
                onClick={() => {
                  setIsCreatingFile(false);
                  setIsCreatingFolder(false);
                  setNewItemName('');
                }}
                className="ml-1 p-1 rounded bg-red-900/20 hover:bg-red-900/40"
              >
                <Trash size={16} className="text-red-500" />
              </button>
            </div>
          </div>
        )}
        
        {/* File list */}
        <div className="p-2">
          {fileSystem.isLoading ? (
            <div className="text-center p-4">Loading...</div>
          ) : (
            <div className="space-y-1">
              {fileSystem.getCurrentFolderContents().map((item: FileNode) => (
                <div 
                  key={item.id}
                  onClick={() => item.type === 'folder' ? handleFolderClick(item) : handleFileClick(item)}
                  className={`p-2 rounded flex items-center cursor-pointer hover:bg-cyber-neon-purple/20 
                    ${fileSystem.selectedNodeId === item.id ? 'bg-cyber-neon-purple/30' : ''}`}
                >
                  {item.type === 'folder' ? (
                    <FolderOpen size={16} className="text-cyber-neon-blue mr-2" />
                  ) : (
                    <div className="flex items-center mr-2">
                      <File size={16} className={`${item.name.startsWith('.') ? 'text-gray-500' : 'text-green-400'}`} />
                      {item.isProtected && <Lock size={12} className="text-cyber-neon-pink -ml-2" />}
                    </div>
                  )}
                  <span className={`text-sm truncate ${item.name.startsWith('.') && item.type === 'file' ? 'text-gray-500' : ''}`}>
                    {item.name}
                  </span>
                </div>
              ))}
              
              {fileSystem.getCurrentFolderContents().length === 0 && (
                <div className="text-center p-4 text-gray-500">
                  This folder is empty
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* File preview/editor */}
      <div className="flex-1 overflow-auto">
        {selectedFile ? (
          <div className="p-2 h-full flex flex-col">
            <div className="border-b border-cyber-neon-purple/30 pb-2 mb-2 flex justify-between items-center">
              <div className="flex items-center">
                {selectedFile.type === 'folder' ? (
                  <FolderOpen size={16} className="text-cyber-neon-blue mr-2" />
                ) : (
                  <div className="flex items-center">
                    <File size={16} className="text-green-400 mr-2" />
                    {selectedFile.isProtected && <Lock size={12} className="text-cyber-neon-pink mr-2" />}
                  </div>
                )}
                <span className="text-sm">{selectedFile.name}</span>
              </div>
              
              <div className="flex space-x-2">
                {selectedFile.type === 'file' && !isEditing && !selectedFile.isProtected && (
                  <button 
                    onClick={() => setProtectFileDialog(true)}
                    className="p-1 rounded hover:bg-cyber-neon-purple/20"
                    title="Protect File"
                  >
                    <Lock size={16} className="text-cyber-neon-pink" />
                  </button>
                )}
                
                {selectedFile.type === 'file' && !isEditing && selectedFile.isProtected && showProtected && (
                  <button 
                    onClick={handleUnprotectFile}
                    className="p-1 rounded hover:bg-cyber-neon-purple/20"
                    title="Unprotect File"
                  >
                    <Unlock size={16} className="text-cyber-neon-pink" />
                  </button>
                )}
                
                {selectedFile.type === 'file' && !isEditing && (!selectedFile.isProtected || showProtected) && (
                  <button 
                    onClick={handleEditFile}
                    className="p-1 rounded hover:bg-cyber-neon-purple/20"
                    title="Edit"
                  >
                    <Edit size={16} className="text-cyber-neon-green" />
                  </button>
                )}
                
                {selectedFile.type === 'file' && isEditing && (
                  <button 
                    onClick={handleSaveFile}
                    className="p-1 rounded hover:bg-cyber-neon-purple/20"
                    title="Save"
                  >
                    <Save size={16} className="text-cyber-neon-green" />
                  </button>
                )}
                
                {(!selectedFile.isProtected || showProtected) && (
                  <button 
                    onClick={handleDeleteFile}
                    className="p-1 rounded hover:bg-red-900/20"
                    title="Delete"
                  >
                    <Trash size={16} className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Password dialog for protected files */}
            {selectedFile.type === 'file' && selectedFile.isProtected && !showProtected ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-3/4 p-4 bg-black/50 border border-cyber-neon-purple/30 rounded">
                  <div className="flex justify-center mb-4">
                    <Lock size={48} className="text-cyber-neon-pink" />
                  </div>
                  <h3 className="text-center text-lg mb-4">Protected File</h3>
                  <p className="text-sm mb-4 text-center">
                    This file is password protected. Enter the password to view its contents.
                  </p>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={filePassword}
                      onChange={(e) => setFilePassword(e.target.value)}
                      placeholder="Password"
                      className="flex-1 bg-black/50 border border-cyber-neon-purple/30 rounded p-2"
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckPassword()}
                    />
                    <button
                      onClick={handleCheckPassword}
                      className="bg-cyber-neon-purple/20 hover:bg-cyber-neon-purple/40 px-4 py-2 rounded"
                    >
                      <Key size={16} className="text-cyber-neon-pink" />
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedFile.type === 'file' ? (
              isEditing ? (
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="w-full h-full bg-black/50 border border-cyber-neon-purple/30 rounded p-2 focus:outline-none focus:border-cyber-neon-purple/50 font-mono text-sm resize-none"
                />
              ) : (
                <div className="w-full h-full bg-black/50 border border-cyber-neon-purple/30 rounded p-2 font-mono text-sm whitespace-pre-wrap overflow-auto">
                  {selectedFile.content || ''}
                </div>
              )
            ) : (
              <div className="text-center p-4">
                <FolderOpen size={32} className="text-cyber-neon-blue mx-auto mb-2" />
                <p>Folder: {selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {selectedFile.children?.length || 0} items
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FolderOpen size={48} className="text-cyber-neon-blue mx-auto mb-4 opacity-50" />
              <p className="text-gray-500">Select a file to view or edit</p>
            </div>
          </div>
        )}
        
        {/* Protect file dialog */}
        {protectFileDialog && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="w-1/2 p-4 bg-black border border-cyber-neon-purple/50 rounded">
              <h3 className="text-center text-lg mb-4 flex items-center justify-center">
                <Lock size={20} className="text-cyber-neon-pink mr-2" />
                Protect File
              </h3>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm mb-1">Set a password for "{selectedFile?.name}"</label>
                <input
                  type="password"
                  id="password"
                  value={protectPassword}
                  onChange={(e) => setProtectPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-black/50 border border-cyber-neon-purple/30 rounded p-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setProtectFileDialog(false);
                    setProtectPassword('');
                  }}
                  className="px-4 py-2 rounded border border-cyber-neon-purple/30 hover:bg-cyber-neon-purple/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProtectFile}
                  className="px-4 py-2 rounded bg-cyber-neon-purple/30 hover:bg-cyber-neon-purple/50"
                >
                  Protect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
