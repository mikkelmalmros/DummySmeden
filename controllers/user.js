const User = require('../models/user')
const bcrypt = require('bcrypt')

//create
exports.createUser = async function (username, password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = User({
        username: username,
        password: hashedPassword
    })
    return await user.save();
}

exports.getUsersByName = async function(name) {
    const user = await User.findOne().where('username').equals(name).exec()
    return user
}

exports.getUsers = async function() {
    const users = await User.find().exec()
    return users
}