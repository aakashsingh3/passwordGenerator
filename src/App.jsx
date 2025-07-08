import { useRef, useState, useCallback, useEffect } from 'react'
import './App.css'

function App() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(8)
  const [specCharAllowed, setSpecCharAllowed] = useState(false)
  const [numAllowed, setNumAllowed] = useState(false)
  const [upperCaseAllowed, setUpperCaseAllowed] = useState(true)
  const [lowerCaseAllowed, setLowerCaseAllowed] = useState(true)
  const [copied, setCopied] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("weak")

  const passRef = useRef(null)

  const calculatePasswordStrength = useCallback((password) => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score < 3) return "weak";
    if (score < 5) return "medium";
    return "strong";
  }, []);

  const passGenerator = useCallback(() => {
    let pass = ""
    let str = ""
    
    if (upperCaseAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (lowerCaseAllowed) str += "abcdefghijklmnopqrstuvwxyz"
    if (specCharAllowed) str += "!@#$%^&*-_+=[]{}~`"
    if (numAllowed) str += "0123456789"

    // Fallback if nothing is selected
    if (str === "") str = "abcdefghijklmnopqrstuvwxyz"

    for (let i = 1; i <= length; i++) {
      const indexValue = Math.floor(Math.random() * str.length)
      pass += str.charAt(indexValue)
    }

    setPassword(pass)
    setCopied(false)
    setPasswordStrength(calculatePasswordStrength(pass))

  }, [length, specCharAllowed, numAllowed, upperCaseAllowed, lowerCaseAllowed, calculatePasswordStrength])
    
  useEffect(() => {
    passGenerator()
  }, [length, numAllowed, specCharAllowed, upperCaseAllowed, lowerCaseAllowed, passGenerator])
  
  const copyPassToClipboard = useCallback(() => {
    passRef.current?.select();
    passRef.current?.setSelectionRange(0, password.length);
    window.navigator.clipboard.writeText(password)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case "weak": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-500";
      default: return "bg-red-500";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">Password Generator</h1>
          </div>
          
          <div className="relative mb-6">
            <input 
              type="text"
              value={password}
              placeholder='Your secure password'
              readOnly
              ref={passRef}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`} 
                style={{width: passwordStrength === "weak" ? "33%" : passwordStrength === "medium" ? "66%" : "100%"}}
              ></div>
            </div>
            <p className="text-xs text-right mt-1 font-medium capitalize text-gray-600">
              Password Strength: <span className={`${passwordStrength === "weak" ? "text-red-500" : passwordStrength === "medium" ? "text-yellow-500" : "text-green-500"}`}>{passwordStrength}</span>
            </p>

            <div className="flex mt-3 gap-2">
              <button
                onClick={copyPassToClipboard}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                  copied 
                    ? "bg-green-500 text-white" 
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={passGenerator}
                className="flex-1 py-2 px-4 bg-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-300 transition-all flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Regenerate
              </button>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="length" className="text-sm font-medium text-gray-700">
                  Password Length
                </label>
                <span className="bg-purple-100 text-purple-800 font-medium px-2 py-1 rounded-md text-xs">
                  {length} characters
                </span>
              </div>
              <input 
                type="range"
                min="4"
                max="30"
                value={length}
                step="1"
                id="length"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                onChange={(e) => {setLength(Number(e.target.value))}}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>4</span>
                <span>30</span>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Character Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox"
                      id='upperCase'
                      className="sr-only peer"
                      checked={upperCaseAllowed}
                      onChange={() => {setUpperCaseAllowed((prev) => !prev)}}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                  <span className="text-gray-700 font-medium">Uppercase (A-Z)</span>
                </label>
                
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox"
                      id='lowerCase'
                      className="sr-only peer"
                      checked={lowerCaseAllowed}
                      onChange={() => {setLowerCaseAllowed((prev) => !prev)}}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                  <span className="text-gray-700 font-medium">Lowercase (a-z)</span>
                </label>
                
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox"
                      id='specialChars'
                      className="sr-only peer"
                      checked={specCharAllowed}
                      onChange={() => {setSpecCharAllowed((prev) => !prev)}}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                  <span className="text-gray-700 font-medium">Special (!@#$%^&*)</span>
                </label>
                
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      id="numbers"
                      checked={numAllowed}
                      onChange={() => {setNumAllowed((prev) => !prev)}}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                  <span className="text-gray-700 font-medium">Numbers (0-9)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500 flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Your secure password generator - Passwords are never stored or transmitted
        </div>
      </div>
    </div>
  )
}

export default App