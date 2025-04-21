"use client"

import { useState, useEffect } from "react"
import Taskbar from "./Taskbar"
import DesktopIcon from "./DesktopIcon"
import { FileSystemProvider } from "../../context/FileSystemContext"
import { WindowProvider, useWindowContext } from "../../context/WindowContext"
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts"
import { Terminal, FolderOpen, Settings, HelpCircle, Chrome, Shield, Music } from "lucide-react"

const Desktop = () => {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Add some visual effects after component mounts
    setInitialized(true)

    // Add the scanline effect
    const scanline = document.createElement("div")
    scanline.className = "scanline animate-scanline"
    document.body.appendChild(scanline)

    return () => {
      document.body.removeChild(scanline)
    }
  }, [])

  return (
    <FileSystemProvider>
      <WindowProvider>
        <div
          className={`min-h-screen flex flex-col cyber-grid-bg transition-opacity duration-1000 ${initialized ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex-grow relative">
            <DesktopContent />
          </div>
          <Taskbar />
        </div>
      </WindowProvider>
    </FileSystemProvider>
  )
}

const DesktopContent = () => {
  const [time, setTime] = useState(new Date())
  const { openWindow, windows } = useWindowContext() // Get windows from context

  // Check if any window is maximized
  const hasMaximizedWindow = windows.some((window) => window.isMaximized)

  // Apply keyboard shortcuts inside the WindowProvider context
  useKeyboardShortcuts()

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const openTerminal = () => {
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
    <>
      <div className="absolute top-4 right-4 text-xl neon-blue-text font-mono">{time.toLocaleTimeString()}</div>

      {/* Desktop Icons - Now with hidden prop based on maximized windows */}
      <div className="desktop-icons absolute top-4 left-4 grid grid-cols-1 gap-4">
        <DesktopIcon
          icon={<Terminal className="text-cyber-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]" />}
          label="Terminal"
          onClick={openTerminal}
          color="cyber-neon-green"
          hidden={hasMaximizedWindow}
        />
        <DesktopIcon
          icon={<FolderOpen className="text-cyber-neon-blue drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />}
          label="Files"
          onClick={openFileExplorer}
          color="cyber-neon-blue"
          hidden={hasMaximizedWindow}
        />
        <DesktopIcon
          icon={<Chrome className="text-cyber-neon-blue drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />}
          label="Chrome"
          onClick={openChrome}
          color="cyber-neon-blue"
          hidden={hasMaximizedWindow}
        />
        <DesktopIcon
          icon={<Music className="text-cyber-neon-green drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]" />}
          label="Spotify"
          onClick={openSpotify}
          color="cyber-neon-green"
          hidden={hasMaximizedWindow}
        />
        <DesktopIcon
          icon={<Shield className="text-cyber-neon-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]" />}
          label="Security Suite"
          onClick={openSecuritySuite}
          color="cyber-neon-pink"
          hidden={hasMaximizedWindow}
        />
        <DesktopIcon
          icon={<Settings className="text-cyber-neon-purple drop-shadow-[0_0_5px_rgba(138,43,226,0.8)]" />}
          label="Settings"
          onClick={openSettings}
          color="cyber-neon-purple"
          hidden={hasMaximizedWindow}
        />
        <DesktopIcon
          icon={<HelpCircle className="text-cyber-neon-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]" />}
          label="Help"
          onClick={openHelp}
          color="cyber-neon-pink"
          hidden={hasMaximizedWindow}
        />
      </div>

      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none ${hasMaximizedWindow ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
      >
        <h1 className="text-5xl font-bold neon-text mb-4">CYBER OS</h1>
        <p className="text-xl neon-purple-text mb-2">// SIMULATION ACTIVE</p>
        <p className="text-sm text-gray-400">Use the desktop icons or dock to launch applications</p>
      </div>
    </>
  )
}

export default Desktop
