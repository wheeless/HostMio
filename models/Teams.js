const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    default: 'Staff',
    enum: [
      'Staff',
      'DSO',
      'SWD',
      'MDO',
      'CSO',
      'UAT',
      'QA',
      'PM',
      'DEV',
      'HR',
      'ADMIN',
      'SUPERADMIN',
      'TEST',
    ],
  },
  member: [
    {
      email: String,
      name: String,
      teamId: String,
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Team', TeamSchema);
