

import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const inventorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    reorderLevel: { type: Number, required: true },
    category: { type: String, enum: ['medicine', 'medical equipment', 'consumable', 'other'], required: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    expiryDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

inventorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Inventory = model('Inventory', inventorySchema);
export default Inventory;
