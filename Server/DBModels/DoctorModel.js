

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    availability: { type: String, enum: ['Available', 'In surgery', 'Off-duty'], default: 'Available' },
    consultationHours: {
        start: { type: String },
        end: { type: String }
    },
    contactInformation: {
        phone: { type: String },
        email: { type: String }
    },
    consultationFee: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;





