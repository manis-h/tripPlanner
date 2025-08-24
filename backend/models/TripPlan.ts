import mongoose, { Document, Schema } from 'mongoose';

export interface ITripPlan extends Document {
  title: string;
  destination: string;
  days: number;
  budget: number;
  createdAt: Date;
}

const TripPlanSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
    maxlength: [100, 'Destination cannot exceed 100 characters']
  },
  days: {
    type: Number,
    required: [true, 'Number of days is required'],
    min: [1, 'Days must be at least 1'],
    max: [365, 'Days cannot exceed 365']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ITripPlan>('TripPlan', TripPlanSchema);