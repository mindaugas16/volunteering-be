"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var user_1 = require("./user");
var organizationSchema = new mongoose_1.Schema({
    organizationName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    location: {
        type: mongoose_1.Schema.Types.Mixed
    },
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Volunteer'
        }
    ],
    events: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
    organizationLogo: String,
    organizationWebsite: String
});
exports["default"] = user_1["default"].discriminator('Organization', organizationSchema);
