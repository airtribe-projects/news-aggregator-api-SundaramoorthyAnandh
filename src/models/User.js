const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    preferences: {
        type: {
            keyword: {
                type: String,
                default: '',
            },
            language: {
                type: [String],
                default: ['eng'],
            },
            articleImage: {
                type: Boolean,
                default: false,
            }
        },
        default: () => ({ keyword: '', language: ['eng'], articleImage: false })
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);