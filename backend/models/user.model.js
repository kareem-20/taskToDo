const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: {
        type: String
    },
    email: {
        require: true,
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        require: true,
        type: String,
    }
});

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        // console.log(this.password, hashedPassword)
        next();
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}



const USER = mongoose.model('user', userSchema)
module.exports = USER