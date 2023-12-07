import { Formello } from './form';

document.addEventListener( 'DOMContentLoaded', function () {
	const forms = document.querySelectorAll( '.wp-block-formello-form' );

	if ( ! forms.length ) {
		return;
	}

	forms.forEach( ( block ) => {
		new Formello( block );
	} );
} );
