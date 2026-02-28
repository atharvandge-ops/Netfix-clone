import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';

const FilterSidebar = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [options, setOptions] = useState({
    genres: [],
    categories: [],
    years: [],
    ratings: []
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await searchService.getFilterOptions();
      if (response.success) {
        setOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white text-xl font-bold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-red-500 hover:text-red-400 text-sm"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white font-semibold mb-2">Genre</label>
          <select
            value={filters.genre || ''}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">All Genres</option>
            {options.genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">All Categories</option>
            {options.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Release Year</label>
          <select
            value={filters.releaseYear || ''}
            onChange={(e) => handleFilterChange('releaseYear', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">All Years</option>
            {options.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Rating</label>
          <select
            value={filters.rating || ''}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">All Ratings</option>
            {options.ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
