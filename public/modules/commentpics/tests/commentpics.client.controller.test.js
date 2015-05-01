'use strict';

(function() {
	// Commentpics Controller Spec
	describe('Commentpics Controller Tests', function() {
		// Initialize global variables
		var CommentpicsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Commentpics controller.
			CommentpicsController = $controller('CommentpicsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Commentpic object fetched from XHR', inject(function(Commentpics) {
			// Create sample Commentpic using the Commentpics service
			var sampleCommentpic = new Commentpics({
				name: 'New Commentpic'
			});

			// Create a sample Commentpics array that includes the new Commentpic
			var sampleCommentpics = [sampleCommentpic];

			// Set GET response
			$httpBackend.expectGET('commentpics').respond(sampleCommentpics);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.commentpics).toEqualData(sampleCommentpics);
		}));

		it('$scope.findOne() should create an array with one Commentpic object fetched from XHR using a commentpicId URL parameter', inject(function(Commentpics) {
			// Define a sample Commentpic object
			var sampleCommentpic = new Commentpics({
				name: 'New Commentpic'
			});

			// Set the URL parameter
			$stateParams.commentpicId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/commentpics\/([0-9a-fA-F]{24})$/).respond(sampleCommentpic);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.commentpic).toEqualData(sampleCommentpic);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Commentpics) {
			// Create a sample Commentpic object
			var sampleCommentpicPostData = new Commentpics({
				name: 'New Commentpic'
			});

			// Create a sample Commentpic response
			var sampleCommentpicResponse = new Commentpics({
				_id: '525cf20451979dea2c000001',
				name: 'New Commentpic'
			});

			// Fixture mock form input values
			scope.name = 'New Commentpic';

			// Set POST response
			$httpBackend.expectPOST('commentpics', sampleCommentpicPostData).respond(sampleCommentpicResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Commentpic was created
			expect($location.path()).toBe('/commentpics/' + sampleCommentpicResponse._id);
		}));

		it('$scope.update() should update a valid Commentpic', inject(function(Commentpics) {
			// Define a sample Commentpic put data
			var sampleCommentpicPutData = new Commentpics({
				_id: '525cf20451979dea2c000001',
				name: 'New Commentpic'
			});

			// Mock Commentpic in scope
			scope.commentpic = sampleCommentpicPutData;

			// Set PUT response
			$httpBackend.expectPUT(/commentpics\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/commentpics/' + sampleCommentpicPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid commentpicId and remove the Commentpic from the scope', inject(function(Commentpics) {
			// Create new Commentpic object
			var sampleCommentpic = new Commentpics({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Commentpics array and include the Commentpic
			scope.commentpics = [sampleCommentpic];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/commentpics\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCommentpic);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.commentpics.length).toBe(0);
		}));
	});
}());