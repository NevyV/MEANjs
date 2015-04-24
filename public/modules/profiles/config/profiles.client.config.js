'use strict';

// Configuring the Articles module
angular.module('profiles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Profile', 'profiles', '/profiles(/create)?');
	}
]);