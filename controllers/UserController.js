import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs';

export const register = async (req, res) => {
    try {

        const passwordIn = req.body.password;
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(passwordIn, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hash,
            avatarURL: req.body.avatarURL,
        })

        const user = await doc.save();

        const {password, ...userData} = user._doc;

        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '1h'
            });

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
};

export const updateAvatar = async (req, res) => {
    try {

        const userId = req.body.id;
        await UserModel.findOneAndUpdate({_id: userId}, {
            avatarURL: req.body.avatar,
        });

        res.json({
            success: 'Аватар был обновлен'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось обновить аватар'
        })
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const isValidPassword = bcryptjs.compare(req.body.password, user._doc.password);
        if (!isValidPassword) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '1h'
            });

        const {password, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
};

export const getMe = async (req, res) => {
    const user = await UserModel.findById(req.userId);

    if (!user) {
        return res.status(404).json({
            message: 'Пользователь не найден'
        })
    }

    const {password, ...userData} = user._doc;

    res.send(userData);
};