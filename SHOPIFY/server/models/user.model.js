const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        UID:{ type: String, required: true },
        firstName:{ type: String, required: true },
        lastName:{ type: String, required: true },
        middleName:{ type: String, required: false },
        email:{ type: String, required: true },
        password:{ type: String, required: true },
    },
    {collection: "user"}
);

module.exports = mongoose.model("User", User);