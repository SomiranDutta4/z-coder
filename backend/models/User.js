const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true, sparse: true }, // for Google-auth users
  bio: { type: String, default: 'No current bio' },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Practise' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
