import React from 'react';

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
    try {
      const selectedPath = await window.electronAPI.selectDirectory();
      if (selectedPath) {
        onChange(selectedPath);
        
        // Call the onSelect callback if provided
        if (onSelect) {
          onSelect();
        }
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6 transition-shadow duration-300 hover:shadow-lg">
      <label className="block text-lg font-semibold mb-2 text-gray-800">{label}</label>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 
                    transition-colors duration-200 bg-gray-50 text-gray-700 truncate"
          placeholder={placeholder}
          value={value}
          readOnly
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md flex items-center
                    transition-colors duration-200"
          onClick={handleBrowse}
        >
          {icon}
          <span className="ml-1 whitespace-nowrap">Browse...</span>
        </button>
      </div>
    </div>
  );
};

export default DirectorySelector;