/**
 * WordPress dependencies
 */
import {
	store,
	getContext,
	getElement,
	getConfig,
} from '@wordpress/interactivity';
import { config as jsConfig } from './config';

const showLoading = ( e ) => {
	const btn = e.submitter || e.target.closest( 'button' );
	btn.classList.toggle( 'wp-block-formello-button--loading' );
	btn.toggleAttribute( 'disabled' );
};

const formSubmit = async ( e ) => {
	const { ref } = getElement();
	const context = getContext();
	const config = getConfig();
	const { id } = ref.dataset;
	const formData = new FormData( ref );
	formData.append( 'action', 'formello' );
	formData.append( '_formello', config.nonce );
	formData.append( '_formello_id', id );

	try {
		showLoading( e );
		const req = await fetch( config.ajax_url, {
			method: 'POST',
			body: formData,
		} );

		const res = await req.json();
		context.response = res;

		showLoading( e );
		response( ref, res );
	} catch ( err ) {
		showLoading( e );
		state.response = { data: { message: err }, success: false };
	}
};

const captchaChallenge = async () => {
	const config = getConfig();
	const context = getContext();
	if (
		context.captchaEnabled &&
		'reCaptcha' === context.captchaType &&
		'3' === config.settings.reCaptcha.version
	) {
		return window.grecaptcha.execute();
	}
	if ( context.captchaEnabled && 'hCaptcha' === context.captchaType ) {
		await window.hcaptcha.execute( { async: true } );
	}
};

const response = ( ref, res ) => {
	const { data } = res;

	// Should we redirect?
	if ( data.redirect_url && res.success ) {
		window.location = data.redirect_url;
		return false;
	}

	// Should we hide form?
	if ( data.hide && res.success ) {
		const msg = ref.querySelector( '.formello-message' );
		ref.insertAdjacentElement( 'beforebegin', msg );
		setTimeout( () => {
			ref.style.display = 'none';
			msg.scrollIntoView( {
				behavior: 'smooth',
			} );
		}, '300' );
	}

	if ( data.debug && res.success ) {
		// eslint-disable-next-line no-console
		const deguagData = ref.querySelector( '.formello-debug' );
		const position = data.hide ? 'beforebegin' : 'afterend';
		ref.insertAdjacentElement( position, deguagData );
		// eslint-disable-next-line no-console
		console.log( data.debug );
	}

	// clear form
	if ( res.success ) {
		ref.reset();
	}
};

const { state } = store( 'formello', {
	state: {
		get debugData() {
			const context = getContext();
			return JSON.stringify( context.response.data.debug, undefined, 2 );
		},
		get message() {
			const context = getContext();
			return context.response?.data?.message || '';
		},
		get errors() {
			const context = getContext();
			return context.response?.data?.errors || [];
		},
	},
	actions: {
		validateCaptcha: ( e ) => {
			const { ref } = getElement();
			const context = getContext();
			e.preventDefault();

			if ( context.enableJsValidation ) {
				const errors = context.validator.validateAll(
					ref.closest( 'form' )
				);
				if ( errors.length ) {
					errors[ 0 ].scrollIntoView( {
						behavior: 'smooth',
						block: 'end',
						inline: 'nearest',
					} );
					return;
				}
			}

			showLoading( e );

			captchaChallenge().then( () => {
				showLoading( e );
				ref.closest( 'form' ).requestSubmit( ref );
			} );
		},
		sendForm: ( e ) => {
			e.preventDefault();
			e.stopPropagation();

			const context = getContext();
			if ( context.enableJsValidation ) {
				const { ref } = getElement();
				const errors = context.validator.validateAll( ref );
				if ( errors.length ) {
					errors[ 0 ].scrollIntoView( {
						behavior: 'smooth',
						block: 'end',
						inline: 'nearest',
					} );
					return;
				}
			}

			formSubmit( e );
		},
		setOutput: () => {
			const { ref } = getElement();
			if ( 'OUTPUT' === ref.nextElementSibling?.nodeName ) {
				ref.nextElementSibling.value = ref.value;
			}
		},
	},
	callbacks: {
		init: () => {
			const context = getContext();

			if ( context.enableJsValidation ) {
				const config = getConfig();
				const { ref } = getElement();
				const { id } = ref.dataset;
				context.validator = new window.Bouncer(
					`.wp-block-formello-form[data-id='${ id }']`,
					{
						...jsConfig.bouncer,
						messages: {
							...jsConfig.bouncer.messages,
							...config.settings.messages,
						},
					}
				);
			}
			window.tinymce?.init( jsConfig.tinyMce );
			window.flatpickr?.( 'input.formello-advanced[type=date]' );
		},
	},
} );
