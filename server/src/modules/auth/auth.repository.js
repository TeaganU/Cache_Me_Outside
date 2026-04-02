import User from "../../models/User.js";

export async function findUserByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
}

export async function findUserByUsername(username) {
    return User.findOne({ username });
}

export async function createUser(userData) {
    const user = new User(userData);
    return user.save();
}