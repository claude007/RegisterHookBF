const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new  Schema({
    name: {
        type: String,
        required: true
    },
      email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        minLength: 4,
        required: true
    }, 
    date : {
        type: Date, 
        default: Date.now
    }
})

module.exports = User =  mongoose.model('user', UserSchema)

