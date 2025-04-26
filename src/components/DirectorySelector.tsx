import React from 'react';
import { Folder } from 'lucide-react';

interface DirectorySelectorProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: () => void;
  icon?: React.ReactNode;
  error?: string | null; // Add error prop
}

const DirectorySelector: React.FC<DirectorySelectorProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onSelect,
  icon,
  error
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
          className={`input-field ${error ? 'border-red-500' : ''}`}
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
      {error && (
        <div className="text-red-500 text-sm mt-1 fade-in">
          {error}
        </div>
      )}
    </div>
  );
};

export default DirectorySelector;