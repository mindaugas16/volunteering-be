// tslint:disable-next-line:no-require-imports
import express = require('express');
import graphqlSchema from './graphql/schema';
import * as bodyParser from 'body-parser';
import cors from './middleware/cors';
import isAuth from './middleware/is-auth';
import graphqlHttp from 'express-graphql';
import graphqlResolvers from './graphql/resolvers';
import mongoose from 'mongoose';

const app = express();
// tslint:disable-next-line:no-require-imports
require('dotenv')
    .config();

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now().toString());
//     }
// });
//
// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg'
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

app.use(bodyParser.json());

// app.use(
//     multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
// );
// app.use('/images', express.static(path.join(__dirname, 'images')));
//
app.use(isAuth);
app.use(cors);
//
// app.post('/upload', (req, res, next) => {
//     // @ts-ignore
//     if (!req.isAuth) {
//         const error = new Error('Unauthenticated!') as any;
//         error.status = 401;
//         throw error;
//     }
//
//     // @ts-ignore
//     if (!req.file) {
//         return res.status(200).json({message: 'No file selected'});
//     }
//
//     if (req.body.oldPath) {
//         clearImage(req.body.odlPath);
//     }
//
//     // @ts-ignore
//     return res.status(200).json({message: 'File stored', filePath: req.file.path});
// });
//
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    formatError(error: any): any {
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
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD}@cluster0-eoch3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(() => app.listen(3000))
    .catch(error => {
        throw error;
    });
//
// const clearImage = filePath => {
//     filePath = path.join(__dirname, '..', filePath);
//     fs.unlink(filePath, error => console.log(error));
// };
