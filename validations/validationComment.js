import { body } from 'express-validator';

export const validationComment = [
    body('text').isLength({ min: 3 }).isString(),
];
