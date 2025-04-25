import React from 'react';

interface FilePreviewProps {
  files: { original: string; renamed: string }[];
  isLoading: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p>Loading files...</p>
        </div>
      </div>
    );
  }
  
  if (files.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 min-h-[300px] flex items-center justify-center">
        <p className="text-gray-500">
          No files to display. Select a source directory and click "Refresh Preview".
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 overflow-auto max-h-[400px]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Original Filename
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              New Filename
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {file.original}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.renamed}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilePreview;