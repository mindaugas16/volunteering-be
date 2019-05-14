// tslint:disable-next-line:no-require-imports
import express = require('express');
import graphqlSchema from './graphql/schema';
import * as bodyParser from 'body-parser';
import cors from './middleware/cors';
import isAuth from './middleware/is-auth';
import graphqlHttp from 'express-graphql';
import graphqlResolvers from './graphql/resolvers';
import mongoose from 'mongoose';
import multer from 'multer';
import * as path from 'path';
import { clearImage } from 'helpers/file';

const app = express();
// tslint:disable-next-line:no-require-imports
require('dotenv')
    .config();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/assets/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()
            .toString() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());

app.use(
    multer({storage: fileStorage, fileFilter})
        .single('image')
);

app.use('/assets/images', express.static(path.join(__dirname, '/assets/images')));

app.use(isAuth);
app.use(cors);

app.post('/upload', (req, res, next) => {
    if (!(req as any).isAuth) {
        const error = new Error('Unauthenticated!') as any;
        error.status = 401;
        throw error;
    }

    if (!req.file) {
        return res.status(200)
            .json({message: 'No file selected'});
    }

    if (req.body.oldPath) {
        clearImage(req.body.odlPath);
    }

    return res.status(200)
        .json({message: 'File stored', fileName: req.file.filename});
});

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(error: any): any {
        if (!error.originalError) {
            return error;
        }
        const data = error.originalError.data;
        const code = error.originalError.code || 500;

        const message = error.message || 'An error occurred.';

        return {message, status: code, data};
    }
}));

mongoose.connect(
    // tslint:disable-next-line:max-line-length
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-eoch3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(() => {
        const server = app.listen(3000, () => {
            // tslint:disable-next-line:no-console
            console.log('Server is running on port', (server.address() as any).port);
        });
    })
    .catch(error => {
        throw error;
    });
