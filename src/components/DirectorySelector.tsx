import React from 'react';
import { Folder } from 'lucide-react';

interface DirectorySelectorProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: () => void;
  icon?: React.ReactNode;
}

const DirectorySelector: React.FC<DirectorySelectorProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onSelect,
  icon
}) => {
  const handleBrowse = async () => {
    try {
      const selectedPath = await window.electronAPI.selectDirectory();
      if (selectedPath) {
        // First update the state via onChange
        onChange(selectedPath);
        
        // DO NOT call onSelect callback here - this prevents the race condition
        // We'll handle file loading directly in the App component
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
          {icon || <Folder size={18} />}
          <span className="ml-2">Browse</span>
        </button>
      </div>
    </div>
  );
};

export default DirectorySelector;