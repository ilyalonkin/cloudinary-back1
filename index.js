import express from "express";
import mongoose from "mongoose";

import { validationRegister, validationLogin } from "./validations/validationUser.js";
import { validationPost } from "./validations/validationPost.js";
import { validationComment } from "./validations/validationComment.js";

import { getMe, login, register, updateAvatar } from "./controllers/UserController.js";
import { create, getAll, getOne, remove, update } from "./controllers/PostController.js"
import { getLastTags } from "./controllers/PostController.js";

import checkAuth from "./utils/checkAuth.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import cors from "cors";

import { getLastComments } from "./controllers/CommentController.js";
import { createComment } from "./controllers/CommentController.js";
import { getPostComments } from "./controllers/CommentController.js";
import { removeComment } from "./controllers/CommentController.js";
import { getPostId } from "./controllers/CommentController.js";
import { getTagPosts } from "./controllers/PostController.js";
import { getPopularPosts } from "./controllers/PostController.js"

import cloudinary from "cloudinary";

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Database OK')
    })
    .catch((err) => {
        console.log('Ошибка подключения к БД', err)
    });

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors());

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Ошибка сервера', err);
    }
    console.log('Server OK');
});

app.post('/auth/register', validationRegister, handleValidationErrors, register);
app.patch('/auth/update', updateAvatar)
app.post('/auth/login', validationLogin, handleValidationErrors, login);
app.get('/auth/me', checkAuth, getMe);

cloudinary.config({
    cloud_name: 'de4dqhc5m',
    api_key: '862925537884856',
    api_secret: '96vWMExykFOx38sFU-5uNRSfT3Y'
})

app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'ml_default'
        });
        console.log(uploadedResponse.url);
        res.json({
            url: `${uploadedResponse.url}`,
        })
    } catch (error) {
        console.error(error)
    }
});

app.get('/tags', getLastTags);

app.get('/comments', getLastComments);
app.get('/comments/:id', getPostComments);
app.post('/comments/:id', checkAuth, validationComment, handleValidationErrors, createComment);
app.delete('/comments/:id', checkAuth, removeComment);
app.post('/comments', getPostId);

app.get('/posts', getAll);
app.get('/posts/popular', getPopularPosts)
app.post('/posts/tags', getTagPosts);
app.get('/posts/:id', getOne);
app.post('/posts/', checkAuth, validationPost, handleValidationErrors, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, validationPost, handleValidationErrors, update);




