import CommentModel from "../models/CommentModel.js";
import PostModel from "../models/PostModel.js";

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = new CommentModel({
            post: postId,
            author: req.userId,
            text: req.body.text,
        });

        const comment = await doc.save();

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { commentsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью'
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    });
                }
            })

        res.send(comment);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось опубликовать комментарий'
        })
    }
};

export const getLastComments = async (req, res) => {
    try {
        const comments = await CommentModel.find().populate('author').exec();
        const commentsLast = comments.reverse().slice(0,5);

        res.json(commentsLast);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось получить комментарии'
        })
    }

};

export const getPostId = async (req, res) => {
    const word = req.body.search;
    const comment = await CommentModel.find({ _id: word });
    const postId = comment[0].post;
    res.send(postId)
};

export const getPostComments = async (req, res) => {
    try {
        const comments = await CommentModel.find({ post: req.params.id }).populate('author');
        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось получить комментарии'
        })
    }
};

export const removeComment = async (req, res) => {
    const commentId = await req.params.id;
    
    const comment = await CommentModel.find({ _id: commentId })
    const postId = comment[0].post;
    PostModel.findOneAndUpdate(
        {
            _id: postId,
        },
        {
            $inc: { commentsCount: -1 },
        },
        {
            returnDocument: 'after',
        },
        (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось вернуть статью'
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                });
            }
        })
        await CommentModel.findOneAndDelete({ _id: commentId })
};