const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    // Other fields if needed...
});

module.exports = mongoose.model('Role', RoleSchema);
