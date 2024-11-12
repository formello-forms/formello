import { decodeEntities } from '@wordpress/html-entities';

export function getItemTitle( item ) {
	if ( typeof item.title === 'string' ) {
		return decodeEntities( item.title );
	}
	if ( 'rendered' in item.title ) {
		return decodeEntities( item.title.rendered );
	}
	if ( 'raw' in item.title ) {
		return decodeEntities( item.title.raw );
	}
	return '';
}
