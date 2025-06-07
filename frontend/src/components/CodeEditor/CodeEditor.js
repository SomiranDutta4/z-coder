import React, { useState } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditor = () => {
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleCodeChange = (newCode) => setCode(newCode);

  const handleRunCode = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await axios.post(
        process.env.REACT_APP_backendUrl + '/api/code/execute',
        { language, code }
      );
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="flex flex-col lg:flex-row gap-6 rounded-md shadow-lg max-w-full mx-auto w-full max-w-7xl min-h-[600px]">
        {/* Editor & Controls */}
        <div className="flex flex-col w-full lg:w-1/2">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-gray-800 text-gray-200 rounded-md px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              aria-label="Select programming language"
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="c_cpp">C++</option>
            </select>

            <button
              onClick={handleRunCode}
              disabled={loading}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 transition ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                  : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
              }`}
              aria-label="Run code"
            >
              {loading ? 'Running...' : 'Run Code'}
            </button>
          </div>

          <AceEditor
            mode={language}
            theme="monokai"
            value={code}
            onChange={handleCodeChange}
            editorProps={{ $blockScrolling: true }}
            lineHeight={24}
            fontSize={16}
            width="100%"
            height="500px"
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            placeholder="Write your code here..."
            style={{ borderRadius: '8px', border: '1px solid #444' }}
          />
        </div>

        {/* Output */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <label
            htmlFor="output"
            className="mb-2 text-gray-300 font-semibold select-none"
          >
            Output:
          </label>
          <pre
            id="output"
            className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-md text-gray-200 overflow-y-auto font-mono whitespace-pre-wrap break-words min-h-[500px]"
          >
            {output || (loading ? 'Executing...' : 'Output will appear here...')}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
