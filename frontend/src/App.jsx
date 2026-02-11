import { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import './App.css'; 

function App() {
  // 1. New State for Language
  const [language, setLanguage] = useState('python');
  const [inputCode, setInputCode] = useState('# Paste your Python code here...');
  const [outputTest, setOutputTest] = useState('# Generated tests will appear here...');
  const [loading, setLoading] = useState(false);

  // 2. Handle Language Change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    // Reset boilerplate based on language
    if (newLang === 'python') setInputCode('# Paste Python code here...');
    if (newLang === 'javascript') setInputCode('// Paste JavaScript code here...');
    if (newLang === 'java') setInputCode('// Paste Java code here...');
    if (newLang === 'cpp') setInputCode('// Paste Cpp code here...');
    setOutputTest(''); 
  };

  const handleGenerate = async () => {
    setLoading(true);
    setOutputTest("// Generating readable tests...");
    
    try {
      // 3. Send 'language' to Backend
      const response = await axios.post('http://localhost:8000/generate', {
        code: inputCode,
        language: language 
      });
      setOutputTest(response.data.test);
    } catch (error) {
      console.error(error);
      setOutputTest(`// Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🧪</span>
          <h2>Unit Test Agent</h2>
        </div>
        
        <div className="actions">
          {/* 4. Language Dropdown */}
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="lang-select"
          >
            <option value="python">Python (Pytest)</option>
            <option value="javascript">JavaScript (Jest)</option>
            <option value="java">Java (JUnit)</option>
            <option value="cpp">C++ (GoogleTest)</option>
          </select>

          <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate 🚀"}
          </button>
        </div>
      </header>

      <div className="editor-container">
        {/* Left Panel - Dynamic Language */}
        <div className="panel">
          <div className="panel-header">Input Code ({language})</div>
          <Editor 
            height="100%" 
            language={language} // Updates syntax highlighting
            theme="vs-dark"
            value={inputCode}
            onChange={setInputCode}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        {/* Right Panel - Dynamic Language */}
        <div className="panel">
          <div className="panel-header output">Readable Test Suite</div>
          <Editor 
            height="100%" 
            language={language} 
            theme="vs-dark"
            value={outputTest}
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;