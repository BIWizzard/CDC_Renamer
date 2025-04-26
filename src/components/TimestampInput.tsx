import React from 'react';

interface TimestampInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUseCurrentTime: () => void;
  icon?: React.ReactNode;
  error?: string | null; // Add error prop
}

const TimestampInput: React.FC<TimestampInputProps> = ({
  label,
  value,
  onChange,
  onUseCurrentTime,
  icon,
  error
}) => {
  return (
    <div className="card">
      <label>{label}</label>
      <div className="input-group">
        <input
          type="text"
          className={`input-field font-mono ${error ? 'border-red-500' : ''}`}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
        <button
          className="time-button"
          onClick={onUseCurrentTime}
        >
          {icon}
          <span className="ml-2">Use Current Time</span>
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

export default TimestampInput;