import * as path from 'path';
import * as fs from 'fs';

export const clearImage = fileName => {
    const filePath = path.join(__dirname, '..', 'assets', 'images', fileName);
    fs.unlink(filePath, error => {
        // tslint:disable-next-line:no-console
        console.log(error);
    });
};
