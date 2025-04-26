import React from 'react';

interface FilePreviewProps {
  files: { original: string; renamed: string }[];
  isLoading: boolean;
  icon?: React.ReactNode;
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, isLoading, icon }) => {
  if (isLoading) {
    return (
      <div className="empty-state">
        <div className="loading-spinner"></div>
        <p className="mt-4">Loading files...</p>
      </div>
    );
  }
  
  if (files.length === 0) {
    return (
      <div className="empty-state">
        {icon}
        <p className="mt-2">No files to display.</p>
        <p className="text-sm text-gray-500 mt-2">
          Select a source directory and click "Refresh Preview".
        </p>
      </div>
    );
  }
  
  return (
    <div className="preview-table-container">
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
              <td className="text-green-600">{file.renamed}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="preview-summary">
        {files.length} file{files.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
};

export default FilePreview;