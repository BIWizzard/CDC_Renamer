import React, { useState, useEffect } from 'react';
import { Folder, Clock, RefreshCw, Save, X, FileText } from 'lucide-react';
import DirectorySelector from './components/DirectorySelector';
import TimestampInput from './components/TimestampInput';
import FilePreview from './components/FilePreview';
import ThemeToggle from './components/ThemeToggle';
import { PowerShellService } from './services/PowerShellService';
import { ValidationService } from './services/ValidationService';
import { ThemeProvider } from './contexts/ThemeContext';

// Import additional CSS
import '../styles/animations.css';
import '../styles/theme.css';

// Initialize PowerShell service
const powershell = new PowerShellService();

const AppContent: React.FC = () => {
  // State management
  const [sourceDir, setSourceDir] = useState<string>('');
  const [targetDir, setTargetDir] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');
  const [regexPattern, setRegexPattern] = useState<string>('(_\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}-\\d{2})\\.txt$');
  const [previewOnly, setPreviewOnly] = useState<boolean>(true);
  const [files, setFiles] = useState<{ original: string; renamed: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready');
  
  // Validation state
  const [sourceDirError, setSourceDirError] = useState<string | null>(null);
  const [targetDirError, setTargetDirError] = useState<string | null>(null);
  const [timestampError, setTimestampError] = useState<string | null>(null);
  const [regexPatternError, setRegexPatternError] = useState<string | null>(null);
  
  // Track if this is the first render
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  
  // Animation states
  const [showLoadingAnimation, setShowLoadingAnimation] = useState<boolean>(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<boolean>(false);
  
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
    
    // Mark first render as complete
    setIsFirstRender(false);
  }, []);
  
  // Load files whenever sourceDir changes (but not on first render)
  useEffect(() => {
    // Skip the first render to avoid trying to load files when the component mounts
    if (isFirstRender) {
      return;
    }
    
    // Only load files if sourceDir is not empty
    if (sourceDir) {
      // Clear previous error when source changes
      setSourceDirError(null);
      loadFiles();
    }
  }, [sourceDir]); // This will trigger whenever sourceDir changes
  
  // Manage success animation
  useEffect(() => {
    if (showSuccessAnimation) {
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessAnimation]);
  
  // Validation function
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate source directory
    const sourceError = ValidationService.validateSourceDirectory(sourceDir);
    setSourceDirError(sourceError);
    if (sourceError) isValid = false;
    
    // Validate target directory (only if not in preview mode or when actually renaming)
    if (!previewOnly) {
      const targetError = ValidationService.validateTargetDirectory(targetDir);
      setTargetDirError(targetError);
      if (targetError) isValid = false;
    }
    
    // Validate timestamp
    const timeError = ValidationService.validateTimestamp(timestamp);
    setTimestampError(timeError);
    if (timeError) isValid = false;
    
    // Validate regex pattern
    const regexError = ValidationService.validateRegexPattern(regexPattern);
    setRegexPatternError(regexError);
    if (regexError) isValid = false;
    
    return isValid;
  };
  
  // Handler for source directory change
  const handleSourceDirChange = (value: string) => {
    setSourceDir(value);
    // The useEffect above will handle loading files when sourceDir changes
  };
  
  // Handler for target directory change
  const handleTargetDirChange = (value: string) => {
    setTargetDir(value);
    // Clear target directory error when it changes
    setTargetDirError(null);
  };
  
  // Handler for timestamp change
  const handleTimestampChange = (value: string) => {
    setTimestamp(value);
    // Clear timestamp error when it changes
    setTimestampError(null);
  };
  
  // Handler for regex pattern change
  const handleRegexPatternChange = (value: string) => {
    setRegexPattern(value);
    // Clear regex pattern error when it changes
    setRegexPatternError(null);
  };
  
  // Load files from directory
  const loadFiles = async () => {
    // Validate form before loading files
    if (!validateForm()) {
      setStatusMessage('Please fix validation errors before proceeding.');
      return;
    }
    
    // Critical check: ensure sourceDir exists before proceeding
    if (!sourceDir) {
      return; // Don't show an alert, just return silently since this should never happen now
    }
    
    setIsLoading(true);
    setShowLoadingAnimation(true);
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
        setShowLoadingAnimation(false);
        return;
      }
      
      // Parse the file list and generate preview
      const fileNames: string[] = result.split('\n').filter((name: string) => name.trim() !== '');
      const filesList = fileNames.map((fileName: string) => {
        const originalBase = fileName.replace('.txt', '');
        const baseName = originalBase.replace(new RegExp(regexPattern.replace('\\.txt$', '')), '');
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
      setShowLoadingAnimation(false);
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
    
    const newTimestamp = `_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.txt`;
    setTimestamp(newTimestamp);
    
    // Clear timestamp error when using current time
    setTimestampError(null);
  };
  
  // Rename files with FIXED PowerShell string concatenation
  const renameFiles = async () => {
    // Validate form before renaming files
    if (!validateForm()) {
      setStatusMessage('Please fix validation errors before proceeding.');
      return;
    }
    
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
    setShowLoadingAnimation(true);
    setStatusMessage('Renaming files...');
    
    try {
      // PowerShell script to rename files with FIXED string concatenation
      const script = `
        # Create target directory if it doesn't exist
        if (-not (Test-Path -Path "${targetDir}")) {
            New-Item -Path "${targetDir}" -ItemType Directory | Out-Null
        }

        # Copy and rename each file without changing content
        Get-ChildItem -Path "${sourceDir}" -Filter "*.txt" | ForEach-Object {
            $originalBase = $_.BaseName
            $baseName = $originalBase -replace "${regexPattern.replace('\\.txt$', '')}", ""
            # Fixed string concatenation for PowerShell
            $newFileName = "$($baseName)${timestamp}"
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
        setShowSuccessAnimation(true);
      }
    } catch (error) {
      console.error('Error renaming files:', error);
      setStatusMessage('Error renaming files. Please try again.');
    } finally {
      setIsLoading(false);
      setShowLoadingAnimation(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Header with KGiQ branding */}
      <header className="app-header">
        {/* KGiQ Logo */}
        <img src="../assets/KGiQ-Logo-spread-transparent.svg" alt="KGiQ" className="brand-logo" />
        
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
              onChange={handleSourceDirChange}
              icon={<Folder size={18} />}
              error={sourceDirError}
            />
            
            {/* Target Directory */}
            <DirectorySelector 
              label="Target Directory" 
              placeholder="Select target directory"
              value={targetDir}
              onChange={handleTargetDirChange}
              icon={<Folder size={18} />}
              error={targetDirError}
            />
            
            {/* CDC Timestamp */}
            <TimestampInput 
              label="New CDC Timestamp Suffix"
              value={timestamp}
              onChange={handleTimestampChange}
              onUseCurrentTime={useCurrentTime}
              icon={<Clock size={18} />}
              error={timestampError}
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
                  <label>
                    CDC Pattern Regex
                    <span className="tooltip">
                      <i>ⓘ</i>
                      <span className="tooltip-text">
                        This pattern identifies the timestamp portion of filenames that should be replaced.
                        The default pattern matches date_time format like "_2025-04-25_14-30-00".
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input-field w-full ${regexPatternError ? 'border-red-500' : ''}`}
                    value={regexPattern}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRegexPatternChange(e.target.value)}
                  />
                  {regexPatternError && (
                    <div className="text-red-500 text-sm mt-1 fade-in">
                      {regexPatternError}
                    </div>
                  )}
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
                className={`button button-blue ${showLoadingAnimation && isLoading ? 'loading-button' : ''}`}
                onClick={loadFiles}
                disabled={isLoading || !sourceDir}
              >
                <RefreshCw size={18} className={isLoading ? 'loading-spinner' : ''} />
                Refresh Preview
              </button>
              
              <button
                className={`button button-green ${!previewOnly ? 'pulse' : ''}`}
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
              <div className={`status-message ${statusMessage.includes('Successfully') ? 'status-success' : ''} ${showSuccessAnimation ? 'successFlash' : ''}`}>
                {statusMessage}
              </div>
            </div>
          </div>
          
          {/* Small KGiQ branding in footer */}
          <div className="footer-brand">
            Powered by <img src="../assets/KGiQ-Logo-spread-transparent.svg" alt="KGiQ" />
          </div>
        </div>
      </footer>
      
      {/* Progress bar for loading state */}
      {showLoadingAnimation && (
        <div className={`progress-bar ${isLoading ? 'progress-animate' : ''}`}></div>
      )}
    </div>
  );
};

// Wrap the app with ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;