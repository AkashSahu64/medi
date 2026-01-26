import mongoose from 'mongoose';

const backupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['complete', 'incremental', 'manual', 'auto'],
    default: 'manual'
  },
  size: {
    type: Number,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  collections: {
    type: [String],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true
});

backupSchema.index({ createdAt: -1 });
backupSchema.index({ type: 1, createdAt: -1 });

const Backup = mongoose.model('Backup', backupSchema);
export default Backup;