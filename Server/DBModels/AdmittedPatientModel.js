


import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const admittedPatientSchema = new Schema({
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    roomType: { type: String, enum: ['General Ward', 'Special Ward'], required: true },
    admissionDate: { type: Date, required: true },
    dischargeDate: { type: Date },
    status: { type: String, enum: ['admitted', 'discharged'], default: 'admitted' }
});

admittedPatientSchema.pre('save', function(next) {
    // Update hospital bed availability
    const Hospital = model('Hospital');
    Hospital.findById(this.hospital, (err, hospital) => {
        if (err) return next(err);

        if (this.roomType === 'General Ward') {
            hospital.currentBeds.generalWard -= 1;
        } else if (this.roomType === 'Special Ward') {
            hospital.currentBeds.specialWard -= 1;
        }
        
        hospital.save((err) => {
            if (err) return next(err);
            next();
        });
    });
});

admittedPatientSchema.pre('remove', function(next) {
    // Update hospital bed availability on discharge
    const Hospital = model('Hospital');
    Hospital.findById(this.hospital, (err, hospital) => {
        if (err) return next(err);

        if (this.roomType === 'General Ward') {
            hospital.currentBeds.generalWard += 1;
        } else if (this.roomType === 'Special Ward') {
            hospital.currentBeds.specialWard += 1;
        }

        hospital.save((err) => {
            if (err) return next(err);
            next();
        });
    });
});

const AdmittedPatient = model('AdmittedPatient', admittedPatientSchema);
export default AdmittedPatient;




