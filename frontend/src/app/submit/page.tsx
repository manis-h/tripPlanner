// frontend/app/submit/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TripForm from '../components/TripForm';
import { TripFormData } from '../types/trips';

export default function SubmitTripPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: TripFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Next Adventure</h1>
          <p className="text-gray-600">Create a new trip plan with all the details</p>
        </div>
        <TripForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          submitButtonText="Create Trip Plan"
        />
      </div>
    </div>
  );
}