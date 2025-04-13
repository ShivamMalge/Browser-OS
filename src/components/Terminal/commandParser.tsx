
import React from 'react';
import { FileNode } from '../../context/FileSystemContext';
import { resolvePath, normalizePath } from '../../utils/fileSystem';

interface CommandProps {
  command: string;
  currentPath: string;
  fileSystem: any;
  setCurrentPath: (path: string) => void;
}

export const commandParser = async ({ 
  command, 
  currentPath, 
  fileSystem,
  setCurrentPath 
}: CommandProps): Promise<JSX.Element | string | null> => {
  // Parse the command
  const parts = command.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  // Command handlers
  const handlers: Record<string, Function> = {
    cd: () => handleCd(args, currentPath, fileSystem, setCurrentPath),
    ls: () => handleLs(args, currentPath, fileSystem),
    pwd: () => currentPath,
    cat: () => handleCat(args, currentPath, fileSystem),
    mkdir: () => handleMkdir(args, currentPath, fileSystem),
    touch: () => handleTouch(args, currentPath, fileSystem),
    rm: () => handleRm(args, currentPath, fileSystem),
    echo: () => handleEcho(args),
    clear: () => { window.location.reload(); return "Clearing terminal..."; },
    help: () => handleHelp(),
    nmap: () => handleNmap(args),
    ssh: () => handleSsh(args),
    sqlmap: () => handleSqlmap(args),
    decrypt: () => handleDecrypt(args, currentPath, fileSystem),
    scan: () => handleScan(args),
    crack: () => handleCrack(args),
    unlock: () => handleUnlock(args, currentPath, fileSystem),
    find: () => handleFind(args, currentPath, fileSystem),
    grep: () => handleGrep(args, currentPath, fileSystem),
    chmod: () => handleChmod(args, currentPath, fileSystem),
    whoami: () => "user@cyber-sec-terminal",
    ifconfig: () => handleIfconfig(),
    netstat: () => handleNetstat(),
    ps: () => handlePs(),
    top: () => handleTop(),
    sudo: () => handleSudo(args),
    openssl: () => handleOpenssl(args)
  };
  
  // Execute the command if it exists
  if (handlers[cmd]) {
    return await handlers[cmd]();
  } else {
    return `Command not found: ${cmd}. Type 'help' for available commands.`;
  }
};

const handleCd = (
  args: string[], 
  currentPath: string, 
  fileSystem: any,
  setCurrentPath: (path: string) => void
): string | null => {
  if (args.length === 0) {
    setCurrentPath('/');
    return null;
  }
  
  const targetPath = resolvePath(currentPath, args[0]);
  const targetNode = fileSystem.getNodeByPath(targetPath);
  
  if (!targetNode) {
    throw new Error(`cd: no such directory: ${args[0]}`);
  }
  
  if (targetNode.type !== 'folder') {
    throw new Error(`cd: not a directory: ${args[0]}`);
  }
  
  setCurrentPath(targetPath);
  return null;
};

const handleLs = (
  args: string[], 
  currentPath: string, 
  fileSystem: any
): JSX.Element => {
  const path = args.length > 0 ? resolvePath(currentPath, args[0]) : currentPath;
  const node = fileSystem.getNodeByPath(path);
  
  if (!node) {
    throw new Error(`ls: no such directory: ${args[0]}`);
  }
  
  if (node.type !== 'folder') {
    throw new Error(`ls: not a directory: ${args[0]}`);
  }
  
  const children = node.children?.map(childId => fileSystem.files[childId]) || [];
  
  if (children.length === 0) {
    return <div>Directory is empty</div>;
  }
  
  // Check for -a flag to show hidden files
  const showHidden = args.includes('-a') || args.includes('--all');
  
  // Filter hidden files unless -a flag is present
  const filteredChildren = showHidden ? 
    children : 
    children.filter((child: FileNode) => !child.name.startsWith('.'));
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {filteredChildren.map((child: FileNode) => (
        <div key={child.id} className="truncate">
          {child.type === 'folder' ? (
            <span className="neon-blue-text">{child.name}/</span>
          ) : (
            <span className={child.name.startsWith('.') ? 'text-gray-500' : 'text-green-300'}>
              {child.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const handleCat = (
  args: string[], 
  currentPath: string, 
  fileSystem: any
): string | JSX.Element => {
  if (args.length === 0) {
    return 'cat: missing file operand';
  }
  
  const path = resolvePath(currentPath, args[0]);
  const node = fileSystem.getNodeByPath(path);
  
  if (!node) {
    throw new Error(`cat: no such file: ${args[0]}`);
  }
  
  if (node.type !== 'file') {
    throw new Error(`cat: ${args[0]}: Is a directory`);
  }
  
  // Check if the file is protected and requires a password
  if (node.isProtected) {
    if (args.length < 2) {
      return <div className="text-red-400">This file is password protected. Usage: cat [file] [password]</div>;
    }
    
    const password = args[1];
    if (password !== node.password) {
      return <div className="text-red-400">Incorrect password for protected file.</div>;
    }
  }
  
  return node.content || '';
};

const handleMkdir = async (
  args: string[], 
  currentPath: string, 
  fileSystem: any
): Promise<string> => {
  if (args.length === 0) {
    return 'mkdir: missing operand';
  }
  
  const name = args[0];
  
  if (name.includes('/')) {
    const parentPath = normalizePath(currentPath + '/' + name.substring(0, name.lastIndexOf('/')));
    const folderName = name.substring(name.lastIndexOf('/') + 1);
    await fileSystem.createNewFolder(folderName, parentPath);
  } else {
    await fileSystem.createNewFolder(name, currentPath);
  }
  
  return `Directory created: ${name}`;
};

const handleTouch = async (
  args: string[], 
  currentPath: string, 
  fileSystem: any
): Promise<string> => {
  if (args.length === 0) {
    return 'touch: missing file operand';
  }
  
  const name = args[0];
  
  if (name.includes('/')) {
    const parentPath = normalizePath(currentPath + '/' + name.substring(0, name.lastIndexOf('/')));
    const fileName = name.substring(name.lastIndexOf('/') + 1);
    await fileSystem.createNewFile(fileName, parentPath);
  } else {
    await fileSystem.createNewFile(name, currentPath);
  }
  
  return `File created: ${name}`;
};

const handleRm = async (
  args: string[], 
  currentPath: string, 
  fileSystem: any
): Promise<string> => {
  if (args.length === 0) {
    return 'rm: missing operand';
  }
  
  // Check for recursive flag
  const isRecursive = args.includes('-r') || args.includes('-rf') || args.includes('--recursive');
  
  // Get actual file path (removing any flags)
  const filePath = args.find(arg => !arg.startsWith('-')) || '';
  
  const path = resolvePath(currentPath, filePath);
  const node = fileSystem.getNodeByPath(path);
  
  if (!node) {
    throw new Error(`rm: no such file or directory: ${filePath}`);
  }
  
  if (node.path === '/' || node.path === '/system' || node.path === '/home') {
    throw new Error(`rm: cannot remove '${node.path}': Permission denied`);
  }
  
  // Check if trying to delete non-empty folder without recursive flag
  if (node.type === 'folder' && node.children?.length && !isRecursive) {
    throw new Error(`rm: cannot remove '${node.name}': Is a directory. Use -r for recursive removal.`);
  }
  
  await fileSystem.deleteFileOrFolder(node.id);
  return `Removed: ${node.name}`;
};

const handleEcho = (args: string[]): string => {
  return args.join(' ');
};

const handleHelp = (): JSX.Element => {
  return (
    <div>
      <p className="mb-1">Available commands:</p>
      <div className="grid grid-cols-2 gap-1">
        <p className="mb-1"><span className="neon-blue-text">cd</span> [directory] - Change directory</p>
        <p className="mb-1"><span className="neon-blue-text">ls</span> [-a] [directory] - List directory contents</p>
        <p className="mb-1"><span className="neon-blue-text">pwd</span> - Print working directory</p>
        <p className="mb-1"><span className="neon-blue-text">cat</span> [file] [password] - Display file contents</p>
        <p className="mb-1"><span className="neon-blue-text">mkdir</span> [directory] - Create directory</p>
        <p className="mb-1"><span className="neon-blue-text">touch</span> [file] - Create empty file</p>
        <p className="mb-1"><span className="neon-blue-text">rm</span> [-r] [file/directory] - Remove file or directory</p>
        <p className="mb-1"><span className="neon-blue-text">echo</span> [text] - Print text</p>
        <p className="mb-1"><span className="neon-blue-text">clear</span> - Clear terminal</p>
        <p className="mb-1"><span className="neon-blue-text">find</span> [pattern] - Find files matching pattern</p>
        <p className="mb-1"><span className="neon-blue-text">grep</span> [pattern] [file] - Search for pattern in file</p>
        <p className="mb-1"><span className="neon-blue-text">chmod</span> [permissions] [file] - Change file permissions</p>
        <p className="mb-1"><span className="neon-blue-text">nmap</span> [target] - Network scanning tool</p>
        <p className="mb-1"><span className="neon-blue-text">ssh</span> [user@host] - Secure shell connection</p>
        <p className="mb-1"><span className="neon-blue-text">sqlmap</span> [url] - SQL injection scanner</p>
        <p className="mb-1"><span className="neon-blue-text">decrypt</span> [file] - Attempt to decrypt a file</p>
        <p className="mb-1"><span className="neon-blue-text">scan</span> [target] - Run a vulnerability scan</p>
        <p className="mb-1"><span className="neon-blue-text">crack</span> [hash] - Attempt to crack a password hash</p>
        <p className="mb-1"><span className="neon-blue-text">unlock</span> [code] - Unlock a secured resource</p>
        <p className="mb-1"><span className="neon-blue-text">whoami</span> - Display current user</p>
        <p className="mb-1"><span className="neon-blue-text">ifconfig</span> - Display network interfaces</p>
        <p className="mb-1"><span className="neon-blue-text">netstat</span> - Display network connections</p>
        <p className="mb-1"><span className="neon-blue-text">openssl</span> - OpenSSL cryptographic tool</p>
      </div>
    </div>
  );
};

const handleNmap = (args: string[]): JSX.Element => {
  if (args.length === 0) {
    return <div className="text-red-400">nmap: missing target operand</div>;
  }
  
  const target = args[0];
  
  return (
    <div>
      <p className="text-green-400 mb-1">Starting Nmap scan on {target}...</p>
      <p className="mb-1">Scanning {target} [1000 ports]</p>
      <p className="mb-1">Discovered open port 22/tcp on {target}</p>
      <p className="mb-1">Discovered open port 80/tcp on {target}</p>
      <p className="mb-1">Discovered open port 443/tcp on {target}</p>
      <p className="mb-1">Discovered open port 9945/tcp on {target}</p>
      <p className="mb-1">Completed scan on {target} in 3.71 seconds</p>
      <p className="text-yellow-400 mb-1">Warning: Potential vulnerabilities detected on ports 22, 9945</p>
    </div>
  );
};

const handleSsh = (args: string[]): JSX.Element => {
  if (args.length === 0) {
    return <div className="text-red-400">ssh: missing host operand</div>;
  }
  
  const target = args[0];
  let port = "22";
  
  // Check for port specification
  if (args.includes("-p") && args.length > args.indexOf("-p") + 1) {
    port = args[args.indexOf("-p") + 1];
  }
  
  if (target === "admin@192.168.1.1" && port === "9945") {
    return (
      <div>
        <p className="text-green-400 mb-1">Connecting to admin@192.168.1.1 on port 9945...</p>
        <p className="mb-1">Attempting authentication...</p>
        <p className="mb-1">Password required:</p>
        <p className="mb-1">Hint: The backdoor password is hidden in a configuration file.</p>
      </div>
    );
  }
  
  return (
    <div>
      <p className="text-green-400 mb-1">Attempting SSH connection to {target} on port {port}...</p>
      <p className="mb-1">Connection established.</p>
      <p className="mb-1">Authentication failed.</p>
      <p className="text-yellow-400 mb-1">Hint: Try using: ssh user@host -p [port] with the correct credentials</p>
    </div>
  );
};

const handleSqlmap = (args: string[]): JSX.Element => {
  if (args.length === 0) {
    return <div className="text-red-400">sqlmap: missing URL operand</div>;
  }
  
  const target = args[0];
  
  return (
    <div>
      <p className="text-green-400 mb-1">Starting SQL injection scan on {target}...</p>
      <p className="mb-1">Testing GET parameters...</p>
      <p className="mb-1">Testing POST parameters...</p>
      <p className="mb-1">Checking for SQL injection vulnerabilities...</p>
      <p className="text-green-400 mb-1">Found potential SQL injection at parameter 'id'</p>
      <p className="text-yellow-400 mb-1">Database type: MySQL</p>
      <p className="mb-1">Available databases: [users, products, logs]</p>
      <p className="mb-1">Extracting data...</p>
      <p className="mb-1">Found table: users</p>
      <p className="mb-1">Columns: [id, username, password_hash, email, created_at]</p>
      <p className="mb-1">First record: [1, admin, 5f4dcc3b5aa765d61d8327deb882cf99, admin@system.local, 2023-01-01]</p>
    </div>
  );
};

const handleDecrypt = async (
  args: string[], 
  currentPath: string, 
  fileSystem: any
): Promise<JSX.Element | string> => {
  if (args.length === 0) {
    return <div className="text-red-400">decrypt: missing file operand</div>;
  }
  
  const path = resolvePath(currentPath, args[0]);
  const node = fileSystem.getNodeByPath(path);
  
  if (!node) {
    return <div className="text-red-400">decrypt: no such file: {args[0]}</div>;
  }
  
  if (node.type !== 'file') {
    return <div className="text-red-400">decrypt: {args[0]}: Is a directory</div>;
  }
  
  if (node.name.includes('encrypted') || (node.content && node.content.includes('ENCRYPTED'))) {
    // Caesar cipher decryption (ROT13)
    const decryptedContent = node.content?.replace('ENCRYPTED:', 'DECRYPTED:').replace(/[A-Za-z]/g, c => 
      String.fromCharCode((c.charCodeAt(0) + 13 - (c.toLowerCase() >= 'a' ? 97 : 65)) % 26 
      + (c.toLowerCase() >= 'a' ? 97 : 65))
    );
    
    // If password is provided as second argument
    if (args.length > 1 && args[1] === "CYBERKEY") {
      // Full decryption with correct key
      return (
        <div>
          <p className="text-green-400 mb-1">Decryption successful with key: {args[1]}</p>
          <div className="p-2 bg-black/30 border border-green-500/30 font-mono text-green-400">
            {decryptedContent}
          </div>
          <p className="text-yellow-400 mt-1">File fully decrypted!</p>
        </div>
      );
    }
    
    return (
      <div>
        <p className="text-green-400 mb-1">Attempting to decrypt {node.name}...</p>
        <p className="mb-1">Analyzing encryption algorithm...</p>
        <p className="mb-1">Testing common keys...</p>
        <p className="text-yellow-400 mb-1">Decryption partially successful:</p>
        <div className="p-2 bg-black/30 border border-green-500/30 font-mono text-green-400">
          {decryptedContent}
        </div>
        <p className="text-yellow-400 mt-1">For full decryption, try specifying a key: decrypt {node.name} [key]</p>
      </div>
    );
  } else {
    return <div className="text-yellow-400">File does not appear to be encrypted or uses unknown encryption.</div>;
  }
};

const handleScan = (args: string[]): JSX.Element => {
  if (args.length === 0) {
    return <div className="text-red-400">scan: missing target operand</div>;
  }
  
  const target = args[0];
  
  return (
    <div>
      <p className="text-green-400 mb-1">Running vulnerability scan on {target}...</p>
      <p className="mb-1">Checking for common vulnerabilities...</p>
      <p className="mb-1">Testing for XSS vulnerabilities...</p>
      <p className="mb-1">Testing for CSRF vulnerabilities...</p>
      <p className="mb-1">Testing for injection attacks...</p>
      <p className="text-yellow-400 mb-1">Discovered potential vulnerabilities:</p>
      <p className="mb-1">- Outdated software versions</p>
      <p className="mb-1">- Unpatched CVE-2023-1234</p>
      <p className="mb-1">- Weak password policy</p>
      <p className="mb-1">- Unauthorized backdoor on port 9945</p>
    </div>
  );
};

const handleCrack = (args: string[]): JSX.Element => {
  if (args.length === 0) {
    return <div className="text-red-400">crack: missing hash operand</div>;
  }
  
  const hash = args[0];
  
  // Check for known hashes
  const knownHashes: Record<string, string> = {
    "5f4dcc3b5aa765d61d8327deb882cf99": "password",
    "81b637d8fcd2c6da6359e6963113a1170de795e4b725b84d1e0b4cfd9ec58ce9": "cyber",
    "e10adc3949ba59abbe56e057f20f883e": "123456"
  };
  
  if (knownHashes[hash]) {
    return (
      <div>
        <p className="text-green-400 mb-1">Hash cracked!</p>
        <p className="mb-1">Original value: "{knownHashes[hash]}"</p>
        <p className="mb-1">Hash type: {hash.length === 32 ? "MD5" : "SHA-256"}</p>
      </div>
    );
  }
  
  return (
    <div>
      <p className="text-green-400 mb-1">Attempting to crack hash: {hash}</p>
      <p className="mb-1">Identifying hash type: {hash.length === 32 ? "Likely MD5" : hash.length === 64 ? "Likely SHA-256" : "Unknown"}</p>
      <p className="mb-1">Running dictionary attack...</p>
      <p className="mb-1">Trying brute force approach...</p>
      <p className="text-yellow-400 mb-1">Failed to crack hash. Try a different approach or a longer time period.</p>
    </div>
  );
};

const handleUnlock = (
  args: string[],
  currentPath: string, 
  fileSystem: any
): JSX.Element => {
  if (args.length === 0) {
    return <div className="text-red-400">unlock: missing code operand</div>;
  }
  
  const code = args[0];
  
  // Access code found in hidden file
  if (code === 'CYBER9945') {
    // Reveal hidden content in current directory
    const currentFolder = fileSystem.getNodeByPath(currentPath);
    if (currentFolder && currentFolder.id) {
      // Create a new file with secret information
      setTimeout(async () => {
        try {
          await fileSystem.createNewFile('UNLOCKED.txt', currentPath, 
            'Congratulations! You have successfully accessed the secured area.\n' +
            'The next phase of your mission is to:\n' +
            '1. Find the admin credentials\n' +
            '2. Decrypt the main server files\n' +
            '3. Access the mainframe using the key: MAINFRAME_ACCESS_CYBERKEY\n\n' +
            'Good luck, hacker!'
          );
        } catch (error) {
          console.error('Error creating unlocked file:', error);
        }
      }, 1000);
    }
    
    return (
      <div>
        <p className="text-green-400 mb-1">Access granted!</p>
        <p className="mb-1">Unlocking restricted area...</p>
        <p className="mb-1">Welcome to the next level.</p>
        <p className="mb-1">Creating access file in current directory...</p>
      </div>
    );
  } else if (code === 'MAINFRAME_ACCESS_CYBERKEY') {
    return (
      <div>
        <p className="text-green-400 mb-1">Mainframe access granted!</p>
        <p className="mb-1">Congratulations, you've completed the cyber challenge!</p>
        <p className="mb-1">You've successfully infiltrated the system and proven your cybersecurity skills.</p>
        <p className="text-yellow-400 mb-1">Final access code: CYBER_MASTER_2023</p>
      </div>
    );
  } else {
    return (
      <div>
        <p className="text-red-400 mb-1">Access denied. Invalid code: {code}</p>
        <p className="mb-1">Security alert triggered.</p>
        <p className="mb-1">This attempt has been logged.</p>
      </div>
    );
  }
};

const handleFind = (
  args: string[], 
  currentPath: string, 
  fileSystem: any
): JSX.Element => {
  if (args.length === 0) {
    return <div className="text-red-400">find: missing pattern operand</div>;
  }
  
  const pattern = args[0].toLowerCase();
  const searchPath = args.length > 1 ? resolvePath(currentPath, args[1]) : currentPath;
  
  // Recursive search function
  const searchFiles = (nodeId: string, results: FileNode[] = []): FileNode[] => {
    const node = fileSystem.files[nodeId];
    if (!node) return results;
    
    // Check if this node matches the pattern
    if (node.name.toLowerCase().includes(pattern)) {
      results.push(node);
    }
    
    // If this is a folder, search its children
    if (node.type === 'folder' && node.children?.length) {
      for (const childId of node.children) {
        searchFiles(childId, results);
      }
    }
    
    return results;
  };
  
  // Get the root node for the search
  const searchNode = fileSystem.getNodeByPath(searchPath);
  if (!searchNode) {
    return <div className="text-red-400">find: '{searchPath}': No such file or directory</div>;
  }
  
  // Start the search
  const results = searchFiles(searchNode.id);
  
  if (results.length === 0) {
    return <div>No files matching '{pattern}' found in {searchPath}</div>;
  }
  
  return (
    <div>
      <p className="text-green-400 mb-1">Found {results.length} matches for '{pattern}':</p>
      {results.map((file, index) => (
        <p key={index} className="mb-1">
          {file.path} ({file.type})
        </p>
      ))}
    </div>
  );
};

const handleGrep = (
  args: string[], 
  currentPath: string, 
  fileSystem: any
): JSX.Element | string => {
  if (args.length < 2) {
    return <div className="text-red-400">grep: missing arguments. Usage: grep [pattern] [file]</div>;
  }
  
  const pattern = args[0].toLowerCase();
  const filePath = resolvePath(currentPath, args[1]);
  const fileNode = fileSystem.getNodeByPath(filePath);
  
  if (!fileNode) {
    return <div className="text-red-400">grep: {args[1]}: No such file or directory</div>;
  }
  
  if (fileNode.type !== 'file') {
    return <div className="text-red-400">grep: {args[1]}: Is a directory</div>;
  }
  
  // Search for pattern in file content
  const content = fileNode.content || '';
  const lines = content.split('\n');
  const matches = lines.filter(line => line.toLowerCase().includes(pattern));
  
  if (matches.length === 0) {
    return <div>No matches found for '{pattern}' in {fileNode.name}</div>;
  }
  
  return (
    <div>
      <p className="text-green-400 mb-1">Found {matches.length} matches for '{pattern}' in {fileNode.name}:</p>
      <div className="p-2 bg-black/30 border border-green-500/30 font-mono text-green-400">
        {matches.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
};

const handleChmod = (
  args: string[], 
  currentPath: string, 
  fileSystem: any
): string => {
  if (args.length < 2) {
    return "chmod: missing operand. Usage: chmod [permissions] [file]";
  }
  
  const permissions = args[0];
  const filePath = resolvePath(currentPath, args[1]);
  const fileNode = fileSystem.getNodeByPath(filePath);
  
  if (!fileNode) {
    return `chmod: cannot access '${args[1]}': No such file or directory`;
  }
  
  return `Changed permissions of '${fileNode.name}' to ${permissions}`;
};

const handleIfconfig = (): JSX.Element => {
  return (
    <div>
      <p className="text-green-400 mb-1">Network interfaces:</p>
      <p className="mb-1">eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500</p>
      <p className="mb-1">        inet 192.168.1.5  netmask 255.255.255.0  broadcast 192.168.1.255</p>
      <p className="mb-1">        inet6 fe80::215:5dff:fe00:101  prefixlen 64  scopeid 0x20&lt;link&gt;</p>
      <p className="mb-1">lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536</p>
      <p className="mb-1">        inet 127.0.0.1  netmask 255.0.0.0</p>
      <p className="mb-1">        inet6 ::1  prefixlen 128  scopeid 0x10&lt;host&gt;</p>
    </div>
  );
};

const handleNetstat = (): JSX.Element => {
  return (
    <div>
      <p className="text-green-400 mb-1">Active Internet connections:</p>
      <p className="mb-1">Proto  Local Address          Foreign Address        State</p>
      <p className="mb-1">tcp    0.0.0.0:22              0.0.0.0:*              LISTEN</p>
      <p className="mb-1">tcp    0.0.0.0:80              0.0.0.0:*              LISTEN</p>
      <p className="mb-1">tcp    0.0.0.0:443             0.0.0.0:*              LISTEN</p>
      <p className="mb-1">tcp    0.0.0.0:9945            0.0.0.0:*              LISTEN</p>
      <p className="mb-1">tcp    127.0.0.1:3306          0.0.0.0:*              LISTEN</p>
      <p className="mb-1">tcp    192.168.1.5:22          192.168.1.100:54602    ESTABLISHED</p>
    </div>
  );
};

const handlePs = (): JSX.Element => {
  return (
    <div>
      <p className="text-green-400 mb-1">Running processes:</p>
      <p className="mb-1">  PID TTY          TIME CMD</p>
      <p className="mb-1">    1 ?        00:00:08 systemd</p>
      <p className="mb-1">  345 ?        00:00:02 sshd</p>
      <p className="mb-1">  389 ?        00:00:01 apache2</p>
      <p className="mb-1">  421 ?        00:00:03 mysqld</p>
      <p className="mb-1">  498 ?        00:00:00 backdoor</p>
      <p className="mb-1">  501 pts/0    00:00:00 bash</p>
      <p className="mb-1">  789 pts/0    00:00:00 ps</p>
    </div>
  );
};

const handleTop = (): JSX.Element => {
  return (
    <div>
      <p className="text-green-400 mb-1">System monitor:</p>
      <p className="mb-1">top - 12:34:56 up 15 days, 3:45, 2 users, load average: 0.08, 0.12, 0.10</p>
      <p className="mb-1">Tasks: 128 total, 1 running, 127 sleeping, 0 stopped, 0 zombie</p>
      <p className="mb-1">%Cpu(s): 2.0 us, 1.0 sy, 0.0 ni, 96.8 id, 0.2 wa, 0.0 hi, 0.0 si, 0.0 st</p>
      <p className="mb-1">MiB Mem : 7823.3 total, 5125.7 free, 1365.6 used, 1332.0 buff/cache</p>
      <p className="mb-1">MiB Swap: 2048.0 total, 2048.0 free, 0.0 used. 6176.5 avail Mem</p>
      <p className="mb-1"></p>
      <p className="mb-1">    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM    TIME+ COMMAND</p>
      <p className="mb-1">    421 mysql     20   0  1258.8m 364.6m  12.1m S   1.0   4.5  45:23.45 mysqld</p>
      <p className="mb-1">    389 www-data  20   0   336.1m  14.3m   7.8m S   0.7   0.2  23:12.34 apache2</p>
      <p className="mb-1">    498 root      20   0    12.0m   5.2m   0.9m S   0.3   0.1   5:67.89 backdoor</p>
    </div>
  );
};

const handleSudo = (args: string[]): string | JSX.Element => {
  if (args.length === 0) {
    return "sudo: no command specified";
  }
  
  return (
    <div>
      <p className="text-red-400 mb-1">sudo: authentication required</p>
      <p className="mb-1">[sudo] password for user:</p>
      <p className="mb-1">Sorry, try again.</p>
      <p className="mb-1">sudo: 1 incorrect password attempt</p>
    </div>
  );
};

const handleOpenssl = (args: string[]): string | JSX.Element => {
  if (args.length === 0) {
    return "openssl: no command specified. Try 'enc', 'dgst', or 'genrsa'";
  }
  
  const subCommand = args[0];
  
  if (subCommand === "enc") {
    return "openssl enc: encryption functions. Usage: openssl enc -aes-256-cbc -in [infile] -out [outfile]";
  }
  
  if (subCommand === "dgst") {
    if (args.length >= 3 && args[1] === "-sha256") {
      const text = args[2];
      return `SHA256(${text})= e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;
    }
    return "openssl dgst: digest functions. Usage: openssl dgst -sha256 [text]";
  }
  
  if (subCommand === "genrsa") {
    return (
      <div>
        <p className="text-green-400 mb-1">Generating RSA private key, 2048 bit long modulus</p>
        <p className="mb-1">e is 65537 (0x10001)</p>
        <p className="mb-1">-----BEGIN RSA PRIVATE KEY-----</p>
        <p className="mb-1">MIIEowIBAAKCAQEAvWL0pNVy8Q+7yy5uaA53Evl8NeEueR8TUiTt1OyuXJSEUEZx</p>
        <p className="mb-1">bqXf2fTDRXX+4/qwPKqnrOg/IUBktxKK0JlOA1xWrANj/Q5IQJiZ+lL8C1jEp+28</p>
        <p className="mb-1">...</p>
        <p className="mb-1">7jqx3xG9j8UaDnGvlLEk3MKS71cMCzZ4NQye7tKQzXM=</p>
        <p className="mb-1">-----END RSA PRIVATE KEY-----</p>
      </div>
    );
  }
  
  return `openssl: unknown command '${subCommand}'`;
};

export default commandParser;
