const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    // OAuth Provider IDs
    googleId: {
      type: String,
      default: null,
    },
    githubId: {
      type: String,
      default: null,
    },

    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },

    // Provider info
    provider: {
      type: String,
      enum: ['google', 'github'],
      required: true,
    },
    githubUsername: {
      type: String,
      default: null,
    },

    // Timestamps
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Virtual: Full profile URL for GitHub users
UserSchema.virtual('githubProfileUrl').get(function () {
  return this.githubUsername
    ? `https://github.com/${this.githubUsername}`
    : null;
});

module.exports = mongoose.model('User', UserSchema);
