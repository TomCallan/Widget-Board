import React, { useState, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  }, [onSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search widgets by name, description, or tags..."
        value={value}
        onChange={handleChange}
        className="search-input"
      />
    </div>
  );
}; 