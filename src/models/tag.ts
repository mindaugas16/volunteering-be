import { model, Schema } from 'mongoose';

const tagSchema = new Schema({
    label: {
        type: String,
        required: true
    }
});

export default model('Tag', tagSchema);
