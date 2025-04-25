import React from 'react';

interface TimestampInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUseCurrentTime: () => void;
  icon?: React.ReactNode;
}

const TimestampInput: React.FC<TimestampInputProps> = ({
  label,
  value,
  onChange,
  onUseCurrentTime,
  icon
}) => {
  return (
    <div className="card">
      <label>{label}</label>
      <div className="input-group">
        <input
          type="text"
          className="input-field font-mono"
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
    </div>
  );
};

export default TimestampInput;