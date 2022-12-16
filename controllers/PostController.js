import PostModel from "../models/PostModel.js";

export const create = async (req, res) => {
    try {

        const tagsIn = req.body.tags;
        const tagsNormilize = await tagsIn.map(item => item.trim())

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: tagsNormilize,
            imageUrl: req.body.imageUrl,
            author: req.userId,
        })

        const post = await doc.save();
        res.json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось создать статью'
        })
    }
};

export const getAll = async (req, res) => {
    try {
       
        const posts = await PostModel.find().populate('author').exec();
        const postNew = posts.reverse();
        const postMap = postNew.map(post => post)
        res.json(postMap);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось получить статьи'
        })
    }
};

export const getPopularPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').exec();
        const postsSort = posts.sort((a, b) => b.viewsCount - a.viewsCount );
        res.json(postsSort);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось получить статьи'
        })
    }
};

export const getTagPosts = async (req, res) => {

    const word = req.body.name;
    const wordNoSpace = word.trim();
    const posts = await PostModel.find({ tags: wordNoSpace }).populate('author')
    res.send(posts);
};


export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
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

                res.json(doc);
            }
        ).populate('author');

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось получить статьи'
        })
    }
};

export const remove = async (req, res) => {
    try {

        const postId = await req.params.id;

        await PostModel.findOneAndDelete({
            _id: postId,

        }, (err, doc) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось удалить статью'
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                });
            }

            res.json({
                success: 'Статья была удалена'
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось удалить статью'
        })
    }
};

export const update = async (req, res) => {
    try {

        const postId = req.params.id;
        await PostModel.findOneAndUpdate({ _id: postId }, {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            author: req.userId,
        }
        );

        res.json({
            success: 'Статья была обновлена'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось обновить статью'
        })
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().exec();
        const tags = posts.map(obj => obj.tags).flat().reverse();
        res.send(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Не удалось получить теги' })
    };
};