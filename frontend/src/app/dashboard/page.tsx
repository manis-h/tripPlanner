// frontend/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Update the import path if TripCard is located elsewhere, for example:
// Or, if TripCard is in 'frontend/src/components/TripCard.tsx', use:
import { TripPlan, TripsResponse } from '../types/trips';
import TripCard from '../components/TipPlan';
import Link from 'next/link';

export default function DashboardPage() {
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchTrips();
  }, [currentPage, searchTerm, minBudget, maxBudget]);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '3',
        ...(searchTerm && { search: searchTerm }),
        ...(minBudget && { minBudget }),
        ...(maxBudget && { maxBudget }),
      });

      const response = await fetch(`http://localhost:3001/api/trips?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }

      const data: TripsResponse = await response.json();
      setTrips(data.trips);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTrips();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setMinBudget('');
    setMaxBudget('');
    setCurrentPage(1);
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Your Trip Plans</h1>
          <p className="text-green-600 text-lg">Manage and view all your travel adventures</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-blue-100">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="search" className="block text-sm font-semibold text-blue-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or destination"
                className="w-full px-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="minBudget" className="block text-sm font-semibold text-blue-700 mb-1">
                Min Budget (₹)
              </label>
              <input
                type="number"
                id="minBudget"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                min="0"
                placeholder="Min"
                className="w-full px-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="maxBudget" className="block text-sm font-semibold text-blue-700 mb-1">
                Max Budget (₹)
              </label>
              <input
                type="number"
                id="maxBudget"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                min="0"
                placeholder="Max"
                className="w-full px-4 py-2 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-gray-800"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors duration-300 font-semibold"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Trips Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-blue-700 font-medium">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-blue-100">
            <p className="text-blue-700 text-lg font-medium mb-4">No trips found. Create your first trip plan!</p>
            <Link
              href="/submit"
              className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
            >
              Create New Trip
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} onEdit={handleEdit} />
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <Link 
                href="/submit" 
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
              >
                Create New Trip
              </Link>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border-2 border-blue-100 rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-blue-700"
                  >
                    Previous
                  </button>
                  <span className="text-blue-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border-2 border-blue-100 rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-blue-700"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
