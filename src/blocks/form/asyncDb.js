import apiFetch from '@wordpress/api-fetch';
import { subscribe, select } from '@wordpress/data';

let wasSavingPost = select( 'core/editor' ).isSavingPost();
let wasAutosavingPost = select( 'core/editor' ).isAutosavingPost();
let wasPreviewingPost = select( 'core/editor' ).isPreviewingPost();

let actions = []
const hasAction = ( innerBlocks ) => {
	innerBlocks.forEach( (a) => {
		if( 'formello/actions' === a.name ){
			getActions( a.innerBlocks )
		}
	} )
}

const getActions = ( innerBlocks ) => {
	actions = []
	innerBlocks.forEach( (i) => {
		actions.push( i.attributes.settings )
	} )
}

// determine whether to show notice
subscribe( () => {
	const isSavingPost = select( 'core/editor' ).isSavingPost();
	const isAutosavingPost = select( 'core/editor' ).isAutosavingPost();
	const isPreviewingPost = select( 'core/editor' ).isPreviewingPost();
	const hasActiveMetaBoxes = select( 'core/edit-post' ).hasMetaBoxes();
	
	// Save metaboxes on save completion, except for autosaves that are not a post preview.
	const shouldTriggerAjax = (
			( wasSavingPost && ! isSavingPost && ! wasAutosavingPost ) ||
			( wasAutosavingPost && wasPreviewingPost && ! isPreviewingPost )
		);

	// Save current state for next inspection.
	wasSavingPost = isSavingPost;
	wasAutosavingPost = isAutosavingPost;
	wasPreviewingPost = isPreviewingPost;

	if ( shouldTriggerAjax ) {
		let blocks = []
		let root = select( 'core/block-editor' ).getBlocks()
		let descendants = select( 'core/block-editor' ).getClientIdsWithDescendants( root[0] )

		descendants.forEach( (b) => {
			let block = select( 'core/block-editor' ).getBlock( b )
			if( 'formello/form' === block.name ){
				if( undefined === block.attributes.id ){
					return
				}
				let c = hasAction( block.innerBlocks ) 
				apiFetch( {
					path: '/formello/v1/form/' + block.attributes.id,
					method: 'PUT',
					data: {
						name: block.attributes.name,
						settings: {
							storeSubmissions: block.attributes.storeSubmissions,
							recaptchaEnabled: block.attributes.recaptchaEnabled,
							hide: block.attributes.hide,
							constraints: block.attributes.constraints,
							fields: block.attributes.fields,
							actions: actions,
						},
					},
				} ).then( ( result ) => {
					console.log(result);
				} );
			}
		} )
	}

} );