import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchVideos } from '../store/slices/searchSlice';
import VideoCard from '../components/VideoCard';
import FilterSidebar from '../components/FilterSidebar';
import Loading from '../components/Loading';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const dispatch = useDispatch();
  const { results, loading } = useSelector((state) => state.search);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (query) {
      dispatch(searchVideos({ q: query, ...filters }));
    }
  }, [query, filters, dispatch]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-white text-3xl font-bold mb-8">
          Search Results for "{query}"
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          <div className="lg:col-span-3">
            {results.length === 0 ? (
              <div className="text-center text-gray-400 text-xl py-16">
                No results found for "{query}"
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
