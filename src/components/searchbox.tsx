import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Filter } from 'lucide-react';


// Define the FilterTag type
type FilterTag = {
  id: string;
  type: string;
  label: string;
  value: string;
};

interface SearchBarProps {
  onFiltersChange: (filters: FilterTag[]) => void;
  data: Casino[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onFiltersChange, data }) => {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<FilterTag[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const filterOptions = [
    { key: 'casinoName', label: 'Casino Name', values: [...new Set(data.map(item => item.casinoName))] },
    { key: 'location', label: 'Location', values: [...new Set(data.map(item => item.location))] },
    { key: 'category', label: 'Category', values: [...new Set(data.map(item => item.category))] },
    { key: 'casinoInfo', label: 'Casino Info', values: [...new Set(data.map(item => item.casinoInfo))] },
    { key: 'status', label: 'Status', values: ['active', 'inactive'] },
    { key: 'content', label: 'Content', values: ['enable', 'disable'] }
  ];

  // Get available filter options (exclude already used filters)
  const availableFilterOptions = filterOptions.filter(option => 
    !filters.some(filter => filter.type === option.key)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Create filters array including dynamic search if active
    const allFilters = [...filters];
    
    if (selectedFilter && searchText.trim()) {
      // Add a dynamic search filter for real-time filtering
      const dynamicFilter: FilterTag = {
        id: `dynamic-${selectedFilter}-${Date.now()}`,
        type: selectedFilter as FilterTag['type'],
        label: filterOptions.find(opt => opt.key === selectedFilter)?.label || selectedFilter,
        value: searchText.trim()
      };
      allFilters.push(dynamicFilter);
    }
    
    onFiltersChange(allFilters);
  }, [filters, selectedFilter, searchText, onFiltersChange]);

  const selectFilter = (filterKey: string) => {
    setSelectedFilter(filterKey);
    setShowDropdown(false);
    setSearchText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ';' && selectedFilter && searchText.trim()) {
      e.preventDefault();
      
      // Create permanent filter tag
      const newFilter: FilterTag = {
        id: `${selectedFilter}-${searchText.trim()}-${Date.now()}`,
        type: selectedFilter as FilterTag['type'],
        label: filterOptions.find(opt => opt.key === selectedFilter)?.label || selectedFilter,
        value: searchText.trim()
      };
      
      setFilters([...filters, newFilter]);
      setSelectedFilter(null);
      setSearchText('');
    }
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setFilters([]);
    setSelectedFilter(null);
    setSearchText('');
  };

  const getPlaceholderText = () => {
    if (selectedFilter) {
      const filterLabel = filterOptions.find(opt => opt.key === selectedFilter)?.label;
      return `Type ${filterLabel?.toLowerCase()} and press ';' to create filter...`;
    }
    return "Select a filter first...";
  };

  return (
    <div className="w-full max-w-4xl mx-auto" ref={searchRef}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center px-3 py-2 flex-1">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholderText()}
              className="w-full bg-transparent outline-none text-sm placeholder-gray-500"
              disabled={!selectedFilter}
            />
            {selectedFilter && (
              <div className="flex items-center mr-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {filterOptions.find(opt => opt.key === selectedFilter)?.label}
                </span>
                <button
                  onClick={() => {
                    setSelectedFilter(null);
                    setSearchText('');
                  }}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 border-l border-gray-200"
            disabled={availableFilterOptions.length === 0}
          >
            <Filter className="w-4 h-4 mr-1" />
            <span className="text-sm">Filters</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && availableFilterOptions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              {availableFilterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => selectFilter(option.key)}
                  className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-50 rounded text-left"
                >
                  <span className="font-medium text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Active filters:</span>
          {filters.map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
            >
              <span className="text-blue-600 mr-1">{filter.label}:</span>
              {filter.value}
              <button
                onClick={() => removeFilter(filter.id)}
                className="ml-1.5 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-2 text-xs text-gray-500">
        {!selectedFilter ? "Select a filter from the dropdown to start searching" : 
         `Type your search term and press ';' to create a filter tag`}
      </div>
    </div>
  );
};

export default SearchBar;