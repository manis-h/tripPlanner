// frontend/app/types/trip.ts
export interface TripPlan {
  _id: string;
  title: string;
  destination: string;
  days: number;
  budget: number;
  createdAt: string;
}

export interface TripFormData {
  title: string;
  destination: string;
  days: number;
  budget: number;
}

export interface TripsResponse {
  trips: TripPlan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}