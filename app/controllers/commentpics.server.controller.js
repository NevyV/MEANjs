'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Commentpic = mongoose.model('Commentpic'),
	_ = require('lodash');

/**
 * Create a Commentpic
 */
exports.create = function(req, res) {
	var commentpic = new Commentpic(req.body);
	commentpic.user = req.user;

	commentpic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(commentpic);
		}
	});
};

/**
 * Show the current Commentpic
 */
exports.read = function(req, res) {
	res.jsonp(req.commentpic);
};

/**
 * Update a Commentpic
 */
exports.update = function(req, res) {
	var commentpic = req.commentpic ;

	commentpic = _.extend(commentpic , req.body);

	commentpic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(commentpic);
		}
	});
};

/**
 * Delete an Commentpic
 */
exports.delete = function(req, res) {
	var commentpic = req.commentpic ;

	commentpic.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(commentpic);
		}
	});
};

/**
 * List of Commentpics
 */
exports.list = function(req, res) { 
	Commentpic.find().sort('-created').populate('user', 'displayName').exec(function(err, commentpics) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(commentpics);
		}
	});
};

/**
 * Commentpic middleware
 */
exports.commentpicByID = function(req, res, next, id) { 
	Commentpic.findById(id).populate('user', 'displayName').exec(function(err, commentpic) {
		if (err) return next(err);
		if (! commentpic) return next(new Error('Failed to load Commentpic ' + id));
		req.commentpic = commentpic ;
		next();
	});
};

/**
 * Commentpic authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.commentpic.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
