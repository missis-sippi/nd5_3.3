"use strict";

const express = require('express');
const port = process.env.port || 3000;

const app = express();
app.disable('x-powered-by');

const apiUsers = require('api/users');
const apiTasks = require('api/tasks');

app.use('/api', apiUsers);

app.use('/api', apiTasks);

app.use(function(err, req, res, next) {
    console.log(err);
		if (!res.headersSent) {
			res.sendStatus(500);
		}
});

app.all('*', function(req, res) {
	res.sendStatus(404)
});

app.listen(port, function() {
	console.log(`Listening on ${port}`);
});