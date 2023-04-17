function menuFix( slug ) {
	const $ = jQuery;

	const menuRoot = $( '#menu-posts-' + slug );
	const currentUrl = window.location.href;
	const currentHash = window.location.hash.slice( 0 );
	let newHash = '#/';
	const hashArray = currentHash.split( '/' );
	if ( 'tools' === hashArray[ 1 ] || 'addons' === hashArray[ 1 ] ) {
		newHash += hashArray[ 1 ];
	}

	const currentPath = currentUrl.substr( currentUrl.indexOf( 'edit.php' ) ).replace( currentHash, newHash );

	menuRoot.on( 'click', 'a', function() {
		const self = $( this );

		$( 'ul.wp-submenu li', menuRoot ).removeClass( 'current' );

		if ( self.hasClass( 'wp-has-submenu' ) ) {
			$( 'li.wp-first-item', menuRoot ).addClass( 'current' );
		} else {
			self.parents( 'li' ).addClass( 'current' );
		}
	} );

	$( 'ul.wp-submenu a', menuRoot ).each( function( index, el ) {
		if ( $( el ).attr( 'href' ) === currentPath ) {
			$( el ).parent().addClass( 'current' );
		}
	} );
}

export default menuFix;
