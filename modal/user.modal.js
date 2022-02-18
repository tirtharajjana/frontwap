const mongo = require("mongoose");
const { Schema } = mongo;

const userSchema = new Schema({
    uid: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password field is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongo.model("User", userSchema);
