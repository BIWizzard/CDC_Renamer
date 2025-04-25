import React, { useState, useEffect } from 'react';
import { Folder, Clock, RefreshCw, Save, X, FileText } from 'lucide-react';
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
  
  // Load files from directory
  const loadFiles = async () => {
    if (!sourceDir) {
      alert('Please select a source directory first.');
      return;
    }
    
    setIsLoading(true);
    setStatusMessage('Loading files...');
    
    try {
      // PowerShell script to list files
      const script = `
        Get-ChildItem -Path "${sourceDir}" -Filter "*.txt" | ForEach-Object {
          $_.Name
        }
      `;
      
      const result = await powershell.executePowerShell(script);
      
      if (!result || result.trim() === '') {
        setFiles([]);
        setStatusMessage('No text files found in the selected directory.');
        setIsLoading(false);
        return;
      }
      
      // Parse the file list and generate preview
      const fileNames: string[] = result.split('\n').filter((name: string) => name.trim() !== '');
      const filesList = fileNames.map((fileName: string) => {
        const originalBase = fileName.replace('.txt', '');
        const baseName = originalBase.replace(new RegExp(regexPattern), '');
        const newFileName = `${baseName}${timestamp}`;
        
        return {
          original: fileName,
          renamed: newFileName
        };
      });
      
      setFiles(filesList);
      setStatusMessage(`Found ${filesList.length} files`);
    } catch (error) {
      console.error('Error loading files:', error);
      setStatusMessage('Error loading files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use current timestamp
  const useCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    setTimestamp(`_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.txt`);
  };
  
  // Rename files
  const renameFiles = async () => {
    if (!sourceDir || !targetDir) {
      alert('Please select both source and target directories.');
      return;
    }
    
    if (files.length === 0) {
      alert('No files to rename.');
      return;
    }
    
    if (previewOnly) {
      alert('Preview mode is enabled. Uncheck "Preview Only" to rename files.');
      return;
    }
    
    const confirmRename = window.confirm(`This will rename ${files.length} files. Proceed?`);
    if (!confirmRename) {
      return;
    }
    
    setIsLoading(true);
    setStatusMessage('Renaming files...');
    
    try {
      // PowerShell script to rename files
      const script = `
        # Create target directory if it doesn't exist
        if (-not (Test-Path -Path "${targetDir}")) {
            New-Item -Path "${targetDir}" -ItemType Directory | Out-Null
        }

        # Copy and rename each file without changing content
        Get-ChildItem -Path "${sourceDir}" -Filter "*.txt" | ForEach-Object {
            $originalBase = $_.BaseName
            $baseName = $originalBase -replace "${regexPattern}", ""
            $newFileName = "$baseName${timestamp}"
            $destinationPath = Join-Path -Path "${targetDir}" -ChildPath $newFileName
            Copy-Item -Path $_.FullName -Destination $destinationPath
        }
        
        # Count files in target directory
        (Get-ChildItem -Path "${targetDir}" -Filter "*.txt").Count
      `;
      
      const result = await powershell.executePowerShell(script);
      const fileCount = parseInt(result.trim(), 10);
      
      if (isNaN(fileCount)) {
        setStatusMessage('Files renamed, but could not count the result.');
      } else {
        setStatusMessage(`Successfully renamed ${fileCount} files`);
      }
    } catch (error) {
      console.error('Error renaming files:', error);
      setStatusMessage('Error renaming files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="app-header">
        <h1>CDC File Renamer</h1>
        <p>Change Data Capture File Management Tool</p>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6">
        <div className="main-container">
          <div className="space-y-6">
            {/* Source Directory */}
            <DirectorySelector 
              label="Source Directory" 
              placeholder="Select source directory"
              value={sourceDir}
              onChange={setSourceDir}
              onSelect={loadFiles}
              icon={<Folder size={18} />}
            />
            
            {/* Target Directory */}
            <DirectorySelector 
              label="Target Directory" 
              placeholder="Select target directory"
              value={targetDir}
              onChange={setTargetDir}
              icon={<Folder size={18} />}
            />
            
            {/* CDC Timestamp */}
            <TimestampInput 
              label="New CDC Timestamp Suffix"
              value={timestamp}
              onChange={setTimestamp}
              onUseCurrentTime={useCurrentTime}
              icon={<Clock size={18} />}
            />
            
            {/* Options */}
            <div className="card">
              <div className="options-container">
                <div className="options-left">
                  <label>Options</label>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={previewOnly}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewOnly(e.target.checked)}
                      id="previewCheckbox"
                    />
                    <label className="checkbox-label" htmlFor="previewCheckbox">
                      Preview Only (No Actual Changes)
                    </label>
                  </div>
                </div>
                
                <div className="options-right">
                  <label>CDC Pattern Regex</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={regexPattern}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegexPattern(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* File Preview */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                File Rename Preview
              </label>
              
              <FilePreview 
                files={files} 
                isLoading={isLoading} 
                icon={<FileText size={40} />}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="button-group">
              <button
                className="button button-blue"
                onClick={loadFiles}
                disabled={isLoading || !sourceDir}
              >
                <RefreshCw size={18} />
                Refresh Preview
              </button>
              
              <button
                className="button button-green"
                onClick={renameFiles}
                disabled={isLoading || files.length === 0 || !targetDir}
              >
                <Save size={18} />
                Rename Files
              </button>
              
              <button
                className="button button-red"
                onClick={() => window.close()}
              >
                <X size={18} />
                Close
              </button>
            </div>
            
            <div className="status-container">
              <div className="status-message">
                {statusMessage}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;