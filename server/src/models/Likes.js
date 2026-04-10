import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: null,
        },
    },

    {
        _id: true,
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Like", likeSchema);