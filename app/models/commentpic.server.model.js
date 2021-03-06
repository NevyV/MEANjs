'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Commentpic Schema
 */
var CommentpicSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Commentpic name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Commentpic', CommentpicSchema);