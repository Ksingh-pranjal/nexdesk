/*Notes are comments engineers add to tickets.*/
const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema(
    {
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Note', noteSchema);