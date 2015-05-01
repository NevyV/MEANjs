'use strict';

//Commentpics service used to communicate Commentpics REST endpoints
angular.module('commentpics').factory('Commentpics', ['$resource',
	function($resource) {
		return $resource('commentpics/:commentpicId', { commentpicId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);