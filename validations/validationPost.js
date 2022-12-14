import {body} from 'express-validator';

export const validationPost = [
    body('title', 'Введите заголовок статьи').isLength({min: 1}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 1}).isString(),
    body('tags', 'Неверный формат тегов').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];