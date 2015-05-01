'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Commentpic = mongoose.model('Commentpic'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, commentpic;

/**
 * Commentpic routes tests
 */
describe('Commentpic CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Commentpic
		user.save(function() {
			commentpic = {
				name: 'Commentpic Name'
			};

			done();
		});
	});

	it('should be able to save Commentpic instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Commentpic
				agent.post('/commentpics')
					.send(commentpic)
					.expect(200)
					.end(function(commentpicSaveErr, commentpicSaveRes) {
						// Handle Commentpic save error
						if (commentpicSaveErr) done(commentpicSaveErr);

						// Get a list of Commentpics
						agent.get('/commentpics')
							.end(function(commentpicsGetErr, commentpicsGetRes) {
								// Handle Commentpic save error
								if (commentpicsGetErr) done(commentpicsGetErr);

								// Get Commentpics list
								var commentpics = commentpicsGetRes.body;

								// Set assertions
								(commentpics[0].user._id).should.equal(userId);
								(commentpics[0].name).should.match('Commentpic Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Commentpic instance if not logged in', function(done) {
		agent.post('/commentpics')
			.send(commentpic)
			.expect(401)
			.end(function(commentpicSaveErr, commentpicSaveRes) {
				// Call the assertion callback
				done(commentpicSaveErr);
			});
	});

	it('should not be able to save Commentpic instance if no name is provided', function(done) {
		// Invalidate name field
		commentpic.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Commentpic
				agent.post('/commentpics')
					.send(commentpic)
					.expect(400)
					.end(function(commentpicSaveErr, commentpicSaveRes) {
						// Set message assertion
						(commentpicSaveRes.body.message).should.match('Please fill Commentpic name');
						
						// Handle Commentpic save error
						done(commentpicSaveErr);
					});
			});
	});

	it('should be able to update Commentpic instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Commentpic
				agent.post('/commentpics')
					.send(commentpic)
					.expect(200)
					.end(function(commentpicSaveErr, commentpicSaveRes) {
						// Handle Commentpic save error
						if (commentpicSaveErr) done(commentpicSaveErr);

						// Update Commentpic name
						commentpic.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Commentpic
						agent.put('/commentpics/' + commentpicSaveRes.body._id)
							.send(commentpic)
							.expect(200)
							.end(function(commentpicUpdateErr, commentpicUpdateRes) {
								// Handle Commentpic update error
								if (commentpicUpdateErr) done(commentpicUpdateErr);

								// Set assertions
								(commentpicUpdateRes.body._id).should.equal(commentpicSaveRes.body._id);
								(commentpicUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Commentpics if not signed in', function(done) {
		// Create new Commentpic model instance
		var commentpicObj = new Commentpic(commentpic);

		// Save the Commentpic
		commentpicObj.save(function() {
			// Request Commentpics
			request(app).get('/commentpics')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Commentpic if not signed in', function(done) {
		// Create new Commentpic model instance
		var commentpicObj = new Commentpic(commentpic);

		// Save the Commentpic
		commentpicObj.save(function() {
			request(app).get('/commentpics/' + commentpicObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', commentpic.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Commentpic instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Commentpic
				agent.post('/commentpics')
					.send(commentpic)
					.expect(200)
					.end(function(commentpicSaveErr, commentpicSaveRes) {
						// Handle Commentpic save error
						if (commentpicSaveErr) done(commentpicSaveErr);

						// Delete existing Commentpic
						agent.delete('/commentpics/' + commentpicSaveRes.body._id)
							.send(commentpic)
							.expect(200)
							.end(function(commentpicDeleteErr, commentpicDeleteRes) {
								// Handle Commentpic error error
								if (commentpicDeleteErr) done(commentpicDeleteErr);

								// Set assertions
								(commentpicDeleteRes.body._id).should.equal(commentpicSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Commentpic instance if not signed in', function(done) {
		// Set Commentpic user 
		commentpic.user = user;

		// Create new Commentpic model instance
		var commentpicObj = new Commentpic(commentpic);

		// Save the Commentpic
		commentpicObj.save(function() {
			// Try deleting Commentpic
			request(app).delete('/commentpics/' + commentpicObj._id)
			.expect(401)
			.end(function(commentpicDeleteErr, commentpicDeleteRes) {
				// Set message assertion
				(commentpicDeleteRes.body.message).should.match('User is not logged in');

				// Handle Commentpic error error
				done(commentpicDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Commentpic.remove().exec();
		done();
	});
});