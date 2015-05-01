'use strict';

//Setting up route
angular.module('commentpics').config(['$stateProvider',
	function($stateProvider) {
		// Commentpics state routing
		$stateProvider.
		state('listCommentpics', {
			url: '/commentpics',
			templateUrl: 'modules/commentpics/views/list-commentpics.client.view.html'
		}).
		state('createCommentpic', {
			url: '/commentpics/create',
			templateUrl: 'modules/commentpics/views/create-commentpic.client.view.html'
		}).
		state('viewCommentpic', {
			url: '/commentpics/:commentpicId',
			templateUrl: 'modules/commentpics/views/view-commentpic.client.view.html'
		}).
		state('editCommentpic', {
			url: '/commentpics/:commentpicId/edit',
			templateUrl: 'modules/commentpics/views/edit-commentpic.client.view.html'
		});
	}
]);