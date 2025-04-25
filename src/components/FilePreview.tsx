import React from 'react';

interface FilePreviewProps {
  files: { original: string; renamed: string }[];
  isLoading: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 min-h-[300px] flex items-center justify-center transition-shadow duration-300 hover:shadow-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-500">Loading files...</p>
        </div>
      </div>
    );
  }
  
  if (files.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 min-h-[300px] flex items-center justify-center transition-shadow duration-300 hover:shadow-lg">
        <p className="text-gray-500">
          No files to display. Select a source directory and click "Refresh Preview".
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original Filename
              </th>
              <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                New Filename
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file, index) => (
              <tr 
                key={index} 
                className={`
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                  hover:bg-blue-50 transition-colors duration-150
                `}
              >
                <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                  {file.original}
                </td>
                <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-600 truncate max-w-xs">
                  <span className="text-green-600">{file.renamed}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-4 md:px-6 py-2 border-t border-gray-200 text-xs text-gray-500">
        {files.length} file{files.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
};

export default FilePreview;