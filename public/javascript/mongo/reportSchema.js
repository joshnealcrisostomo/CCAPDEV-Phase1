const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  // polymorphic relationship
  reportedItemId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  reportedItemType: {
    type: String,
    enum: ['Post', 'Comment'],
    required: true
  },
  // author object
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  // Timestamps for when the report was created and last updated
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure unique reports per item, reporter combination
ReportSchema.index({ reportedItemId: 1, reportedItemType: 1, reporter: 1 }, { unique: true });

module.exports = mongoose.model('Report', ReportSchema);