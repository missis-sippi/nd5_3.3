"use strict";

const app = module.exports = require('express')();
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017/testdb';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('./models').User;
const Task = require('./models').Task;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.disable('x-powered-by');

app.route('/users').get(function(req, res, next) {
        mongoose.connection.open(url, function(err) {
            if (err) return next(err);

            User.find({ }, function(err, obj) {
                mongoose.connection.close();
                if (err) return res.sendStatus(400);
                console.log('Найдено: ' + JSON.stringify(obj));
                res.json(obj);
            });
        });
});

app.route('/users/:id').get(function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.sendStatus(400);

        mongoose.connection.open(url, function(err) {
            if (err) return next(err);

            User.findById(mongoose.Types.ObjectId(req.params.id), function(err, obj) {
                mongoose.connection.close();
                
                if (err) return res.sendStatus(400);
                
                if (obj === null) return res.sendStatus(404);
                console.log('Найдено: ' + JSON.stringify(obj));
                res.json(obj);
            });
        });
});
app.route('/users').post(function(req, res, next) {
        let currentUser = req.body;
        let user = new User(currentUser);

        mongoose.connection.open(url, function(err) {
            if (err) return next(err);

            user.save(function(err, obj) {
                mongoose.connection.close();
                if (err) return res.sendStatus(400);
                console.log('Сохранено: ' + JSON.stringify(obj));
                res.json(obj);
            });
        });
});
app.route('/users/:id').put(function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.sendStatus(400);
        let newData = req.body;

        mongoose.connection.open(url, function(err) {
            if (err) return next(err);

            User.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), newData, function(err, obj) {
                mongoose.connection.close();
                if (err) return res.sendStatus(400);
                if (obj === null) return res.sendStatus(404);
                console.log('Обновлено: ' + JSON.stringify(obj));
                res.json(obj);
            });
        });
});

app.route('/users/:id').delete(function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.sendStatus(400);

        mongoose.connection.open(url, function(err) {
            if (err) return next(err);

            Task.find({owner: req.params.id}, function(err, obj) {
                if (err) {
                    mongoose.connection.close();
                    return res.sendStatus(400);
                }
                if (Object.keys(obj).length > 0) {
                    mongoose.connection.close();
                    return res.sendStatus(400);
                }
                User.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id), function(err, obj) {
                    mongoose.connection.close();
                    if (err) return res.sendStatus(400);
                    if (obj === null) return res.sendStatus(404);
                    console.log('Удалено: ' + JSON.stringify(obj));
                    res.json(obj);
                });
            });
        });
});


mongoose.connection.on('open', function() {
    console.log('open');
});

mongoose.connection.on('error', function(err) {
    console.log('Ошибка соединения: ' + err);
});

mongoose.connection.on('connecting', function() {
    console.log('connecting');
});

mongoose.connection.on('connected', function() {
    console.log('connected');
});

mongoose.connection.on('disconnecting', function() {
    console.log('disconnecting');
});

mongoose.connection.on('disconnected', function() {
    console.log('disconnected');
});

mongoose.connection.on('reconnected', function() {
    console.log('reconnected');
});

mongoose.connection.on('close', function() {
    console.log('close');
});

mongoose.connection.on('fullsetup', function() {
    console.log('fullsetup');
});

mongoose.connection.on('all', function() {
    console.log('all');
});