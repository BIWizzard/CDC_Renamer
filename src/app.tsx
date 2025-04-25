import React, { useState, useEffect } from 'react';
import { FolderIcon, ClockIcon, RefreshIcon, SaveIcon, XIcon } from './components/Icons';
import DirectorySelector from './components/DirectorySelector';
import TimestampInput from './components/TimestampInput';
import FilePreview from './components/FilePreview';
import { PowerShellService } from './services/PowerShellService';

// Initialize PowerShell service
const powershell = new PowerShellService();

const App: React.FC = () => {
  // State management
  const [sourceDir, setSourceDir] = useState<string>('');
  const [targetDir, setTargetDir] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');
  const [regexPattern, setRegexPattern] = useState<string>('_\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}-\\d{2}$');
  const [previewOnly, setPreviewOnly] = useState<boolean>(true);
  const [files, setFiles] = useState<{ original: string; renamed: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready');
  
  // Set default timestamp on load
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    setTimestamp(`_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.txt`);
  }, []);
  
  // Load files from directory - your existing code
  const loadFiles = async () => {
    // Your existing loadFiles code...
  };
  
  // Use current timestamp - your existing code
  const useCurrentTime = () => {
    // Your existing useCurrentTime code...
  };
  
  // Rename files - your existing code
  const renameFiles = async () => {
    // Your existing renameFiles code...
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="app-header">
        <h1>CDC File Renamer</h1>
        <p>Change Data Capture File Management Tool</p>
      </div>
      
      {/* Main content */}
      <div className="p-4 flex-grow">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Source directory */}
          <div className="card">
            <label>Source Directory</label>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder="Select source directory"
                value={sourceDir}
                readOnly
              />
              <button
                className="browse-button"
                onClick={async () => {
                  const dir = await window.electronAPI.selectDirectory();
                  if (dir) {
                    setSourceDir(dir);
                    loadFiles();
                  }
                }}
              >
                <FolderIcon />
                <span className="ml-1">Browse...</span>
              </button>
            </div>
          </div>
          
          {/* Target directory */}
          <div className="card">
            <label>Target Directory</label>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder="Select target directory"
                value={targetDir}
                readOnly
              />
              <button
                className="browse-button"
                onClick={async () => {
                  const dir = await window.electronAPI.selectDirectory();
                  if (dir) {
                    setTargetDir(dir);
                  }
                }}
              >
                <FolderIcon />
                <span className="ml-1">Browse...</span>
              </button>
            </div>
          </div>
          
          {/* CDC Timestamp */}
          <div className="card">
            <label>New CDC Timestamp Suffix</label>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                value={timestamp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimestamp(e.target.value)}
              />
              <button
                className="time-button"
                onClick={useCurrentTime}
              >
                <ClockIcon />
                <span className="ml-1">Use Current Time</span>
              </button>
            </div>
          </div>
          
          {/* Options */}
          <div className="card">
            <div className="flex flex-wrap items-start justify-between">
              <div>
                <label>Options</label>
                <div className="mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={previewOnly}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewOnly(e.target.checked)}
                    />
                    <span className="ml-2">Preview Only (No Actual Changes)</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:w-1/2">
                <label>CDC Pattern Regex</label>
                <input
                  type="text"
                  className="input-field w-full mt-2"
                  value={regexPattern}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegexPattern(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* File Preview */}
          <div>
            <label>File Rename Preview</label>
            
            {isLoading ? (
              <div className="empty-state">
                <div>
                  <div className="loading-spinner mb-2 mx-auto"></div>
                  <p>Loading files...</p>
                </div>
              </div>
            ) : files.length === 0 ? (
              <div className="empty-state">
                <p>No files to display. Select a source directory and click "Refresh Preview".</p>
              </div>
            ) : (
              <div className="card overflow-auto" style={{ maxHeight: '400px' }}>
                <table className="preview-table">
                  <thead>
                    <tr>
                      <th>Original Filename</th>
                      <th>New Filename</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr key={index}>
                        <td>{file.original}</td>
                        <td>{file.renamed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="footer">
        <div className="button-group">
          <button
            className="button button-blue"
            onClick={loadFiles}
            disabled={isLoading}
          >
            <RefreshIcon />
            Refresh Preview
          </button>
          
          <button
            className="button button-green"
            onClick={renameFiles}
            disabled={isLoading || files.length === 0}
          >
            <SaveIcon />
            Rename Files
          </button>
          
          <button
            className="button button-red"
            onClick={() => window.close()}
          >
            <XIcon />
            Close
          </button>
        </div>
        
        <div className="status-message">
          {statusMessage}
        </div>
      </div>
    </div>
  );
};

export default App;