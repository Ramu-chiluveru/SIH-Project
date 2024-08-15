

import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const hospitalSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contactInformation: {
        phone: { type: String },
        email: { type: String }
    },
    totalBeds: { type: Number, required: true },
    currentBeds: {
        generalWard: { type: Number, required: true },
        specialWard: { type: Number, required: true }
    },
    queueSize: { type: Number, default: 0 },
    services: [String],
    numberOfDoctors: { type: Number, default: 0 },
    doctorSpecializations: [String],
    staffCount: { type: Number, default: 0 },
    operatingHours: {
        start: { type: String },
        end: { type: String }
    },
    hospitalRating: { type: Number, min: 0, max: 5 },
    emergencyServices: { type: Boolean, default: false },
    feeStructure: {
        consultationFee: { type: Number },
        roomCharges: {
            generalWard: { type: Number },
            specialWard: { type: Number }
        }
    },
    governmentSchemes: [String],
    insuranceProviders: [String]
});

const Hospital = model('Hospital', hospitalSchema);
export default Hospital;


