import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 16,
            unique: true,
            match: /^[a-zA-Z0-9_]+$/,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            match: /^(.+)@([^\.].*)\.([a-z]{2,})$/i,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        profileImage: {
            contentType: {
                type: String,
                default: "",
            },
            data: {
                type: Buffer,
                default: null,
            },
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false
    },
)

const User = mongoose.model("User", userSchema);

export default User;
