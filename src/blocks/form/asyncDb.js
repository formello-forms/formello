import apiFetch from '@wordpress/api-fetch';
const { subscribe, select } = wp.data;

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
		console.log('ssssssss', i)
		actions.push( i.attributes.settings )
	} )
	console.log(actions)
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
		let blocks = select( 'core/editor' ).getBlocks()
		blocks.forEach( (b) => {
			if( 'formello/form' === b.name ){
				if( undefined === b.attributes.id ){
					return
				}
				let c = hasAction( b.innerBlocks ) 
				apiFetch( {
					path: '/formello/v1/form/' + b.attributes.id,
					method: 'PUT',
					data: {
						name: b.attributes.name,
						settings: {
							storeSubmissions: b.attributes.storeSubmissions,
							recaptchaEnabled: b.attributes.recaptchaEnabled,
							hide: b.attributes.hide,
							constraints: b.attributes.constraints,
							fields: b.attributes.fields,
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