
import React from 'react';
import { Terminal, FolderOpen, Settings, HelpCircle } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="p-4 overflow-auto">
      <h2 className="text-xl font-bold neon-purple-text mb-4">CyberOS Help</h2>
      
      <section className="mb-6">
        <h3 className="text-lg font-bold neon-blue-text mb-2">Getting Started</h3>
        <p className="mb-4">
          Welcome to CyberOS, a desktop environment simulation with a cyberpunk theme. 
          This system allows you to interact with a virtual file system, use a terminal, 
          and experience the feeling of a retro-futuristic operating system.
        </p>
        
        <p>
          Use the dock at the bottom of the screen to launch applications such as Terminal, 
          File Explorer, and Settings.
        </p>
      </section>
      
      <section className="mb-6">
        <h3 className="text-lg font-bold neon-blue-text mb-2 flex items-center">
          <Terminal size={18} className="mr-2" /> Terminal
        </h3>
        <p className="mb-2">
          The Terminal allows you to interact with the system using text commands.
          Here are some basic commands:
        </p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li><span className="text-cyber-neon-green font-mono">ls</span> - List files and directories</li>
          <li><span className="text-cyber-neon-green font-mono">cd [directory]</span> - Change directory</li>
          <li><span className="text-cyber-neon-green font-mono">pwd</span> - Print working directory</li>
          <li><span className="text-cyber-neon-green font-mono">cat [file]</span> - Display file contents</li>
          <li><span className="text-cyber-neon-green font-mono">mkdir [directory]</span> - Create directory</li>
          <li><span className="text-cyber-neon-green font-mono">touch [file]</span> - Create empty file</li>
          <li><span className="text-cyber-neon-green font-mono">rm [file/directory]</span> - Remove file or directory</li>
          <li><span className="text-cyber-neon-green font-mono">help</span> - Display help message</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h3 className="text-lg font-bold neon-blue-text mb-2 flex items-center">
          <FolderOpen size={18} className="mr-2" /> File Explorer
        </h3>
        <p className="mb-2">
          The File Explorer provides a graphical interface to browse, view, edit, and manage files.
        </p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Click folders to navigate into them</li>
          <li>Click files to view their contents</li>
          <li>Use the edit button to modify file contents</li>
          <li>Create new files and folders with the buttons at the top</li>
          <li>Delete files and folders with the trash icon</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h3 className="text-lg font-bold neon-blue-text mb-2 flex items-center">
          <Settings size={18} className="mr-2" /> Settings
        </h3>
        <p>
          The Settings application allows you to customize your CyberOS experience.
          You can change the theme, enable or disable visual effects, and set your username.
        </p>
      </section>
      
      <section className="mb-6">
        <h3 className="text-lg font-bold neon-blue-text mb-2">Cybersecurity Game Mode</h3>
        <p>
          There are hidden files and secrets throughout the system. Explore the file system,
          read file contents, and search for clues using both the Terminal and File Explorer.
          The game starts with a simple task: find the first hidden file containing an access code.
        </p>
      </section>
      
      <div className="mt-8 p-4 border border-cyber-neon-pink/30 rounded">
        <h4 className="text-cyber-neon-pink mb-2">Need more help?</h4>
        <p className="text-sm">
          This is a simulation and all data is stored locally in your browser.
          Refreshing the page will not lose your data, but clearing your browser storage will reset the system.
        </p>
      </div>
    </div>
  );
};

export default Help;
