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
	const btn = e.submitter;
	btn.classList.toggle( 'wp-block-formello-button--loading' );
	btn.toggleAttribute( 'disabled' );
};

const captchaChallenge = async () => {
	const config = getConfig();
	const context = getContext();
	if (
		context.captchaEnabled &&
		'reCaptcha' === context.captchaType &&
		'3' === config.settings.reCaptcha.version
	) {
		await window.grecaptcha.execute();
	}
	if ( context.captchaEnabled && 'hCaptcha' === context.captchaType ) {
		await window.hcaptcha.execute();
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
		sendForm: async ( e ) => {
			e.preventDefault();
			e.stopPropagation();

			const { ref } = getElement();
			const { id } = ref.dataset;
			const formData = new FormData( ref );
			formData.append( 'action', 'formello' );
			formData.append( '_formello_id', id );

			const context = getContext();

			if ( context.enableJsValidation ) {
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

			if ( context.captchaEnabled ) {
				captchaChallenge();
			}

			showLoading( e );

			try {
				const config = getConfig();
				const req = await fetch( config.ajax_url, {
					method: 'POST',
					body: formData,
				} );

				const res = await req.json();
				context.response = res;

				response( ref, res );
				showLoading( e );
			} catch ( err ) {
				showLoading( e );
				state.response = { data: { message: err }, success: false };
			}
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

			if ( context.captchaEnabled ) {
				captchaChallenge();
			}

			if ( context.enableJsValidation ) {
				const config = getConfig();
				const { ref } = getElement();
				const { id } = ref.dataset;
				context.validator = new window.Bouncer(
					`.wp-block-formello-library[data-id='${ id }']`,
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
