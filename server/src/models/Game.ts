import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  title: string;
  description: string;
  platform: string;
  genre: string;
  releaseYear: number;
  developer: string;
  publisher: string;
  rating: number;
  imageUrl?: string;
  completed: boolean;
  progress: number;
  notes?: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  developer: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  imageUrl: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  notes: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IGame>('Game', GameSchema);