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
    <div className="card">
      <label>{label}</label>
      <div className="input-group">
        <input
          type="text"
          className="input-field"
          placeholder={placeholder}
          value={value}
          readOnly
        />
        <button
          className="browse-button"
          onClick={handleBrowse}
        >
          {icon}
          <span className="ml-2">Browse</span>
        </button>
      </div>
    </div>
  );
};

export default DirectorySelector;