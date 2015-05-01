'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var commentpics = require('../../app/controllers/commentpics.server.controller');

	// Commentpics Routes
	app.route('/commentpics')
		.get(commentpics.list)
		.post(users.requiresLogin, commentpics.create);

	app.route('/commentpics/:commentpicId')
		.get(commentpics.read)
		.put(users.requiresLogin, commentpics.hasAuthorization, commentpics.update)
		.delete(users.requiresLogin, commentpics.hasAuthorization, commentpics.delete);

	// Finish by binding the Commentpic middleware
	app.param('commentpicId', commentpics.commentpicByID);
};
