import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Basic email validation regex
    },

    password: {
        type: String,
        required: true,
        minlength: 7 // Minimum password length
    },
}, {
    timestamps: true // createdAt and updatedAt fields
});

const user = mongoose.model('User', userSchema);

export default user;