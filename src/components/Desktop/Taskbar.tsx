"use client"
import { Terminal, FolderOpen, Settings, HelpCircle, Chrome, Shield, Music } from "lucide-react"
import { useWindowContext } from "../../context/WindowContext"

const Taskbar = () => {
  const { windows, openWindow, activeWindowId } = useWindowContext()

  const openTerminal = () => {
    console.log("Opening Terminal")
    openWindow({
      id: "terminal",
      title: "Terminal",
      component: "Terminal",
      width: 700,
      height: 400,
      x: 100,
      y: 100,
    })
  }

  const openFileExplorer = () => {
    console.log("Opening File Explorer")
    openWindow({
      id: "fileExplorer",
      title: "File Explorer",
      component: "FileExplorer",
      width: 800,
      height: 500,
      x: 150,
      y: 150,
    })
  }

  const openSettings = () => {
    console.log("Opening Settings")
    openWindow({
      id: "settings",
      title: "Settings",
      component: "Settings",
      width: 600,
      height: 400,
      x: 200,
      y: 200,
    })
  }

  const openHelp = () => {
    console.log("Opening Help")
    openWindow({
      id: "help",
      title: "Help",
      component: "Help",
      width: 500,
      height: 400,
      x: 250,
      y: 250,
    })
  }

  const openChrome = () => {
    console.log("Opening Chrome")
    openWindow({
      id: "chrome",
      title: "Chrome",
      component: "ChromeBrowser",
      width: 900,
      height: 600,
      x: 50,
      y: 50,
    })
  }

  const openSecuritySuite = () => {
    console.log("Opening Security Suite")
    openWindow({
      id: "securitySuite",
      title: "Security Suite",
      component: "SecuritySuite",
      width: 700,
      height: 500,
      x: 100,
      y: 100,
    })
  }

  const openSpotify = () => {
    console.log("Opening Spotify")
    openWindow({
      id: "spotify",
      title: "Spotify",
      component: "Spotify",
      width: 800,
      height: 600,
      x: 80,
      y: 80,
    })
  }

  return (
    <div className="h-20 bg-black/60 backdrop-blur-md border-t border-cyber-neon-pink/30 flex items-center justify-center z-10">
      <div className="dock flex items-center space-x-4 p-2">
        <button onClick={openTerminal} className="dock-item group">
          <Terminal className="text-cyber-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.8)] text-xl" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-green text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-cyber-neon-green/50">
            Terminal
          </span>
        </button>

        <button onClick={openFileExplorer} className="dock-item group">
          <FolderOpen className="text-cyber-neon-blue drop-shadow-[0_0_5px_rgba(0,255,255,0.8)] text-xl" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-cyber-neon-blue/50">
            Files
          </span>
        </button>

        <button onClick={openChrome} className="dock-item group">
          <Chrome className="text-cyber-neon-blue drop-shadow-[0_0_5px_rgba(0,255,255,0.8)] text-xl" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-blue text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-cyber-neon-blue/50">
            Chrome
          </span>
        </button>

        <button onClick={openSpotify} className="dock-item group">
          <Music className="text-cyber-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.8)] text-xl" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-green text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-cyber-neon-green/50">
            Spotify
          </span>
        </button>

        <button onClick={openSecuritySuite} className="dock-item group">
          <Shield className="text-cyber-neon-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)] text-xl" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-pink text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-cyber-neon-pink/50">
            Security
          </span>
        </button>

        <button onClick={openSettings} className="dock-item group">
          <Settings className="text-cyber-neon-purple drop-shadow-[0_0_5px_rgba(138,43,226,0.8)] text-xl" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-purple text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-cyber-neon-purple/50">
            Settings
          </span>
        </button>

        <button onClick={openHelp} className="dock-item group">
          <HelpCircle className="text-cyber-neon-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)] text-xl" />
          <span className="absolute -top-8 bg-black/80 text-cyber-neon-pink text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-cyber-neon-pink/50">
            Help
          </span>
        </button>
      </div>

      {/* Taskbar indicators for open windows */}
      <div className="absolute bottom-2 flex space-x-2">
        {windows.map((window) => (
          <div
            key={window.id}
            className={`h-1 w-6 rounded-full ${window.id === activeWindowId ? "bg-cyber-neon-blue shadow-[0_0_5px_rgba(0,255,255,0.7)]" : "bg-gray-500"}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Taskbar
