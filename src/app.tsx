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
  
  // Load files from directory - simplified with basic output format
  const loadFiles = async () => {
    if (!sourceDir) {
      setStatusMessage('Please select a source directory');
      return;
    }
    
    setIsLoading(true);
    setStatusMessage('Loading files...');
    
    try {
      console.log(`Loading files from directory: ${sourceDir}`);
      
      // Try a very basic PowerShell command first to test if PowerShell works at all
      const testScript = 'Write-Output "TEST_OUTPUT"';
      console.log('Executing test script:', testScript);
      const testResult = await powershell.executeCommand(testScript);
      console.log('Test script result:', testResult);
      
      // Now try a simplified command to list files
      const powershellScript = `Write-Output (Get-ChildItem -Path "${sourceDir}" -Filter "*.txt" | ForEach-Object { $_.Name })`;
      
      console.log('Executing main script:', powershellScript);
      
      const result = await powershell.executeCommand(powershellScript);
      console.log('PowerShell result:', result);
      
      if (!result || result.trim() === '') {
        setStatusMessage("No .txt files found in directory");
        setFiles([]);
        return;
      }
      
      // Parse file names from the result (one per line)
      const fileNameList = result.split('\n').map(name => name.trim()).filter(name => name.length > 0);
      
      if (fileNameList.length > 0) {
        console.log('Parsed file names:', fileNameList);
        
        // Convert to our file list format
        const filesList = fileNameList.map(fileName => {
          // Extract just the base name (without timestamp and extension)
          const baseName = fileName.replace(/(_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})\.txt$/, '');
          return {
            original: fileName,
            renamed: `${baseName}${timestamp}`
          };
        });
        
        setFiles(filesList);
        setStatusMessage(`${filesList.length} files found`);
      } else {
        console.error('No files found in result');
        setStatusMessage('No .txt files found in directory');
        setFiles([]);
      }
    } catch (error: unknown) {
      console.error('Error loading files:', error);
      setStatusMessage(`Error loading files: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setFiles([]);
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
  
  const renameFiles = async () => {
    if (!sourceDir) {
      setStatusMessage('Please select a source directory');
      return;
    }
    
    if (!targetDir) {
      setStatusMessage('Please select a target directory');
      return;
    }
    
    if (previewOnly) {
      alert('Preview mode is enabled. Uncheck "Preview Only" to make actual changes.');
      return;
    }
    
    const confirmed = window.confirm(`This will rename ${files.length} files. Proceed?`);
    if (!confirmed) return;
    
    setIsLoading(true);
    setStatusMessage('Renaming files...');
    
    try {
      const result = await powershell.executeCommand(`
        # Create target directory if it doesn't exist
        if (-not (Test-Path -Path "${targetDir}")) {
          New-Item -Path "${targetDir}" -ItemType Directory | Out-Null
          Write-Output "Created directory: ${targetDir}"
        }
        
        $successCount = 0
        $failCount = 0
        
        # Output the source and target directories for debugging
        Write-Output "Source Directory: ${sourceDir}"
        Write-Output "Target Directory: ${targetDir}"
        
        Get-ChildItem -Path "${sourceDir}" -Filter "*.txt" | ForEach-Object {
          # Get just the base name without the timestamp or extension
          $fileName = $_.Name
          # Extract base part (before the timestamp)
          $baseName = $fileName -replace "(_\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}-\\d{2})\\.txt$", ""
          # Create new filename - FIXED: properly concatenate baseName with timestamp
          $newFileName = "$($baseName)${timestamp}"
          
          Write-Output "Original: $fileName, Base: $baseName, New: $newFileName"
          
          $destinationPath = Join-Path -Path "${targetDir}" -ChildPath $newFileName
          
          Write-Output "Copying $($_.FullName) to $destinationPath"
          
          try {
            Copy-Item -Path $_.FullName -Destination $destinationPath -ErrorAction Stop
            $successCount++
            Write-Output "Success: $($_.Name) -> $newFileName"
          } catch {
            $failCount++
            Write-Output "Failed: $($_.Name) - $($_.Exception.Message)"
          }
        }
        
        [PSCustomObject]@{
          SuccessCount = $successCount
          FailCount = $failCount
        } | ConvertTo-Json -Compress
      `);
      
      // Parse result - extract JSON
      const jsonMatch = result.match(/{.*}/);
      if (jsonMatch) {
        try {
          const { SuccessCount, FailCount } = JSON.parse(jsonMatch[0]);
          
          setStatusMessage(`Operation completed: ${SuccessCount} files renamed successfully, ${FailCount} files failed`);
          alert(`Operation completed\n${SuccessCount} files renamed successfully\n${FailCount} files failed`);
          
          // Refresh the preview
          loadFiles();
        } catch (e) {
          console.error('Error parsing result JSON:', e);
          setStatusMessage('Error completing rename operation');
        }
      } else {
        console.error('Failed to parse rename result:', result);
        setStatusMessage('Error completing rename operation');
      }
    } catch (error: unknown) {
      console.error('Error renaming files:', error);
      setStatusMessage(`Error renaming files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-semibold text-center">CDC File Renamer</h1>
        <p className="text-center">Change Data Capture File Management Tool</p>
      </div>
      
      {/* Main content */}
      <div className="flex-grow p-6 space-y-6">
        {/* Source directory */}
        <DirectorySelector
          label="Source Directory"
          placeholder="Select source directory"
          value={sourceDir}
          onChange={setSourceDir}
          icon={<FolderIcon />}
          onSelect={loadFiles}
        />
        
        {/* Target directory */}
        <DirectorySelector
          label="Target Directory"
          placeholder="Select target directory"
          value={targetDir}
          onChange={setTargetDir}
          icon={<FolderIcon />}
        />
        
        {/* CDC Timestamp */}
        <TimestampInput
          label="New CDC Timestamp Suffix"
          value={timestamp}
          onChange={setTimestamp}
          onUseCurrentTime={useCurrentTime}
          icon={<ClockIcon />}
        />
        
        {/* Options */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Options</h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={previewOnly}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewOnly(e.target.checked)}
                />
                <span>Preview Only (No Actual Changes)</span>
              </label>
            </div>
            
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CDC Pattern Regex
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={regexPattern}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegexPattern(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* File Preview */}
        <div>
          <h2 className="text-lg font-semibold mb-2">File Rename Preview</h2>
          <FilePreview files={files} isLoading={isLoading} />
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="flex flex-wrap justify-center space-x-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md flex items-center"
            onClick={loadFiles}
            disabled={isLoading}
          >
            <RefreshIcon className="mr-2" />
            Refresh Preview
          </button>
          
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md flex items-center"
            onClick={renameFiles}
            disabled={isLoading || files.length === 0}
          >
            <SaveIcon className="mr-2" />
            Rename Files
          </button>
          
          <button
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md flex items-center"
            onClick={() => window.close()}
          >
            <XIcon className="mr-2" />
            Close
          </button>
        </div>
        
        {/* Status bar */}
        <div className="mt-4 text-center text-gray-600">
          {statusMessage}
        </div>
      </div>
    </div>
  );
};

export default App;