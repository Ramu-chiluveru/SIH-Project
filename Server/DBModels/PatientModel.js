

import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

// Helper functions
function calculateAverage(values) {
    if (values.length === 0) return 0;
    const total = values.reduce((sum, value) => sum + value, 0);
    return total / values.length;
}

function getMostRecentValue(values) {
    return values.length > 0 ? values[values.length - 1] : null;
}

const patientSchema = new Schema({
    basicInformation: {
        name: { type: String, required: true },
        address: { type: String },
        contactDetails: {
            phone: { type: String },
            email: { type: String }
        },
        emergencyContact: {
            name: { type: String },
            relationship: { type: String },
            phone: { type: String }
        },
        aadharNumber: { type: String, unique: true, required: true },
        insuranceDetails: { type: String },
        governmentSchemes: [String],
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }
    },
    healthMetrics: {
        height: { type: Number, required: true }, // in cm
        weight: { type: Number, required: true }, // in kg
        BMI: { type: Number },
        bodyFatPercentage: { type: Number },
        bloodPressure: [{
            systolic: { type: Number },
            diastolic: { type: Number },
            date: { type: Date }
        }],
        bloodGroup: { type: String },
        allergies: { type: String }
    },
    bodyMeasurements: {
        waist: [{ value: Number, date: { type: Date } }], // in cm
        hip: [{ value: Number, date: { type: Date } }], // in cm
        neck: [{ value: Number, date: { type: Date } }] // in cm
    },
    bodyMetricsHistory: {
        spO2: [{
            value: Number,
            date: { type: Date }
        }],
        heartRate: [{
            value: Number,
            date: { type: Date }
        }],
        bodyTemperature: [{
            value: Number, // in Celsius
            date: { type: Date }
        }]
    },
    medicalHistory: {
        previousSurgeries: [String],
        medicalConditions: [String],
        medications: [String],
        previousValues: {
            height: [{ value: Number, date: { type: Date } }],
            weight: [{ value: Number, date: { type: Date } }],
            BMI: [{ value: Number, date: { type: Date } }],
            bloodPressure: [{
                systolic: { type: Number },
                diastolic: { type: Number },
                date: { type: Date }
            }],
            bloodGlucose: [{ value: Number, date: { type: Date } }],
            SpO2: [{ value: Number, date: { type: Date } }],
            eyesight: [{ value: String, date: { type: Date } }],
            restingHeartRate: [{ value: Number, date: { type: Date } }]
        },
        bills: [{
            hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },
            amount: { type: Number },
            date: { type: Date }
        }],
        MRI: { type: String }, // Path to PDF
        bloodReports: {
            values: { type: Map, of: Number },
            date: { type: Date }
        },
        previousConsultations: [{
            hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },
            doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
            date: { type: Date }
        }]
    }
});

patientSchema.pre('save', function(next) {
    // Calculate BMI
    const heightM = this.healthMetrics.height / 100;
    this.healthMetrics.BMI = this.healthMetrics.weight / (heightM * heightM);
    
    // Calculate Body Fat Percentage
    const { waist, hip, neck } = this.bodyMeasurements;
    const heightCm = this.healthMetrics.height;
    const isMale = this.basicInformation.gender === 'Male';

    if (isMale) {
        this.healthMetrics.bodyFatPercentage = 86.010 * Math.log10(getMostRecentValue(waist).value - getMostRecentValue(neck).value) - 70.041 * Math.log10(heightCm) + 36.76;
    } else {
        this.healthMetrics.bodyFatPercentage = 163.205 * Math.log10(getMostRecentValue(waist).value + getMostRecentValue(hip).value - getMostRecentValue(neck).value) - 97.684 * Math.log10(heightCm) - 78.387;
    }

    next();
});

// Instance methods
patientSchema.methods.getAverageSpO2 = function() {
    return calculateAverage(this.bodyMetricsHistory.spO2.map(entry => entry.value));
};

patientSchema.methods.getAverageHeartRate = function() {
    return calculateAverage(this.bodyMetricsHistory.heartRate.map(entry => entry.value));
};

patientSchema.methods.getAverageBodyTemperature = function() {
    return calculateAverage(this.bodyMetricsHistory.bodyTemperature.map(entry => entry.value));
};

patientSchema.methods.getMostRecentSpO2 = function() {
    return getMostRecentValue(this.bodyMetricsHistory.spO2);
};

patientSchema.methods.getMostRecentHeartRate = function() {
    return getMostRecentValue(this.bodyMetricsHistory.heartRate);
};

patientSchema.methods.getMostRecentBodyTemperature = function() {
    return getMostRecentValue(this.bodyMetricsHistory.bodyTemperature);
};

patientSchema.methods.getMostRecentBMI = function() {
    return getMostRecentValue(this.medicalHistory.previousValues.BMI);
};

patientSchema.methods.getMostRecentBodyFatPercentage = function() {
    return getMostRecentValue(this.medicalHistory.previousValues.bodyFatPercentage);
};

const Patient = model('Patient', patientSchema);
export default Patient;



