const mongoose = require('mongoose');
const generateApiKey = require('generate-api-key');
const crypto = require('crypto');

const AuthSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  createdAt: { type: String, default: Date.now },
  APIKey: String,
  referral_code: {
    type: String,
    default: function () {
      let hash = 0;
      for (let i = 0; i < this.email.length; i++) {
        hash = this.email.charCodeAt(i) + ((hash << 5) - hash);
      }
      let res = (hash & 0x00ffffff).toString(16).toUpperCase();
      return '00000'.substring(0, 6 - res.length) + res;
    },
  },
  referred_by: {
    type: String,
    required: false,
    default: null,
  },
  avatar: {
    type: String,
    default: function (size) {
      if (!size) {
        size = 200;
      }
      if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
      }
      const md5 = crypto.createHash('md5').update(this.email).digest('hex');
      return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
    },
    //default: '/img/profilePics/blank-profile.png',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

AuthSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

module.exports = mongoose.model('Auth', AuthSchema);
