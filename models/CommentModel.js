import mongoose from "mongoose";

const CommentModel = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
});

export default mongoose.model('comment', CommentModel);