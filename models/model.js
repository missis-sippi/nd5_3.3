"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: { type: String, required: true },
});

const taskSchema = Schema({
    name: { type:String, required: true },
    description: { type: String, required: true },
    opened: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = {
  User,
  Task
};