const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new  Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },  
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        minLength: 4
    }
})

module.exports = mongoose.model('customers', customerSchema)

