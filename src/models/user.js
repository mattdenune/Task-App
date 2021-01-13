const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    }, 
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length <= 6) {
                throw new Error('Your password must be longer that six characters')
            } else if (value.toLowerCase().includes('password')) {
                throw new Error('Your password cannot contian "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


// Helper function to generate token for user logging in
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismysecret');

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token;
}


// Helper function to find a user by login credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('Unable to login')
    }
    console.log('-User:', user)
    console.log('-Password:', password) 
    console.log('-Hash Password:', user.password)
   
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
// second argument must be a standard function due to this binding
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User