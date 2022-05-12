import events from './events.js';

class Formello {
	constructor( element ) {
		this.element = element;

		//this.element.addEventListener( 'submit', this.handleSubmit.bind(this), true )

		this.element.addEventListener(
			'bouncerFormValid',
			this.handleSubmit.bind( this ),
			true
		);

		this.init();
	}

	init() {
		this.reCaptcha();
		this.isRtfEnabled();
		this.addFlatpickr();
	}

	handleSubmit( e ) {
		// always prevent default (because regular submit doesn't work for Formello)
		e.preventDefault();
		e.stopPropagation();

		// Validate the field
		/*var bouncer = new Bouncer();
		var errors = bouncer.validateAll( this.element );

		if( errors.length ){
			errors[0].scrollIntoView({behaviour: "smooth", block: "end", inline: "nearest"});
			return
		}*/

		if ( this.enableRecaptcha ) {
			this.reCaptchaToken();
			return;
		}

		this.submitForm();
	}

	submitForm( token ) {
		this.showLoading();
		this.cleanMessage();
		this.emitEvent( 'submit' );

		const formData = new FormData( this.element );

		if ( token ) {
			formData.append( 'g-recaptcha-response', token );
		}

		let request = new XMLHttpRequest();
		request.onreadystatechange = this.createRequestHandler( this.element );
		request.open( 'POST', formello.ajax_url, true );
		request.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
		request.send( formData );
		request = null;
	}

	emitEvent( eventName ) {
		// browser event API: formElement.on('formello-success', ..)
		window.dispatchEvent( new CustomEvent( 'formello-' + eventName ) );

		// custom events API: formello.on('success', ..)
		events.trigger( eventName, [ this.element ] );
	}

	createRequestHandler( formEl ) {
		const parent = this;

		return function() {
			// are we done?
			if ( this.readyState === 4 ) {
				parent.showLoading();
				let response;
				if ( this.status >= 200 && this.status < 400 ) {
					try {
						response = JSON.parse( this.responseText );
					} catch ( error ) {
						console.log(
							'Formello: failed to parse AJAX response.\n\nError: "' +
								error +
								'"'
						);
						return;
					}

					parent.emitEvent( 'submitted', this.element );

					if ( response.errors.length ) {
						parent.emitEvent( 'error', this.element );
					} else {
						parent.emitEvent( 'success', this.element );
					}

					// Show form message
					if ( response.message ) {
						parent.addMessage(
							response.message,
							response.errors,
							response.hide_form
						);
						parent.emitEvent( 'message', this.element );
					}

					// Should we hide form?
					if ( response.hide_form ) {
						parent.element.style.display = 'none';
					}

					if ( response.debug ) {
						parent.addDebug( response.debug );
						console.log( response.debug );
					}

					// Should we redirect?
					if ( response.redirect_url ) {
						window.location = response.redirect_url;
					}

					// clear form
					if ( ! response.message.errors ) {
						parent.element.reset();
					}
				} else {
					// Server error :(
					console.log( response );
				}
			}
		};
	}

	reCaptcha() {
		const { recaptcha } = this.element.dataset;
		if ( ! JSON.parse( recaptcha ) ) {
			return;
		}

		let recaptchaUrl = 'https://www.google.com/recaptcha/api.js';

		const sitekey = formello.settings.reCaptcha?.site_key;
		const version = formello.settings.reCaptcha?.version;
		const buttons = this.element.getElementsByTagName( 'button' );

		if ( '1' === version ) {
			const recaptchaDiv = document.createElement( 'div' );
			recaptchaDiv.classList.add( 'g-recaptcha' );
			recaptchaDiv.setAttribute( 'data-sitekey', sitekey );

			this.element.insertBefore( recaptchaDiv, buttons[ 0 ] );
		} else {
			recaptchaUrl += '?render=' + sitekey;
			const recaptchaInput = document.createElement( 'input' );
			recaptchaInput.type = 'hidden';
			recaptchaInput.name = 'g-recaptcha-response';
			recaptchaInput.classList.add( 'formello-g-recaptcha' );
			this.element.appendChild( recaptchaInput );
		}
		if ( sitekey && version ) {
			this.enableRecaptcha = true;
			const script = document.createElement( 'script' );
			script.src = recaptchaUrl;

			document.head.appendChild( script );
		}
	}

	reCaptchaToken() {
		grecaptcha.ready( () => {
			grecaptcha
				.execute( formello.settings.reCaptcha.site_key, {
					action: 'submit',
				} )
				.then( ( token ) => {
					this.element.querySelector( '.formello-g-recaptcha' ).value =
						token;
					this.submitForm();
				} );
		} );
	}

	addMessage( message, errors, hide ) {
		const msg = this.element.querySelector( '.formello-message' );
		msg.classList.add( message.type );
		msg.innerHTML = '<p>' + message.text + '</p>';

		if ( errors.length ) {
			const ul = document.createElement( 'ul' );

			msg.appendChild( ul );

			errors.forEach( function( item ) {
				const li = document.createElement( 'li' );
				ul.appendChild( li );
				li.innerHTML += item;
			} );
		}

		if ( hide ) {
			this.element.insertAdjacentElement( 'afterend', msg );
		}
	}

	addDebug( debug ) {
		const msg = this.element.querySelector( '.formello-message' );

		const debugDiv = document.createElement( 'div' );
		debugDiv.classList.add( 'formello-debug' );
		debugDiv.innerHTML = '<p>Debug output:</p>';
		debugDiv.innerHTML +=
			'<pre>' + JSON.stringify( debug, undefined, 2 ) + '</pre>';

		msg.insertAdjacentElement( 'afterend', debugDiv );
	}

	cleanMessage() {
		const msg = this.element.querySelector( '.formello-message' );
		msg.innerHTML = '';
		msg.setAttribute( 'class', 'formello-message' );
		if ( msg.nextSibling ) {
			if ( 'formello-debug' === msg.nextSibling.className ) {
				msg.nextSibling.remove();
			}
		}
	}

	showLoading() {
		const btn = this.element.querySelector( '.wp-block-formello-button' );
		btn.classList.toggle( 'wp-block-formello-button--loading' );
		btn.toggleAttribute( 'disabled' );
	}

	isRtfEnabled() {
		const richtext = this.element.querySelectorAll( '.formello-rtf' );
		if ( richtext.length ) {
			const script = document.createElement( 'script' );

			script.onload = function() {
				tinymce.init( {
					selector: '.formello-rtf',
					menubar: false,
					plugins: [
						'advlist autolink lists link image charmap print preview anchor',
						'searchreplace visualblocks code fullscreen',
						'insertdatetime media table paste code help wordcount',
					],
					toolbar:
						'formatselect | ' +
						'bold italic underline | bullist numlist  | ' +
						'alignleft aligncenter alignright alignjustify | link unlink | undo redo',
					content_style:
						'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
				} );
			};
			script.src =
				'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.3/tinymce.min.js';

			document.head.appendChild( script ); //or something of the likes
		}
	}

	addFlatpickr() {
		const advancedDate = this.element.querySelectorAll( '.flatpickr' );
		if ( advancedDate.length ) {
			const script = document.createElement( 'script' );
			const css = document.createElement( 'link' );
			css.setAttribute( 'type', 'text/css' );
			css.setAttribute(
				'href',
				'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css'
			);
			css.setAttribute( 'rel', 'stylesheet' );

			script.onload = function() {
				//do stuff with the script
				flatpickr( '.flatpickr' );
			};
			script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';

			document.head.appendChild( script ); //or something of the likes
			document.head.appendChild( css ); //or something of the likes
		}
	}
}

export { Formello };
