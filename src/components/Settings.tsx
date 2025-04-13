
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'cyberpunk',
    userName: 'user',
    animationsEnabled: true,
    scanlineEffect: true,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('cyberos-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cyberos-settings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold neon-purple-text mb-4">System Settings</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Username</label>
          <input 
            type="text" 
            value={settings.userName}
            onChange={(e) => setSettings({...settings, userName: e.target.value})}
            className="w-full bg-black/50 border border-cyber-neon-purple/30 rounded p-2 focus:outline-none focus:border-cyber-neon-purple/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Theme</label>
          <select 
            value={settings.theme}
            onChange={(e) => setSettings({...settings, theme: e.target.value})}
            className="w-full bg-black/50 border border-cyber-neon-purple/30 rounded p-2 focus:outline-none focus:border-cyber-neon-purple/50"
          >
            <option value="cyberpunk">Cyberpunk</option>
            <option value="matrix">Matrix</option>
            <option value="hacker">Hacker</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="animations" 
            checked={settings.animationsEnabled}
            onChange={(e) => setSettings({...settings, animationsEnabled: e.target.checked})}
            className="rounded border-cyber-neon-purple/30 bg-black/50"
          />
          <label htmlFor="animations" className="text-sm">Enable animations</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="scanline" 
            checked={settings.scanlineEffect}
            onChange={(e) => setSettings({...settings, scanlineEffect: e.target.checked})}
            className="rounded border-cyber-neon-purple/30 bg-black/50"
          />
          <label htmlFor="scanline" className="text-sm">Enable scanline effect</label>
        </div>
        
        <button 
          onClick={handleSave}
          className="flex items-center space-x-2 mt-4 px-4 py-2 bg-cyber-neon-purple/30 rounded hover:bg-cyber-neon-purple/50 transition-colors"
        >
          <Save size={16} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
