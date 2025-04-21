"use client"

import { useState } from "react"
import { Shield, Lock, Scan, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react"

const SecuritySuite = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResults, setScanResults] = useState<null | {
    threats: number
    scannedFiles: number
    vulnerabilities: string[]
  }>(null)

  const startScan = () => {
    setScanning(true)
    setScanProgress(0)
    setScanResults(null)

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setScanning(false)
          setScanResults({
            threats: Math.floor(Math.random() * 3),
            scannedFiles: 1458,
            vulnerabilities: [
              "Outdated system components",
              "Weak encryption in /system/config/firewall.conf",
              "Suspicious process running on port 9945",
            ],
          })
          return 100
        }
        return prev + 1
      })
    }, 50)
  }

  return (
    <div className="h-full flex flex-col bg-cyber-bg-dark text-white">
      {/* Header */}
      <div className="p-4 border-b border-cyber-neon-pink/30 flex items-center">
        <Shield className="text-cyber-neon-pink mr-2" size={24} />
        <h1 className="text-xl font-bold neon-pink-text">CyberOS Security Suite</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-cyber-neon-purple/30">
        <button
          className={`px-4 py-2 ${activeTab === "dashboard" ? "bg-cyber-neon-purple/20 border-b-2 border-cyber-neon-purple" : "hover:bg-cyber-neon-purple/10"}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "scan" ? "bg-cyber-neon-purple/20 border-b-2 border-cyber-neon-purple" : "hover:bg-cyber-neon-purple/10"}`}
          onClick={() => setActiveTab("scan")}
        >
          Scan
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "firewall" ? "bg-cyber-neon-purple/20 border-b-2 border-cyber-neon-purple" : "hover:bg-cyber-neon-purple/10"}`}
          onClick={() => setActiveTab("firewall")}
        >
          Firewall
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 border border-cyber-neon-green/30 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-cyber-neon-green">System Status</h3>
                  <CheckCircle className="text-cyber-neon-green" size={20} />
                </div>
                <p className="text-sm">Your system is currently protected</p>
              </div>

              <div className="bg-black/30 border border-cyber-neon-blue/30 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-cyber-neon-blue">Last Scan</h3>
                  <Scan className="text-cyber-neon-blue" size={20} />
                </div>
                <p className="text-sm">2 hours ago</p>
              </div>

              <div className="bg-black/30 border border-cyber-neon-pink/30 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-cyber-neon-pink">Firewall</h3>
                  <Lock className="text-cyber-neon-pink" size={20} />
                </div>
                <p className="text-sm">Active - 3 connections blocked today</p>
              </div>
            </div>

            <div className="bg-black/30 border border-cyber-neon-purple/30 p-4 rounded-md">
              <h3 className="font-bold text-cyber-neon-purple mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="w-4 h-4 mt-1 mr-2 rounded-full bg-cyber-neon-green/50"></div>
                  <div>
                    <p className="text-sm">System scan completed</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-4 mt-1 mr-2 rounded-full bg-cyber-neon-pink/50"></div>
                  <div>
                    <p className="text-sm">Firewall blocked suspicious connection from 192.168.1.105</p>
                    <p className="text-xs text-gray-400">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-4 mt-1 mr-2 rounded-full bg-cyber-neon-blue/50"></div>
                  <div>
                    <p className="text-sm">System updates checked</p>
                    <p className="text-xs text-gray-400">5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-cyber-neon-blue/30 p-4 rounded-md">
              <h3 className="font-bold text-cyber-neon-blue mb-3">Security Recommendations</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <AlertTriangle className="text-cyber-neon-pink mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-sm">Update system components to latest version</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="text-cyber-neon-pink mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-sm">Enable two-factor authentication for sensitive operations</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="text-cyber-neon-pink mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-sm">Review firewall rules and disable unnecessary services</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "scan" && (
          <div className="space-y-6">
            <div className="bg-black/30 border border-cyber-neon-green/30 p-4 rounded-md">
              <h3 className="font-bold text-cyber-neon-green mb-3">System Scan</h3>

              {!scanning && !scanResults && (
                <div className="text-center py-6">
                  <Scan className="text-cyber-neon-green mx-auto mb-4" size={48} />
                  <p className="mb-4">Click the button below to start a full system scan</p>
                  <button
                    onClick={startScan}
                    className="px-4 py-2 bg-cyber-neon-green/20 hover:bg-cyber-neon-green/40 text-cyber-neon-green rounded-md"
                  >
                    Start Scan
                  </button>
                </div>
              )}

              {scanning && (
                <div className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Scanning system files...</span>
                    <span className="text-sm">{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div className="bg-cyber-neon-green h-2.5 rounded-full" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <RefreshCw className="text-cyber-neon-green animate-spin" size={24} />
                  </div>
                </div>
              )}

              {scanResults && (
                <div className="py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {scanResults.threats === 0 ? (
                        <CheckCircle className="text-cyber-neon-green mr-2" size={24} />
                      ) : (
                        <XCircle className="text-cyber-neon-pink mr-2" size={24} />
                      )}
                      <span className="font-bold">
                        {scanResults.threats === 0 ? "No threats found" : `${scanResults.threats} threats detected`}
                      </span>
                    </div>
                    <button
                      onClick={startScan}
                      className="px-3 py-1 bg-cyber-neon-green/20 hover:bg-cyber-neon-green/40 text-cyber-neon-green rounded-md text-sm"
                    >
                      Scan Again
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm mb-1">Scanned {scanResults.scannedFiles} files</p>
                    <p className="text-sm">Scan completed in 73 seconds</p>
                  </div>

                  {scanResults.threats > 0 && (
                    <div className="mt-4">
                      <h4 className="font-bold text-cyber-neon-pink mb-2">Vulnerabilities Found:</h4>
                      <ul className="space-y-2">
                        {scanResults.vulnerabilities.map((vuln, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="text-cyber-neon-pink mr-2 flex-shrink-0 mt-0.5" size={16} />
                            <span className="text-sm">{vuln}</span>
                          </li>
                        ))}
                      </ul>
                      <button className="mt-4 px-4 py-2 bg-cyber-neon-pink/20 hover:bg-cyber-neon-pink/40 text-cyber-neon-pink rounded-md">
                        Fix Issues
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "firewall" && (
          <div className="space-y-6">
            <div className="bg-black/30 border border-cyber-neon-pink/30 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-cyber-neon-pink">Firewall Status</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-cyber-neon-green mr-2"></div>
                  <span>Active</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold mb-2">Allowed Connections</h4>
                  <div className="bg-black/50 p-2 rounded font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-cyber-neon-green">SSH</span>
                      <span>22/tcp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyber-neon-green">HTTP</span>
                      <span>80/tcp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyber-neon-green">HTTPS</span>
                      <span>443/tcp</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-2">Blocked Connections</h4>
                  <div className="bg-black/50 p-2 rounded font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-cyber-neon-pink">192.168.1.105</span>
                      <span>All ports</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyber-neon-pink">10.0.0.5</span>
                      <span>All ports</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-2">Firewall Rules</h4>
                  <div className="bg-black/50 p-2 rounded font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-cyber-neon-blue">ALLOW</span>
                      <span>ssh 22/tcp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyber-neon-blue">ALLOW</span>
                      <span>www 80/tcp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyber-neon-blue">ALLOW</span>
                      <span>www-secure 443/tcp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyber-neon-pink">DENY</span>
                      <span>* */tcp</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="px-3 py-1 bg-cyber-neon-blue/20 hover:bg-cyber-neon-blue/40 text-cyber-neon-blue rounded-md text-sm">
                  Edit Rules
                </button>
                <button className="px-3 py-1 bg-cyber-neon-pink/20 hover:bg-cyber-neon-pink/40 text-cyber-neon-pink rounded-md text-sm">
                  Block IP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SecuritySuite
