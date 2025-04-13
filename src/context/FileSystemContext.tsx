
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  initializeFileSystem, 
  getFileSystem, 
  createFolder, 
  createFile, 
  deleteNode, 
  renameNode,
  setFileProtection,
  searchFiles
} from '../utils/fileSystem';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parent: string | null;
  path: string;
  children?: string[];
  createdAt: number;
  updatedAt: number;
  isProtected?: boolean;
  password?: string;
}

interface FileSystemContextType {
  files: Record<string, FileNode>;
  currentPath: string;
  selectedNodeId: string | null;
  isLoading: boolean;
  navigateTo: (path: string) => void;
  selectNode: (id: string | null) => void;
  createNewFolder: (name: string, parentPath: string) => Promise<void>;
  createNewFile: (name: string, parentPath: string, content?: string, isProtected?: boolean, password?: string) => Promise<void>;
  updateFileContent: (id: string, content: string) => Promise<void>;
  deleteFileOrFolder: (id: string) => Promise<void>;
  renameFileOrFolder: (id: string, newName: string) => Promise<void>;
  getNodeByPath: (path: string) => FileNode | null;
  getCurrentFolderContents: () => FileNode[];
  setFileProtection: (id: string, isProtected: boolean, password: string) => Promise<void>;
  searchFiles: (pattern: string, rootPath?: string) => Promise<FileNode[]>;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<Record<string, FileNode>>({});
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialize file system when component mounts
    const loadFileSystem = async () => {
      setIsLoading(true);
      await initializeFileSystem();
      const fileSystem = await getFileSystem();
      setFiles(fileSystem);
      setIsLoading(false);
    };

    loadFileSystem();
  }, []);

  const refreshFileSystem = async () => {
    const fileSystem = await getFileSystem();
    setFiles(fileSystem);
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSelectedNodeId(null);
  };

  const selectNode = (id: string | null) => {
    setSelectedNodeId(id);
  };

  const createNewFolder = async (name: string, parentPath: string) => {
    await createFolder(name, parentPath);
    await refreshFileSystem();
  };

  const createNewFile = async (
    name: string, 
    parentPath: string, 
    content = '',
    isProtected = false,
    password = ''
  ) => {
    await createFile(name, parentPath, content, isProtected, password);
    await refreshFileSystem();
  };

  const updateFileContent = async (id: string, content: string) => {
    const fileNode = files[id];
    if (fileNode && fileNode.type === 'file') {
      const updatedFile = {
        ...fileNode,
        content,
        updatedAt: Date.now()
      };
      
      // Update in storage
      setFiles(prev => ({ ...prev, [id]: updatedFile }));
      
      // Save to persistent storage
      const fileSystem = { ...files, [id]: updatedFile };
      localStorage.setItem('cyberos-filesystem', JSON.stringify(fileSystem));
    }
  };

  const deleteFileOrFolder = async (id: string) => {
    await deleteNode(id);
    await refreshFileSystem();
  };

  const renameFileOrFolder = async (id: string, newName: string) => {
    await renameNode(id, newName);
    await refreshFileSystem();
  };

  const getNodeByPath = (path: string): FileNode | null => {
    const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
    
    for (const id in files) {
      if (files[id].path === normalizedPath) {
        return files[id];
      }
    }
    
    return null;
  };

  const getCurrentFolderContents = (): FileNode[] => {
    const currentFolder = getNodeByPath(currentPath);
    if (!currentFolder) return [];
    
    // If current folder has children, return them
    if (currentFolder.children?.length) {
      return currentFolder.children
        .map(childId => files[childId])
        .filter(Boolean)
        .sort((a, b) => {
          // Folders first, then files, both alphabetically
          if (a.type === 'folder' && b.type === 'file') return -1;
          if (a.type === 'file' && b.type === 'folder') return 1;
          return a.name.localeCompare(b.name);
        });
    }
    
    return [];
  };

  const protectFile = async (id: string, isProtected: boolean, password: string) => {
    await setFileProtection(id, isProtected, password);
    await refreshFileSystem();
  };

  const searchFilesWrapper = async (pattern: string, rootPath?: string) => {
    const results = await searchFiles(pattern, rootPath || currentPath);
    return results;
  };

  return (
    <FileSystemContext.Provider
      value={{
        files,
        currentPath,
        selectedNodeId,
        isLoading,
        navigateTo,
        selectNode,
        createNewFolder,
        createNewFile,
        updateFileContent,
        deleteFileOrFolder,
        renameFileOrFolder,
        getNodeByPath,
        getCurrentFolderContents,
        setFileProtection: protectFile,
        searchFiles: searchFilesWrapper
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};
