import { Document, Schema, model } from 'mongoose';

export interface IGame extends Document {
  title: string;
  description: string;
  genre: string;
  platform: string;
  releaseYear: number;
  developer: string;
  publisher: string;
  rating: number;
  imageUrl?: string;
  completed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  platform: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  developer: { type: String, required: true },
  publisher: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
  imageUrl: { type: String },
  completed: { type: Boolean, default: false },
  notes: { type: String }
}, {
  timestamps: true
});

export default model<IGame>('Game', GameSchema);