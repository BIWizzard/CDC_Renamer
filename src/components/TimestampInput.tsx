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
    <div className="bg-white shadow-md rounded-lg p-6">
      <label className="block text-lg font-semibold mb-2">{label}</label>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-l-md"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md flex items-center"
          onClick={onUseCurrentTime}
        >
          {icon}
          <span className="ml-1">Use Current Time</span>
        </button>
      </div>
    </div>
  );
};

export default TimestampInput;