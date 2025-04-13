
import { FileNode } from '../context/FileSystemContext';
import { v4 as uuidv4 } from 'uuid';

// Default file system structure
const defaultFileSystem: Record<string, FileNode> = {
  'root': {
    id: 'root',
    name: 'root',
    type: 'folder',
    parent: null,
    path: '/',
    children: ['home', 'system', 'readme', 'mission'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'home': {
    id: 'home',
    name: 'home',
    type: 'folder',
    parent: 'root',
    path: '/home',
    children: ['user', 'documents'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'system': {
    id: 'system',
    name: 'system',
    type: 'folder',
    parent: 'root',
    path: '/system',
    children: ['bin', 'logs', 'config'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'readme': {
    id: 'readme',
    name: 'readme.txt',
    type: 'file',
    parent: 'root',
    path: '/readme.txt',
    content: 'Welcome to CyberOS!\n\nThis is a simulation of a desktop environment with a cyberpunk theme.\n\nYou can use the terminal to navigate the file system, create and edit files.\n\nTry these commands:\n- ls: list files\n- cd: change directory\n- cat: view file contents\n- mkdir: create directory\n- touch: create file\n\nAdvanced commands:\n- nmap: network scanning\n- decrypt: decrypt encrypted files\n- find: find files\n- grep: search in files\n\nGood luck, hacker!',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'mission': {
    id: 'mission',
    name: 'mission.txt',
    type: 'file',
    parent: 'root',
    path: '/mission.txt',
    content: 'ENCRYPTED:Lbhe zvffvba vf gb svaq gur uvqqra npprff pbqr gb gur frpher freire. Frnepu sbe pyhrp va gur svyrf naq hfr gur gbbyf ng lbhe qvfcbfny. Gur svefg pyhr vf va gur flfgrz ybtf.',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'user': {
    id: 'user',
    name: 'user',
    type: 'folder',
    parent: 'home',
    path: '/home/user',
    children: ['notes', 'secrets', 'hacking-tools'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'documents': {
    id: 'documents',
    name: 'documents',
    type: 'folder',
    parent: 'home',
    path: '/home/documents',
    children: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'bin': {
    id: 'bin',
    name: 'bin',
    type: 'folder',
    parent: 'system',
    path: '/system/bin',
    children: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'logs': {
    id: 'logs',
    name: 'logs',
    type: 'folder',
    parent: 'system',
    path: '/system/logs',
    children: ['system-log', 'access-log', 'security-log'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'config': {
    id: 'config',
    name: 'config',
    type: 'folder',
    parent: 'system',
    path: '/system/config',
    children: ['firewall-config', '.secrets'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'system-log': {
    id: 'system-log',
    name: 'system.log',
    type: 'file',
    parent: 'logs',
    path: '/system/logs/system.log',
    content: '2023-01-01 00:00:01 [INFO] System initialized\n2023-01-01 00:00:02 [WARNING] Unauthorized access attempt detected\n2023-01-01 00:00:03 [ERROR] Security breach in sector 7G\n2023-01-01 00:00:04 [INFO] Countermeasures activated\n2023-01-01 00:00:05 [INFO] System secured\n2023-01-01 00:00:06 [INFO] Recent activity detected in sector 9F\n2023-01-01 00:00:07 [INFO] Check access-log for details',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'access-log': {
    id: 'access-log',
    name: 'access.log',
    type: 'file',
    parent: 'logs',
    path: '/system/logs/access.log',
    content: '2023-01-01 00:00:01 - admin logged in from 192.168.1.1\n2023-01-01 00:00:02 - admin accessed /system/config\n2023-01-01 00:00:03 - admin modified firewall rules\n2023-01-01 00:00:04 - admin created backup: backup-20230101.dat\n2023-01-01 00:00:05 - admin logged out\n2023-01-01 00:10:15 - unknown user attempted login from 10.0.0.5\n2023-01-01 00:10:16 - login failed: incorrect credentials\n2023-01-01 00:10:17 - security alert triggered\n2023-01-01 00:10:18 - IP 10.0.0.5 blocked for 24 hours',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'security-log': {
    id: 'security-log',
    name: 'security.log',
    type: 'file',
    parent: 'logs',
    path: '/system/logs/security.log',
    content: '2023-01-01 00:00:01 [INFO] Security module initialized\n2023-01-01 00:00:02 [INFO] Firewall rules loaded\n2023-01-01 00:00:03 [INFO] Encryption keys verified\n2023-01-01 00:10:15 [WARNING] Multiple failed login attempts detected\n2023-01-01 00:10:16 [ALERT] Possible brute force attack\n2023-01-01 00:10:17 [INFO] IP blocked: 10.0.0.5\n2023-01-01 00:10:18 [INFO] Security notification sent to admin\n2023-01-01 00:10:19 [INFO] Check for clues in user home directory',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'firewall-config': {
    id: 'firewall-config',
    name: 'firewall.conf',
    type: 'file',
    parent: 'config',
    path: '/system/config/firewall.conf',
    content: '# Firewall Configuration\n\n# Allow SSH access\nALLOW ssh 22/tcp\n\n# Allow HTTP/HTTPS\nALLOW www 80/tcp\nALLOW www-secure 443/tcp\n\n# Block all other incoming traffic\nDENY * */tcp\n\n# Secret backdoor for emergency access\n# ALLOW secret-access 9945/tcp # DISABLED',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  '.secrets': {
    id: '.secrets',
    name: '.secrets',
    type: 'file',
    parent: 'config',
    path: '/system/config/.secrets',
    content: '# Security credentials\n\n# Admin password (encrypted)\nADMIN_PASSWORD=5f4dcc3b5aa765d61d8327deb882cf99\n\n# Backdoor access code\nBACKDOOR_CODE=CYBER9945\n\n# Secret decryption key\nDECRYPTION_KEY=CYBERKEY\n\n# DO NOT SHARE THIS FILE!',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'notes': {
    id: 'notes',
    name: 'notes.txt',
    type: 'file',
    parent: 'user',
    path: '/home/user/notes.txt',
    content: 'Remember to check the hidden files for clues. The password might be hidden somewhere in the system.\n\nImportant commands for cybersecurity investigation:\n- nmap: scan for open ports\n- ssh: connect to remote systems\n- crack: try to break password hashes\n- decrypt: decode encrypted files\n\nI know there\'s a backdoor somewhere in the firewall configuration.',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'secrets': {
    id: 'secrets',
    name: 'secrets',
    type: 'folder',
    parent: 'user',
    path: '/home/user/secrets',
    children: ['hidden-file', 'encrypted-data', 'protected-file'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'hidden-file': {
    id: 'hidden-file',
    name: '.hidden',
    type: 'file',
    parent: 'secrets',
    path: '/home/user/secrets/.hidden',
    content: 'Congratulations on finding this file!\nThe access code to the next level is: CYBER9945\nUse this in the terminal with the command: unlock CYBER9945',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'encrypted-data': {
    id: 'encrypted-data',
    name: 'encrypted.dat',
    type: 'file',
    parent: 'secrets',
    path: '/home/user/secrets/encrypted.dat',
    content: 'ENCRYPTED:Guvf svyr pbagnvaf frperg vasbezngvba nobhg gur arkg zvffvba. Vs lbh pna ernq guvf, hfr gur npprff pbqr gb haybpx gur arkg yriry. Gur svanyf pbqr vf: GLYQENVQ426.',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'protected-file': {
    id: 'protected-file',
    name: 'topsecret.txt',
    type: 'file',
    parent: 'secrets',
    path: '/home/user/secrets/topsecret.txt',
    content: 'This is a highly classified document.\n\nMainframe access credentials:\nUsername: sysadmin\nPassword: SYSTEM_ACCESS_9000\n\nUse these credentials with extreme caution.',
    isProtected: true,
    password: 'CYBERKEY',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'hacking-tools': {
    id: 'hacking-tools',
    name: 'hacking-tools',
    type: 'folder',
    parent: 'user',
    path: '/home/user/hacking-tools',
    children: ['password-list', 'exploit-db'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'password-list': {
    id: 'password-list',
    name: 'passwords.txt',
    type: 'file',
    parent: 'hacking-tools',
    path: '/home/user/hacking-tools/passwords.txt',
    content: '# Common passwords for brute force attacks\npassword\n123456\nadmin\nroot\nletmein\npassword123\nqwerty\nabc123\nadmin123\ndefault\n\n# Admin might be using one of these formats\n[username]-[birthdate]\n[pet]-[year]\n[company][year]',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  'exploit-db': {
    id: 'exploit-db',
    name: 'exploits.db',
    type: 'file',
    parent: 'hacking-tools',
    path: '/home/user/hacking-tools/exploits.db',
    content: '# Known exploits database\n\nCVE-2023-1234: Remote Code Execution in Legacy Systems\nCVE-2023-5678: SQL Injection in Database Server\nCVE-2023-9012: Buffer Overflow in Network Services\nCVE-2023-3456: Cross-Site Scripting in Web Interface\nCVE-2023-7890: Privilege Escalation in Admin Panel\n\n# Notes\nThe firewall may be vulnerable to CVE-2023-1234\nTry using port 9945 for backdoor access',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
};

// Initialize the file system
export const initializeFileSystem = async (): Promise<void> => {
  // Check if file system already exists in localStorage
  const existingFileSystem = localStorage.getItem('cyberos-filesystem');
  
  if (!existingFileSystem) {
    // If not, create default file system
    localStorage.setItem('cyberos-filesystem', JSON.stringify(defaultFileSystem));
  }
};

// Get the entire file system
export const getFileSystem = async (): Promise<Record<string, FileNode>> => {
  const fileSystemJson = localStorage.getItem('cyberos-filesystem');
  if (!fileSystemJson) {
    await initializeFileSystem();
    return getFileSystem();
  }
  
  return JSON.parse(fileSystemJson);
};

// Resolve paths
export const resolvePath = (currentPath: string, targetPath: string): string => {
  // Absolute path
  if (targetPath.startsWith('/')) {
    return normalizePath(targetPath);
  }
  
  // Current directory
  if (targetPath === '.') {
    return currentPath;
  }
  
  // Parent directory
  if (targetPath === '..') {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length === 0) return '/';
    parts.pop();
    return '/' + parts.join('/');
  }
  
  // Relative path
  const basePath = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
  return normalizePath(`${basePath}${targetPath}`);
};

// Normalize path (remove duplicate slashes, resolve . and ..)
export const normalizePath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  const resultParts: string[] = [];
  
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resultParts.pop();
      continue;
    }
    resultParts.push(part);
  }
  
  return '/' + resultParts.join('/');
};

// Create a new folder
export const createFolder = async (name: string, parentPath: string): Promise<void> => {
  const fileSystem = await getFileSystem();
  
  // Find the parent node
  let parentNode: FileNode | null = null;
  for (const id in fileSystem) {
    if (fileSystem[id].path === parentPath) {
      parentNode = fileSystem[id];
      break;
    }
  }
  
  if (!parentNode || parentNode.type !== 'folder') {
    throw new Error(`Invalid parent path: ${parentPath}`);
  }
  
  // Check if folder already exists
  if (parentNode.children?.some(childId => {
    const child = fileSystem[childId];
    return child.name === name && child.type === 'folder';
  })) {
    throw new Error(`Folder already exists: ${name}`);
  }
  
  // Create the folder
  const folderId = uuidv4();
  const folderPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
  
  const newFolder: FileNode = {
    id: folderId,
    name,
    type: 'folder',
    parent: parentNode.id,
    path: folderPath,
    children: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  // Update parent's children
  parentNode.children = parentNode.children || [];
  parentNode.children.push(folderId);
  
  // Update the file system
  const updatedFileSystem = {
    ...fileSystem,
    [folderId]: newFolder,
    [parentNode.id]: parentNode
  };
  
  localStorage.setItem('cyberos-filesystem', JSON.stringify(updatedFileSystem));
};

// Create a new file
export const createFile = async (
  name: string, 
  parentPath: string, 
  content = '', 
  isProtected = false,
  password = ''
): Promise<void> => {
  const fileSystem = await getFileSystem();
  
  // Find the parent node
  let parentNode: FileNode | null = null;
  for (const id in fileSystem) {
    if (fileSystem[id].path === parentPath) {
      parentNode = fileSystem[id];
      break;
    }
  }
  
  if (!parentNode || parentNode.type !== 'folder') {
    throw new Error(`Invalid parent path: ${parentPath}`);
  }
  
  // Check if file already exists
  if (parentNode.children?.some(childId => {
    const child = fileSystem[childId];
    return child.name === name && child.type === 'file';
  })) {
    throw new Error(`File already exists: ${name}`);
  }
  
  // Create the file
  const fileId = uuidv4();
  const filePath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
  
  const newFile: FileNode = {
    id: fileId,
    name,
    type: 'file',
    parent: parentNode.id,
    path: filePath,
    content,
    isProtected,
    password,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  // Update parent's children
  parentNode.children = parentNode.children || [];
  parentNode.children.push(fileId);
  
  // Update the file system
  const updatedFileSystem = {
    ...fileSystem,
    [fileId]: newFile,
    [parentNode.id]: parentNode
  };
  
  localStorage.setItem('cyberos-filesystem', JSON.stringify(updatedFileSystem));
};

// Delete a node (file or folder)
export const deleteNode = async (id: string): Promise<void> => {
  const fileSystem = await getFileSystem();
  
  const node = fileSystem[id];
  if (!node) {
    throw new Error(`Node not found: ${id}`);
  }
  
  // If it's a folder, delete all its children recursively
  if (node.type === 'folder' && node.children) {
    for (const childId of node.children) {
      await deleteNode(childId);
    }
  }
  
  // Update parent's children list
  if (node.parent && fileSystem[node.parent]) {
    const parent = fileSystem[node.parent];
    parent.children = parent.children?.filter(childId => childId !== id);
    fileSystem[node.parent] = parent;
  }
  
  // Delete the node
  const { [id]: deletedNode, ...updatedFileSystem } = fileSystem;
  
  localStorage.setItem('cyberos-filesystem', JSON.stringify(updatedFileSystem));
};

// Rename a node
export const renameNode = async (id: string, newName: string): Promise<void> => {
  const fileSystem = await getFileSystem();
  
  const node = fileSystem[id];
  if (!node) {
    throw new Error(`Node not found: ${id}`);
  }
  
  // Check if a node with the same name already exists in the same directory
  if (node.parent) {
    const parent = fileSystem[node.parent];
    if (parent.children?.some(childId => {
      const child = fileSystem[childId];
      return child.id !== id && child.name === newName;
    })) {
      throw new Error(`A file or folder with the name '${newName}' already exists`);
    }
  }
  
  // Update the node's name and path
  const pathParts = node.path.split('/');
  pathParts[pathParts.length - 1] = newName;
  const newPath = pathParts.join('/');
  
  const updatedNode = {
    ...node,
    name: newName,
    path: newPath,
    updatedAt: Date.now()
  };
  
  // Update the file system
  const updatedFileSystem = {
    ...fileSystem,
    [id]: updatedNode
  };
  
  localStorage.setItem('cyberos-filesystem', JSON.stringify(updatedFileSystem));
};

// Set or update file protection
export const setFileProtection = async (id: string, isProtected: boolean, password: string): Promise<void> => {
  const fileSystem = await getFileSystem();
  
  const node = fileSystem[id];
  if (!node) {
    throw new Error(`Node not found: ${id}`);
  }
  
  if (node.type !== 'file') {
    throw new Error(`Protection can only be set on files: ${node.path}`);
  }
  
  const updatedNode = {
    ...node,
    isProtected,
    password,
    updatedAt: Date.now()
  };
  
  // Update the file system
  const updatedFileSystem = {
    ...fileSystem,
    [id]: updatedNode
  };
  
  localStorage.setItem('cyberos-filesystem', JSON.stringify(updatedFileSystem));
};

// Handle file search with patterns (for find command)
export const searchFiles = async (pattern: string, rootPath: string = '/'): Promise<FileNode[]> => {
  const fileSystem = await getFileSystem();
  const results: FileNode[] = [];
  
  // Find the root node for search
  let rootNode: FileNode | null = null;
  for (const id in fileSystem) {
    if (fileSystem[id].path === rootPath) {
      rootNode = fileSystem[id];
      break;
    }
  }
  
  if (!rootNode) {
    throw new Error(`Invalid search path: ${rootPath}`);
  }
  
  // Recursive search function
  const searchNode = (node: FileNode) => {
    // Check if node name matches pattern
    if (node.name.toLowerCase().includes(pattern.toLowerCase())) {
      results.push(node);
    }
    
    // If this is a folder, search its children
    if (node.type === 'folder' && node.children?.length) {
      for (const childId of node.children) {
        const childNode = fileSystem[childId];
        if (childNode) {
          searchNode(childNode);
        }
      }
    }
  };
  
  searchNode(rootNode);
  return results;
};

