// server/src/models/Registration.ts

import mongoose, { Schema, Document } from 'mongoose';

// Interface to define the structure of a registration document
export interface IRegistration extends Document {
  fullName: string;
  nim: string;
  binusianEmail: string;
  privateEmail: string;
  major: string;
  phoneNumber: string;
  registrationDate: Date;
}

// Mongoose schema for the registration data
const RegistrationSchema: Schema = new Schema({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'] 
  },
  nim: { 
    type: String, 
    required: [true, 'NIM is required'], 
    unique: true,
    trim: true
  },
  binusianEmail: { 
    type: String, 
    required: [true, 'Binusian email is required'], 
    unique: true,
    trim: true,
    match: [/.+@binus\.ac\.id$/, 'Please fill a valid Binusian email']
  },
  privateEmail: { 
    type: String, 
    required: [true, 'Private email is required'],
    trim: true
  },
  major: { 
    type: String, 
    required: [true, 'Major is required'] 
  },
  phoneNumber: { 
    type: String, 
    required: [true, 'Phone number is required'] 
  },
  registrationDate: { 
    type: Date, 
    default: Date.now 
  },
});

// Create and export the Mongoose model
export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
