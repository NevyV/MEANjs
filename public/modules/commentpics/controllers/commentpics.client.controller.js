'use strict';

// Commentpics controller
angular.module('commentpics').controller('CommentpicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Socket', 'Commentpics',
	function($scope, $stateParams, $location, Authentication, Socket, Commentpics) {
		$scope.authentication = Authentication;

		// Create new Commentpic
		$scope.create = function() {
			// Create new Commentpic object
			var commentpic = new Commentpics ({
				name: this.name
			});

			// Redirect after save
			commentpic.$save(function(response) {
				$location.path('commentpics/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Commentpic
		$scope.remove = function(commentpic) {
			if ( commentpic ) { 
				commentpic.$remove();

				for (var i in $scope.commentpics) {
					if ($scope.commentpics [i] === commentpic) {
						$scope.commentpics.splice(i, 1);
					}
				}
			} else {
				$scope.commentpic.$remove(function() {
					$location.path('commentpics');
				});
			}
		};

		// Update existing Commentpic
		$scope.update = function() {
			var commentpic = $scope.commentpic;

			commentpic.$update(function() {
				$location.path('commentpics/' + commentpic._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Commentpics
		$scope.find = function() {
			$scope.commentpics = Commentpics.query();
		};

		// Find existing Commentpic
		$scope.findOne = function() {
			$scope.commentpic = Commentpics.get({ 
				commentpicId: $stateParams.commentpicId
			});
		};
	}
]);