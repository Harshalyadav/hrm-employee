import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder || 'Search...'}
    className="w-full md:w-64 px-4 py-2 border rounded focus:outline-none focus:ring mb-4"
  />
);

export default SearchBar;
