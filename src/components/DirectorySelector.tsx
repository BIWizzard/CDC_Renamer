import React from 'react';

// Define the interface for our props
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
  const handleBrowse = async () => {
    // For now, let's use a mock implementation
    // We'll replace this with proper Electron IPC communication later
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
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