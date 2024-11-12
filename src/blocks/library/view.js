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

const toggleInputError = () => {
	const { ref } = getElement();
	let error = ref.parentNode.querySelector( '.error-message' );
	if ( ! error ) {
		const checked = ref
			.closest( '.wp-block-formello-multichoices' )
			.querySelector( 'input[type=checkbox]:checked' );

		const unchecked = ref
			.closest( '.wp-block-formello-multichoices' )
			.querySelectorAll( 'input[type=checkbox]:not(:checked)' );

		if ( checked ) {
			unchecked.forEach( ( c ) => {
				c.required = false;
			} );
		} else {
			ref.closest( '.wp-block-formello-multichoices' )
				.querySelectorAll( 'input[type=checkbox]' )
				.forEach( ( c ) => {
					c.required = true;
				} );
		}

		error = ref
			.closest( '.wp-block-formello-multichoices' )
			.querySelector( '.error-message' );
	}
	error.innerHTML = 'dasd asdasd';
};

const showLoading = ( e, force ) => {
	const btn = e.submitter || e.target.closest( 'button' );
	btn.classList.toggle( 'wp-block-formello-button--loading', force );
	btn.toggleAttribute( 'disabled', force );
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
		showLoading( e, true );
		const req = await fetch( config.ajax_url, {
			method: 'POST',
			body: formData,
		} );

		const res = await req.json();
		context.response = res;

		showLoading( e, false );

		response( ref, res );
	} catch ( err ) {
		showLoading( e, false );
		if ( typeof err === 'string' || err instanceof String ) {
			context.response = { data: { message: err }, success: false };
		} else {
			context.response = {
				data: { message: 'An error occurred' },
				success: false,
			};
		}
	}
};

const captchaChallenge = async () => {
	const config = getConfig();
	const context = getContext();
	if (
		context.captchaEnabled &&
		'reCaptcha' === context.captchaType &&
		'invisible' === config.settings.reCaptcha.version
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
			e.preventDefault();

			const isFormValid = ref.closest( 'form' ).checkValidity();

			if ( ! isFormValid ) {
				ref.closest( 'form' ).requestSubmit( ref );
				return false;
			}

			showLoading( e );
			captchaChallenge().then( () => {
				ref.closest( 'form' ).requestSubmit( ref );
			} );
		},
		sendForm: ( e ) => {
			e.preventDefault();
			e.stopPropagation();

			const { ref } = getElement();

			const isFormValid = ref.checkValidity();

			if ( isFormValid ) {
				formSubmit( e );
			}

			// Set the focus to the first invalid input.
			const firstInvalidInputEl = ref.querySelector(
				'input:invalid, select:invalid'
			);
			firstInvalidInputEl?.scrollIntoView( {
				behavior: 'smooth',
				block: 'end',
				inline: 'nearest',
			} );
			firstInvalidInputEl?.focus();
		},
		setOutput: () => {
			const { ref } = getElement();
			if ( 'OUTPUT' === ref.nextElementSibling?.nodeName ) {
				ref.nextElementSibling.value = ref.value;
			}
		},
		validateInput: () => {
			toggleInputError();
		},
	},
	callbacks: {
		init: () => {
			const context = getContext();

			const config = getConfig();
			context.messages = {
				...jsConfig.bouncer.messages,
				...config.settings.messages,
			};

			window.tinymce?.init( jsConfig.tinyMce );
			window.flatpickr?.( 'input.formello-advanced[type=date]' );

			document
				.querySelectorAll(
					'.wp-block-formello-input, .wp-block-formello-select, .wp-block-formello-textarea, .wp-block-formello-multichoices'
				)
				.forEach( ( el ) => {
					// don't add error div to multichoices inputs
					if (
						el.parentNode.classList.contains(
							'wp-block-formello-multichoices'
						)
					) {
						return;
					}
					const error = document.createElement( 'div' );
					error.classList.add( 'error-message' );
					el.appendChild( error );
				} );
			document
				.querySelectorAll( 'input[type="tel"].formello-advanced' )
				.forEach( ( el ) => {
					window.intlTelInput?.( el, {
						loadUtilsOnInit:
							'https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/utils.js',
						hiddenInput( telInputName ) {
							return {
								phone: telInputName + '_full',
								country: telInputName + '_country_code',
							};
						},
					} );
				} );
			document
				.querySelectorAll( 'select.formello-advanced' )
				.forEach( ( el ) => {
					new window.TomSelect( el, {
						create: true,
						sortField: {
							field: 'text',
							direction: 'asc',
						},
					} );
				} );
		},
	},
} );
