const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            enum: ['admin', 'client', 'engineer'],
            default: 'client'
        },
        company: {
            type: String,
            default: ''
        },
        site:{
            type: String,
            enum: ['kenya', 'tanzania', 'uganda', 'rwanda', null],
            default: null
        },
        phone: {
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

//MIDDLEWARE -> to hash the password so plain text is never saved
userSchema.pre('save', async function (){
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//Method -> attach a custom function to every user document -> here to compare passwords with stored hash during login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);