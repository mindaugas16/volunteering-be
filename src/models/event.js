"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var eventSchema = new mongoose_1.Schema({
    status: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    date: {
        type: mongoose_1.Schema.Types.Mixed
    },
    location: {
        type: mongoose_1.Schema.Types.Mixed
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    activities: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Activity'
        }
    ],
    tags: [
        {
            type: mongoose_1.Schema.Types.Mixed
        }
    ],
    customFields: [
        {
            type: mongoose_1.Schema.Types.Mixed
        }
    ],
    imagePath: {
        type: String
    }
}, { timestamps: true });
exports["default"] = mongoose_1.model('Event', eventSchema);
