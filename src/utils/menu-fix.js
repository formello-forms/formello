/**
 * As we are using hash based navigation, hack fix
 * to highlight the current selected menu
 *
 * Requires jQuery
 *
 * @param slug
 */
function menuFix( slug ) {
	const $ = window.jQuery;

	const menuRoot = $( '#toplevel_page_' + slug );
	const currentUrl = window.location.href;
	const currentPath = currentUrl.substr( currentUrl.indexOf( 'admin.php' ) );

	window.addEventListener( 'popstate', () => {
		const urlParams = new URLSearchParams( window.location.search );

		const page = urlParams.get( 'page' );
		if ( page ) {
			menuRoot.find( 'li[class*="current"]' ).removeClass( 'current' );
			menuRoot
				.find( 'a[href="admin.php?page=' + page + '"]' )
				.parent()
				.addClass( 'current' );
		}
	} );

	menuRoot.on( 'click', 'a', function ( e ) {
		e.preventDefault();
		const self = $( this );

		window.dispatchEvent(
			new CustomEvent( 'changePage', { detail: e.target.href } )
		);

		$( 'ul.wp-submenu li', menuRoot ).removeClass( 'current' );

		if ( self.hasClass( 'wp-has-submenu' ) ) {
			$( 'li.wp-first-item', menuRoot ).addClass( 'current' );
		} else {
			self.parents( 'li' ).addClass( 'current' );
		}
	} );

	$( 'ul.wp-submenu a', menuRoot ).each( function ( index, el ) {
		if ( $( el ).attr( 'href' ) === currentPath ) {
			$( el ).parent().addClass( 'current' );
		}
	} );
}

export default menuFix;
