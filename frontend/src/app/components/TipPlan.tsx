// frontend/app/components/TripCard.tsx
'use client';

import { TripPlan } from "../types/trips";

interface TripCardProps {
  trip: TripPlan;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-blue-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-blue-800">{trip.title}</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          {trip.days} day{trip.days !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600 font-medium mb-1">Destination</p>
          <p className="font-semibold text-blue-900">{trip.destination}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600 font-medium mb-1">Budget</p>
          <p className="font-semibold text-green-900">₹{trip.budget.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex items-center text-gray-500 text-sm mb-5">
        <div className="flex items-center mr-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
          <span>Created {new Date(trip.createdAt).toLocaleDateString()}</span>
        </div>
        {/* {trip.updatedAt && trip.updatedAt !== trip.createdAt && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span>Updated {new Date(trip.updatedAt).toLocaleDateString()}</span>
          </div>
        )} */}
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={() => onEdit(trip._id)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
        >
          Edit Trip
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(trip._id)}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors duration-300 font-semibold"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}