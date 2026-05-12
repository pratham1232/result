const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  regId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  teamLeaderName: {
    type: String,
    required: true,
    trim: true
  },
  themeName: {
    type: String,
    required: true,
    trim: true
  },
  problemStatementName: {
    type: String,
    required: true,
    trim: true
  },
  result: {
    type: String,
    required: true,
    enum: ['Selected', 'Rejected', 'Pending', 'Shortlisted'],
    default: 'Pending'
  }
}, {
  timestamps: true
});


// Text index for search
resultSchema.index({ teamName: 'text', regId: 'text' });

module.exports = mongoose.model('Result', resultSchema);
