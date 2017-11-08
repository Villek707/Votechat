(function (window) {
	'use strict';

	/**
	 * Reimplements getElementbyId method
	 *@constructor
	 * 
	 */
	function $() {
		
	}
	
	/**
	 * getElementbyId
	 * 
	 * 
	 */
	$.prototype.id = function (idname) {
		return document.getElementById(idname);
	};
    window.app = window.app || {};
	window.app.$ = $;
})(window); 
