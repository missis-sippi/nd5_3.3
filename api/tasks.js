"use strict";

const app = module.exports = require('express')();
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017/testdb';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Task = require('./models').Task;
const User = require('./models').User;

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.route('/tasks').get(function(req, res, next) {
        let params = req.query;

        mongoose.connection.open(url, function(err) {
            if (err) return next(err);

            Task.find(params, function(err, obj) {
                mongoose.connection.close();
                if (err) return res.sendStatus(400);
                console.log('Найдено: ' + JSON.stringify(obj));
                res.json(obj);
            });
        });
});

app.route('/tasks/:id').get(function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.sendStatus(400);

        mongoose.connection.open(url, function(err) {
            if (err) return next(err);

            Task.findById(mongoose.Types.ObjectId(req.params.id), function(err, obj) {
                mongoose.connection.close();
                if (err) return res.sendStatus(400);
                if (obj === null) return res.sendStatus(404);
                console.log('Найдено: ' + JSON.stringify(obj));
                res.json(obj);
            })
            .populate('owner');
        });
});

app.route('/tasks').post(function(req, res, next) {
        let ownerId = req.body.owner;
        if (!mongoose.Types.ObjectId.isValid(ownerId)) return res.sendStatus(400);

        let currentTask = req.body;
        let task = new Task(currentTask);

        mongoose.connection.open(url, function(err) {
            if (err) return next(err);

            User.count({_id: ownerId}, function(err, count) {
                if (err) {
                    mongoose.connection.close();
                    return res.sendStatus(400);
                }
                if (count < 1) {
                    mongoose.connection.close();
                    return res.sendStatus(404);
                }
                task.save(function(err, obj) {
                    mongoose.connection.close();
                    if (err) {
                        console.log(err);
                        return res.sendStatus(400);
                    }
                    console.log('Сохранено: ' + JSON.stringify(obj));
                    res.json(obj);
                });
            });
        });
});

app.route('/tasks/:id').put(function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.sendStatus(400);
        let newData = req.body;
        if (newData.owner) {
            if (!mongoose.Types.ObjectId.isValid(newData.owner)) return res.sendStatus(400);
        }

        mongoose.connection.open(url, err => {
            if (err) return next(err);

            if (newData.owner) {
                User.count({_id: newData.owner}, (err, count) => {
                    if (err) {
                        mongoose.connection.close();
                        return res.sendStatus(400);
                    }
                    if (count < 1) {
                        mongoose.connection.close();
                        return res.sendStatus(404);
                    }
                    Task.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), newData, (err, obj) => {
                        mongoose.connection.close();
                        if (err) return res.sendStatus(400);
                        if (obj === null) return res.sendStatus(404);
                        console.log('Обновлено: ' + JSON.stringify(obj));
                        res.json(obj);
                    });
                });
            } else {
                Task.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), newData, (err, obj) => {
                    mongoose.connection.close();
                    if (err) return res.sendStatus(400);
                    if (obj === null) return res.sendStatus(404);
                    console.log('Обновлено: ' + JSON.stringify(obj));
                    res.json(obj);
                });
            }
        });
    })
app.route('/tasks/:id').delete(function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.sendStatus(400);
        mongoose.connection.open(url, function(err) {
            if (err) return next(err);

            Task.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), function(err, obj) {
                mongoose.connection.close();
                if (err) return res.sendStatus(400);
                if (obj === null) return res.sendStatus(404);
                console.log('Удалено: ' + JSON.stringify(obj));
                res.json(obj);
            });
        });
    });