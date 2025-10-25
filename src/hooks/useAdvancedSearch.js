import { useState, useCallback } from 'react';
import { passengerApi } from '../services/api';

export const useAdvancedSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBuses = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await passengerApi.searchBuses({
        ...params,
        includeAlternatives: true,
        includeRatings: true
      });

      // Process and sort results
      const sortedResults = processBusResults(response.data);
      setSearchResults(sortedResults);
      
      return sortedResults;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processBusResults = (buses) => {
    return buses
      .map(bus => ({
        ...bus,
        score: calculateBusScore(bus)
      }))
      .sort((a, b) => b.score - a.score);
  };

  const calculateBusScore = (bus) => {
    let score = 0;
    // Rating weight
    score += (bus.rating || 0) * 0.3;
    // Availability weight
    score += (bus.availableSeats / bus.totalSeats) * 0.2;
    // Price competitiveness weight
    score += calculatePriceScore(bus.fare) * 0.3;
    // Amenities weight
    score += (bus.amenities?.length || 0) * 0.1;
    return score;
  };

  return {
    searchResults,
    loading,
    error,
    searchBuses
  };
};

export default useAdvancedSearch;
