import React from 'react';

interface FilterDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ options, value, onChange, label }) => (
  <div className="mb-4">
    {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full md:w-48 px-3 py-2 border rounded focus:outline-none focus:ring"
    >
      <option value="">All</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default FilterDropdown;
