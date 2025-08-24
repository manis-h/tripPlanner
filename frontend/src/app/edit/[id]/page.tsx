// frontend/app/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TripForm from '../../components/TripForm';
import { TripFormData } from '../../types/trips';

export default function EditTripPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<TripFormData | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/trips/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip');
      }
      const trip = await response.json();
      setInitialData({
        title: trip.title,
        destination: trip.destination,
        days: trip.days,
        budget: trip.budget,
      });
    } catch (error) {
      console.error('Error fetching trip:', error);
      alert('Failed to load trip data');
      router.push('/dashboard');
    }
  };

  const handleSubmit = async (formData: TripFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/trips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Trip Plan</h1>
          <p className="text-gray-600">Update your travel adventure details</p>
        </div>
        <TripForm 
          onSubmit={handleSubmit} 
          initialData={initialData}
          isLoading={isLoading}
          submitButtonText="Update Trip Plan"
        />
      </div>
    </div>
  );
}