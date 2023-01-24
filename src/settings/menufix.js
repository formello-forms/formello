/**
 * As we are using hash based navigation, hack fix
 * to highlight the current selected menu
 *
 * Requires jQuery
 */
function menuFix(slug) {
	var $ = jQuery;

	let menuRoot = $('#menu-posts-' + slug);
	let currentUrl = window.location.href;
	let currentHash = window.location.hash.slice(0);
	let newHash = '#/'
	let hashArray = currentHash.split('/');
	if( 'tools' === hashArray[1] || 'addons' === hashArray[1] ){
		newHash += hashArray[1];
	}

	let currentPath = currentUrl.substr( currentUrl.indexOf('edit.php') ).replace( currentHash, newHash );

	menuRoot.on('click', 'a', function() {
		var self = $(this);

		$('ul.wp-submenu li', menuRoot).removeClass('current');

		if ( self.hasClass('wp-has-submenu') ) {
			$('li.wp-first-item', menuRoot).addClass('current');
		} else {
			self.parents('li').addClass('current');
		}
	});

	$('ul.wp-submenu a', menuRoot).each(function(index, el) {
		if ( $(el).attr( 'href' ) === currentPath ) {
			$(el).parent().addClass('current');
			return;
		}
	});
}

export default menuFix;