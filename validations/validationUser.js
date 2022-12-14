import {body} from 'express-validator';

export const validationRegister = [
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен состоять минимум из 8 символов').isLength({min: 8}),
    body('avatarURL', 'Неверная ссылка на аватарку').optional().isString(),
];

export const validationLogin = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен состоять минимум из 8 символов').isLength({min: 8}),
];

