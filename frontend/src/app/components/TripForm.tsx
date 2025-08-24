'use client';

import { useState } from 'react';
import { TripFormData } from '../types/trips';

interface TripFormProps {
  onSubmit: (data: TripFormData) => Promise<void>;
  initialData?: TripFormData;
  isLoading?: boolean;
  submitButtonText?: string;
}

export default function TripForm({
  onSubmit,
  initialData,
  isLoading = false,
  submitButtonText = 'Create Trip'
}: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>(
    initialData || { title: '', destination: '', days: 1, budget: 0 }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof TripFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'title' || name === 'destination' ? value : Number(value)
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof TripFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TripFormData, string>> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (formData.days < 1) newErrors.days = 'Must be at least 1 day';
    if (formData.days > 365) newErrors.days = 'Cannot exceed 365 days';
    if (formData.budget < 0) newErrors.budget = 'Budget cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-700">Plan Your Trip</h2>
        <p className="text-green-600 mt-2 font-medium">Fill in the details to create your perfect itinerary</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-blue-800">
            Trip Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-gray-800 placeholder-gray-500 ${
              errors.title ? 'border-red-400 bg-red-50' : 'border-blue-100'
            }`}
            placeholder="e.g., Summer Vacation"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600 font-medium">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="destination" className="block text-sm font-semibold text-blue-800">
            Destination *
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-gray-800 placeholder-gray-500 ${
              errors.destination ? 'border-red-400 bg-red-50' : 'border-blue-100'
            }`}
            placeholder="e.g., Paris, France"
          />
          {errors.destination && <p className="mt-1 text-sm text-red-600 font-medium">{errors.destination}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="days" className="block text-sm font-semibold text-blue-800">
              Number of Days *
            </label>
            <input
              type="number"
              id="days"
              name="days"
              value={formData.days}
              onChange={handleChange}
              min="1"
              max="365"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-gray-800 ${
                errors.days ? 'border-red-400 bg-red-50' : 'border-blue-100'
              }`}
            />
            {errors.days && <p className="mt-1 text-sm text-red-600 font-medium">{errors.days}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-semibold text-blue-800">
              Budget (INR) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-blue-700 font-bold">₹</span>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-gray-800 ${
                  errors.budget ? 'border-red-400 bg-red-50' : 'border-blue-100'
                }`}
              />
            </div>
            {errors.budget && <p className="mt-1 text-sm text-red-600 font-medium">{errors.budget}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-bold text-lg"
        >
          {isLoading ? 'Processing...' : submitButtonText}
        </button>
      </form>
    </div>
  );
}