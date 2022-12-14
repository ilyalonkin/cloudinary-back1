import mongoose from "mongoose";

const PostModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    imageUrl: String
}, {
    timestamps: true,
});

export default mongoose.model('post', PostModel);