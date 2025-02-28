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
	const context = getContext();
	const { settings } = getConfig();

	context.error = '';

	if (
		'tel' === ref.type &&
		ref.classList.contains( 'formello-advanced' ) &&
		! window.intlTelInput.getInstance( ref ).isValidNumber() &&
		ref.value
	) {
		window.intlTelInput.getInstance( ref ).getValidationError();

		ref.setCustomValidity( 'Please match the number format.' );
		context.error = ref.validationMessage;
	} else if (
		'tel' === ref.type &&
		ref.classList.contains( 'formello-advanced' )
	) {
		const num = window.intlTelInput?.getInstance( ref ).getNumber();
		document
			.querySelector( 'input[name="' + ref.name + '_full"]' )
			.setAttribute( 'value', num );
		ref.setCustomValidity( '' );
	} else {
		ref.setCustomValidity( '' );
	}

	if (
		'checkbox' === ref.type &&
		ref.getAttribute( 'name' ).includes( '[]' )
	) {
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
	}

	if ( ref.validity.rangeOverflow && 'time' === ref.type ) {
		context.error = settings.messages.outOfRange.over.replace(
			'{max}',
			ref.getAttribute( 'max' ).replace( '{max}', ref.value.max )
		);
	}

	if ( ref.validity.rangeUnderflow && 'time' === ref.type ) {
		context.error = settings.messages.outOfRange.under.replace(
			'{min}',
			ref.getAttribute( 'min' ).replace( '{min}', ref.value.min )
		);
	}

	if ( ref.validity.tooShort ) {
		context.error = settings.messages.wrongLength.under.replace(
			'{minLength}',
			ref
				.getAttribute( 'minlength' )
				.replace( '{length}', ref.value.length )
		);
	}

	if ( ref.validity.tooLong ) {
		context.error = settings.messages.wrongLength.over.replace(
			'{maxLength}',
			ref
				.getAttribute( 'maxlength' )
				.replace( '{length}', ref.value.length )
		);
	}

	if ( ref.validity.typeMismatch || ref.validity.badInput ) {
		context.error = settings.messages.patternMismatch[ ref.type ];
	}

	if ( ref.validity.patternMismatch ) {
		context.error =
			settings.messages.patternMismatch[ ref.type ] ??
			ref.getAttribute( 'data-bouncer-message' ) ??
			settings.messages.patternMismatch.default;
	}

	if ( ref.validity.valueMissing ) {
		context.error = settings.messages.missingValue.hasOwnProperty(
			ref.type
		)
			? settings.messages.missingValue[ ref.type ]
			: settings.messages.missingValue.default;
	}
};

const formSubmit = async () => {
	const { ref } = getElement();
	const context = getContext();
	const config = getConfig();
	const { id } = ref.dataset;
	const formData = new FormData( ref );
	formData.append( 'action', 'formello' );
	formData.append( '_formello', config.nonce );
	formData.append( '_formello_id', id );

	try {
		context.isLoading = true;
		const req = await fetch( config.ajax_url, {
			method: 'POST',
			body: formData,
		} );

		const res = await req.json();
		context.response = res;

		context.isLoading = false;

		response( ref, res, state );
	} catch ( err ) {
		context.isLoading = false;
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

const response = ( ref, res, state ) => {
	const { data } = res;

	// Should we redirect?
	if ( data.redirect_url && res.success ) {
		window.location = data.redirect_url;
		return false;
	}

	// Should we hide form?
	if ( data.hide && res.success ) {
		const msg = ref.querySelector( '.wp-block-formello-message' );
		ref.insertAdjacentElement( 'beforebegin', msg );
		setTimeout( () => {
			ref.style.display = 'none';
			msg.scrollIntoView( {
				behavior: 'smooth',
			} );
		}, '300' );
	}

	if ( data.debug ) {
		// eslint-disable-next-line no-console
		console.info( data.debug );
		state.debugData = JSON.stringify( res.data.debug, undefined, 2 );
	}

	// clear form
	if ( res.success ) {
		ref.reset();
	}
};

const { state } = store( 'formello', {
	state: {
		get message() {
			const context = getContext();
			if ( context.response?.data?.errors ) {
				return context.response?.data?.message;
			}
			return context.response && context.successMessage.length
				? context.successMessage
				: context.response?.data?.message;
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

			const context = getContext();
			context.isLoading = true;
			captchaChallenge().then( () => {
				ref.closest( 'form' ).requestSubmit( ref );
			} );
		},
		sendForm: ( e ) => {
			e.preventDefault();
			e.stopPropagation();

			const { ref } = getElement();
			const context = getContext();

			if ( context.enableJsValidation ) {
				const isFormValid = ref.checkValidity();

				if ( ! isFormValid ) {
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

					return;
				}
			}
			context.isLoading = true;

			formSubmit( e );
		},
		setOutput: () => {
			const { ref } = getElement();
			if ( 'OUTPUT' === ref.nextElementSibling?.nodeName ) {
				ref.nextElementSibling.value = ref.value;
			}
		},
		validateInput: () => {
			const context = getContext();
			if ( context.enableJsValidation ) {
				toggleInputError();
			}
		},
	},
	callbacks: {
		showDebug: () => {
			const { ref } = getElement();
			if ( state.debugData ) {
				window.renderjson.set_show_to_level( 2 );
				ref.innerHTML = '';
				ref.appendChild(
					window.renderjson( JSON.parse( state.debugData ) )
				);
			}
		},
		init: () => {
			const context = getContext();

			const config = getConfig();

			context.messages = {
				...jsConfig.bouncer.messages,
				...config.settings.messages,
			};

			window.tinymce?.init( jsConfig.tinyMce );

			document
				.querySelectorAll( 'input.formello-advanced[type=text]' )
				.forEach( ( el ) => {
					const { flatpickr } = el.dataset;
					window.flatpickr?.( el, JSON.parse( flatpickr ) );
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
						initialCountry: 'auto',
						geoIpLookup: ( callback ) => {
							fetch( 'https://ipapi.co/json' )
								.then( ( res ) => res.json() )
								.then( ( data ) =>
									callback( data.country_code )
								)
								.catch( () => callback( 'us' ) );
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
