// server/src/models/Settings.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  name: string;
  isRegistrationOpen: boolean;
}

const SettingsSchema: Schema = new Schema({
  // Unique key to easily find the single settings document
  name: { 
    type: String, 
    default: 'mainSettings', 
    unique: true 
  },
  // The flag to control registration status
  isRegistrationOpen: { 
    type: Boolean, 
    default: true 
  },
});

export default mongoose.model<ISettings>('Settings', SettingsSchema);
