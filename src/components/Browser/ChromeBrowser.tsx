"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"

import { RotateCw, Search, Home } from "lucide-react"

const DEFAULT_PAGES = {
  "https://cyber-os.net": {
    title: "CyberOS - Home",
    content: (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-cyber-neon-pink">Welcome to CyberOS Network</h1>
        <p className="mb-4">Your gateway to the cyber world. Explore our resources and tools.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border border-cyber-neon-blue/30 p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2 text-cyber-neon-blue">Security Tools</h2>
            <p>Access the latest cybersecurity tools and resources.</p>
          </div>
          <div className="border border-cyber-neon-purple/30 p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2 text-cyber-neon-purple">Network Scanner</h2>
            <p>Scan your network for vulnerabilities and threats.</p>
          </div>
          <div className="border border-cyber-neon-green/30 p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2 text-cyber-neon-green">Encryption Services</h2>
            <p>Encrypt your data with military-grade algorithms.</p>
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-md mb-6">
          <h2 className="text-lg font-bold mb-2 text-cyber-neon-pink">Latest News</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>New vulnerability discovered in legacy systems</li>
            <li>CyberOS 2.0 coming soon with enhanced security features</li>
            <li>Join our upcoming webinar on advanced penetration testing</li>
          </ul>
        </div>

        <div className="text-sm text-gray-400">
          <p>© 2023 CyberOS Network. All rights reserved.</p>
        </div>
      </div>
    ),
  },
  "https://cyber-os.net/tools": {
    title: "CyberOS - Security Tools",
    content: (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-cyber-neon-blue">Security Tools</h1>
        <p className="mb-4">A collection of the most powerful cybersecurity tools available on CyberOS.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-cyber-neon-green/30 p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2 text-cyber-neon-green">Network Scanner</h2>
            <p className="mb-2">Scan networks for vulnerabilities and open ports.</p>
            <button className="bg-cyber-neon-green/20 hover:bg-cyber-neon-green/40 text-cyber-neon-green px-3 py-1 rounded">
              Download
            </button>
          </div>
          <div className="border border-cyber-neon-pink/30 p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2 text-cyber-neon-pink">Password Cracker</h2>
            <p className="mb-2">Advanced tool for password recovery and testing.</p>
            <button className="bg-cyber-neon-pink/20 hover:bg-cyber-neon-pink/40 text-cyber-neon-pink px-3 py-1 rounded">
              Download
            </button>
          </div>
          <div className="border border-cyber-neon-blue/30 p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2 text-cyber-neon-blue">Encryption Suite</h2>
            <p className="mb-2">Encrypt your files with military-grade algorithms.</p>
            <button className="bg-cyber-neon-blue/20 hover:bg-cyber-neon-blue/40 text-cyber-neon-blue px-3 py-1 rounded">
              Download
            </button>
          </div>
          <div className="border border-cyber-neon-purple/30 p-4 rounded-md">
            <h2 className="text-lg font-bold mb-2 text-cyber-neon-purple">Forensic Toolkit</h2>
            <p className="mb-2">Complete suite for digital forensics investigation.</p>
            <button className="bg-cyber-neon-purple/20 hover:bg-cyber-neon-purple/40 text-cyber-neon-purple px-3 py-1 rounded">
              Download
            </button>
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-md mb-6">
          <h2 className="text-lg font-bold mb-2 text-cyber-neon-blue">Premium Tools</h2>
          <p className="mb-2">Unlock our premium tools with a CyberOS Pro subscription.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Advanced Malware Analysis</li>
            <li>AI-powered Threat Detection</li>
            <li>Quantum-resistant Encryption</li>
            <li>Custom Exploit Development</li>
          </ul>
        </div>
      </div>
    ),
  },
  "https://cyber-os.net/forum": {
    title: "CyberOS - Community Forum",
    content: (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-cyber-neon-purple">Community Forum</h1>
        <p className="mb-4">Join the conversation with fellow cybersecurity enthusiasts.</p>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-cyber-neon-blue">Recent Discussions</h2>
            <button className="bg-cyber-neon-purple/20 hover:bg-cyber-neon-purple/40 text-cyber-neon-purple px-3 py-1 rounded">
              New Topic
            </button>
          </div>

          <div className="space-y-3">
            <div className="border border-cyber-neon-blue/30 p-3 rounded-md">
              <div className="flex justify-between">
                <h3 className="font-bold text-cyber-neon-blue">Discovered backdoor in firmware v2.3</h3>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <p className="text-sm mb-2">I found a potential backdoor in the latest firmware update...</p>
              <div className="flex justify-between text-xs">
                <span>Posted by: CyberHunter</span>
                <span>23 replies</span>
              </div>
            </div>

            <div className="border border-cyber-neon-green/30 p-3 rounded-md">
              <div className="flex justify-between">
                <h3 className="font-bold text-cyber-neon-green">Best practices for secure coding</h3>
                <span className="text-xs text-gray-400">Yesterday</span>
              </div>
              <p className="text-sm mb-2">Let's discuss the most effective secure coding practices...</p>
              <div className="flex justify-between text-xs">
                <span>Posted by: SecureDevOps</span>
                <span>47 replies</span>
              </div>
            </div>

            <div className="border border-cyber-neon-pink/30 p-3 rounded-md">
              <div className="flex justify-between">
                <h3 className="font-bold text-cyber-neon-pink">Zero-day vulnerability in popular CMS</h3>
                <span className="text-xs text-gray-400">3 days ago</span>
              </div>
              <p className="text-sm mb-2">
                I've discovered a critical vulnerability that allows remote code execution...
              </p>
              <div className="flex justify-between text-xs">
                <span>Posted by: EthicalHacker</span>
                <span>89 replies</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-md">
          <h2 className="text-lg font-bold mb-2 text-cyber-neon-purple">Forum Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="text-center p-2 border border-cyber-neon-blue/30 rounded">
              <span className="text-cyber-neon-blue">Exploits</span>
            </div>
            <div className="text-center p-2 border border-cyber-neon-green/30 rounded">
              <span className="text-cyber-neon-green">Malware</span>
            </div>
            <div className="text-center p-2 border border-cyber-neon-pink/30 rounded">
              <span className="text-cyber-neon-pink">Network</span>
            </div>
            <div className="text-center p-2 border border-cyber-neon-purple/30 rounded">
              <span className="text-cyber-neon-purple">Cryptography</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  "https://cyber-os.net/about": {
    title: "CyberOS - About",
    content: (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-cyber-neon-green">About CyberOS</h1>
        <p className="mb-4">
          CyberOS is a cutting-edge cybersecurity platform designed for security professionals and enthusiasts.
        </p>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-cyber-neon-blue">Our Mission</h2>
          <p className="mb-4">
            To provide the most advanced and user-friendly cybersecurity tools and resources to help protect digital
            assets and promote security awareness in an increasingly connected world.
          </p>

          <h2 className="text-lg font-bold mb-2 text-cyber-neon-blue">Our Team</h2>
          <p className="mb-4">
            CyberOS was founded by a team of cybersecurity experts with decades of combined experience in penetration
            testing, vulnerability research, and secure system design.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-cyber-neon-purple/30 p-4 rounded-md text-center">
              <div className="w-16 h-16 bg-cyber-neon-purple/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-cyber-neon-purple text-xl">JD</span>
              </div>
              <h3 className="font-bold text-cyber-neon-purple">Jane Doe</h3>
              <p className="text-sm">Founder & CEO</p>
            </div>
            <div className="border border-cyber-neon-blue/30 p-4 rounded-md text-center">
              <div className="w-16 h-16 bg-cyber-neon-blue/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-cyber-neon-blue text-xl">JS</span>
              </div>
              <h3 className="font-bold text-cyber-neon-blue">John Smith</h3>
              <p className="text-sm">CTO</p>
            </div>
            <div className="border border-cyber-neon-green/30 p-4 rounded-md text-center">
              <div className="w-16 h-16 bg-cyber-neon-green/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-cyber-neon-green text-xl">AJ</span>
              </div>
              <h3 className="font-bold text-cyber-neon-green">Alex Johnson</h3>
              <p className="text-sm">Lead Security Researcher</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-md">
          <h2 className="text-lg font-bold mb-2 text-cyber-neon-green">Contact Us</h2>
          <p className="mb-2">Have questions or feedback? We'd love to hear from you!</p>
          <p className="mb-1">
            <span className="text-cyber-neon-green">Email:</span> contact@cyber-os.net
          </p>
          <p>
            <span className="text-cyber-neon-green">Location:</span> Cyber Tower, Silicon Valley, CA
          </p>
        </div>
      </div>
    ),
  },
  "https://cyber-os.net/search": {
    title: "CyberOS - Search",
    content: (
      <div className="p-4">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search CyberOS..."
              className="w-full bg-black/50 border border-cyber-neon-purple/30 rounded p-2 pl-10 focus:outline-none focus:border-cyber-neon-purple/70"
              defaultValue="cybersecurity tools"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-cyber-neon-purple" />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-cyber-neon-purple">Search Results for "cybersecurity tools"</h2>

          <div className="space-y-4">
            <div className="border border-cyber-neon-blue/30 p-3 rounded-md">
              <h3 className="font-bold text-cyber-neon-blue">
                <a href="#" className="hover:underline">
                  CyberOS - Security Tools
                </a>
              </h3>
              <p className="text-sm mb-1">
                A collection of the most powerful cybersecurity tools available on CyberOS...
              </p>
              <p className="text-xs text-cyber-neon-blue">https://cyber-os.net/tools</p>
            </div>

            <div className="border border-cyber-neon-green/30 p-3 rounded-md">
              <h3 className="font-bold text-cyber-neon-green">
                <a href="#" className="hover:underline">
                  Top 10 Cybersecurity Tools for 2023
                </a>
              </h3>
              <p className="text-sm mb-1">
                Our experts have compiled a list of the most effective cybersecurity tools for this year...
              </p>
              <p className="text-xs text-cyber-neon-green">https://cyber-os.net/blog/top-tools-2023</p>
            </div>

            <div className="border border-cyber-neon-pink/30 p-3 rounded-md">
              <h3 className="font-bold text-cyber-neon-pink">
                <a href="#" className="hover:underline">
                  Open Source Cybersecurity Tools
                </a>
              </h3>
              <p className="text-sm mb-1">
                Discover powerful open-source tools for penetration testing, vulnerability scanning...
              </p>
              <p className="text-xs text-cyber-neon-pink">https://cyber-os.net/resources/open-source</p>
            </div>

            <div className="border border-cyber-neon-purple/30 p-3 rounded-md">
              <h3 className="font-bold text-cyber-neon-purple">
                <a href="#" className="hover:underline">
                  Forum: Best cybersecurity tools for beginners
                </a>
              </h3>
              <p className="text-sm mb-1">
                Discussion thread about recommended tools for those new to cybersecurity...
              </p>
              <p className="text-xs text-cyber-neon-purple">https://cyber-os.net/forum/threads/beginner-tools</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 p-4 rounded-md">
          <h2 className="text-lg font-bold mb-2 text-cyber-neon-blue">Related Searches</h2>
          <div className="flex flex-wrap gap-2">
            <span className="bg-cyber-neon-blue/20 text-cyber-neon-blue px-2 py-1 rounded text-sm">
              penetration testing tools
            </span>
            <span className="bg-cyber-neon-green/20 text-cyber-neon-green px-2 py-1 rounded text-sm">
              network security
            </span>
            <span className="bg-cyber-neon-pink/20 text-cyber-neon-pink px-2 py-1 rounded text-sm">
              encryption software
            </span>
            <span className="bg-cyber-neon-purple/20 text-cyber-neon-purple px-2 py-1 rounded text-sm">
              vulnerability scanners
            </span>
          </div>
        </div>
      </div>
    ),
  },
}

interface Tab {
  id: string
  url: string
  title: string
  favicon?: string
}

const ChromeBrowser = () => {
  const home_url = "https://www.google.com/webhp?igu=1"
  const [url, setUrl] = useState(home_url)
  const [displayUrl, setDisplayUrl] = useState("https://www.google.com")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Load last visited URL from localStorage
    const lastVisitedUrl = localStorage.getItem("chrome-url")
    const lastDisplayedUrl = localStorage.getItem("chrome-display-url")

    if (lastVisitedUrl !== null && lastVisitedUrl !== undefined) {
      setUrl(lastVisitedUrl)
      setDisplayUrl(lastDisplayedUrl || lastVisitedUrl)
      refreshChrome()
    }
  }, [])

  const storeVisitedUrl = (newUrl: string, newDisplayUrl: string) => {
    localStorage.setItem("chrome-url", newUrl)
    localStorage.setItem("chrome-display-url", newDisplayUrl)
  }

  const refreshChrome = () => {
    if (iframeRef.current) {
      // Force iframe refresh
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const goToHome = () => {
    setUrl(home_url)
    setDisplayUrl("https://www.google.com")
    storeVisitedUrl(home_url, "https://www.google.com")
    refreshChrome()
  }

  const checkKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      let newUrl = e.currentTarget.value
      let newDisplayUrl = ""

      newUrl = newUrl.trim()
      if (newUrl.length === 0) return

      if (newUrl.indexOf("http://") !== 0 && newUrl.indexOf("https://") !== 0) {
        newUrl = "https://" + newUrl
      }

      newUrl = encodeURI(newUrl)
      newDisplayUrl = newUrl

      if (newUrl.includes("google.com")) {
        newUrl = home_url
        newDisplayUrl = "https://www.google.com"
      }

      setUrl(newUrl)
      setDisplayUrl(newDisplayUrl)
      storeVisitedUrl(newUrl, newDisplayUrl)

      // Blur the input field
      document.getElementById("chrome-url-bar")?.blur()
    }
  }

  const handleDisplayUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayUrl(e.target.value)
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-900">
      {/* URL Bar */}
      <div className="w-full pt-1 pb-1 flex justify-start items-center text-white text-sm border-b border-gray-800 bg-gray-900">
        <button
          onClick={refreshChrome}
          className="ml-2 mr-1 flex justify-center items-center rounded-full p-1 hover:bg-gray-700"
          title="Refresh"
        >
          <RotateCw size={16} className="text-gray-300" />
        </button>

        <button
          onClick={goToHome}
          className="mr-2 ml-1 flex justify-center items-center rounded-full p-1 hover:bg-gray-700"
          title="Home"
        >
          <Home size={16} className="text-gray-300" />
        </button>

        <div className="relative flex-1 mr-2">
          <input
            onKeyDown={checkKey}
            onChange={handleDisplayUrl}
            value={displayUrl}
            id="chrome-url-bar"
            className="outline-none bg-gray-800 rounded-full pl-3 py-1.5 w-full text-gray-300 focus:text-white"
            type="url"
            spellCheck={false}
            autoComplete="off"
          />
          <div className="absolute left-3 top-1.5 text-gray-500 pointer-events-none">
            {displayUrl === "" && "Search Google or type a URL"}
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <iframe
        ref={iframeRef}
        src={url}
        className="flex-grow w-full"
        id="chrome-screen"
        frameBorder="0"
        title="Chrome Browser"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      ></iframe>
    </div>
  )
}

export default ChromeBrowser
