

import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const appointmentSchema = new Schema({
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    roomType: { type: String, enum: ['General Ward', 'Special Ward'], required: true },
    status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
    consultationStatus: { type: String, enum: ['pending', 'consulted'], default: 'pending' },
    admissionStatus: { type: String, enum: ['not admitted', 'admitted'], default: 'not admitted' },
    notes: { type: String }
});

appointmentSchema.pre('save', function(next) {
    if (this.status === 'completed' && this.admissionStatus === 'admitted') {
        this.consultationStatus = 'consulted';
    }
    next();
});

const Appointment = model('Appointment', appointmentSchema);
export default Appointment;


