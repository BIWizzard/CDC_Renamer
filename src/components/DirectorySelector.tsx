import React from 'react';
import NodePowershell from 'node-powershell';

// Since we can't use the remote module directly anymore, we'll need to use IPC
// This is a simplified version that will work without remote
interface DirectorySelectorProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

const DirectorySelector: React.FC<DirectorySelectorProps> = ({
  label,
  placeholder,
  value,
  onChange,
  icon,
  onSelect
}) => {
  // For now, we'll simulate the directory selection
  // In a full implementation, we'd use IPC to communicate with the main process
  const handleBrowse = async () => {
    // In a real implementation, we'd use IPC to call the main process
    // For this example, we'll just use a mock path
    const mockPath = 'C:\\Users\\example\\Documents';
    onChange(mockPath);
    
    // Call the onSelect callback if provided
    if (onSelect) {
      onSelect();
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <label className="block text-lg font-semibold mb-2">{label}</label>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-l-md"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md flex items-center"
          onClick={handleBrowse}
        >
          {icon}
          <span className="ml-1">Browse...</span>
        </button>
      </div>
    </div>
  );
};

export default DirectorySelector;