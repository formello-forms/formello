import Bouncer from 'formbouncerjs'
import events from './events.js'

class Formello {
	constructor(element) {
		this.element = element;

		//this.element.addEventListener( 'submit', this.handleSubmit.bind(this), true )

		this.element.addEventListener( 'bouncerFormValid', this.handleSubmit.bind(this), true );

		this.init();
	}

	init() {
		this.reCaptcha()
	}

	handleSubmit(e){
		// always prevent default (because regular submit doesn't work for Formello)
		e.preventDefault()
		e.stopPropagation()

		// Validate the field
		/*var bouncer = new Bouncer();
		var errors = bouncer.validateAll( this.element );

		if( errors.length ){
			errors[0].scrollIntoView({behaviour: "smooth", block: "end", inline: "nearest"});
			return
		}*/

		if( this.enableRecaptcha ){
			this.reCaptchaToken()
			return
		}

		this.submitForm()
	}

	submitForm(token) {

		this.showLoading()
		this.cleanMessage()
		this.emitEvent( 'submit' )

		const formData = new FormData( this.element );

		if( token ){
			formData.append( 'g-recaptcha-response', token )
		}

		let request = new XMLHttpRequest()
		request.onreadystatechange = this.createRequestHandler( this.element )
		request.open( 'POST', formello.ajax_url, true )
		request.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' )
		request.send( formData )
		request = null

	}

	emitEvent ( eventName ) {
		// browser event API: formElement.on('formello-success', ..)
		window.dispatchEvent( new CustomEvent( 'formello-' + eventName ) )

		// custom events API: formello.on('success', ..)
		events.trigger( eventName, [this.element] )
	}

	createRequestHandler (formEl) {

		let parent = this

		return function () {

			// are we done?
			if ( this.readyState === 4 ) {
				parent.showLoading()
				let response
				if (this.status >= 200 && this.status < 400) {
					try {
					  response = JSON.parse( this.responseText )
					} catch (error) {
					  console.log('Formello: failed to parse AJAX response.\n\nError: "' + error + '"')
					  return
					}

					parent.emitEvent( 'submitted', this.element )

					if ( response.error ) {
					  parent.emitEvent( 'error', this.element )
					} else {
					  parent.emitEvent( 'success', this.element )
					}

					// Show form message
					if ( response.message ) {
					  parent.addMessage( response.message, response.errors )
					  parent.emitEvent( 'message', this.element )
					}

					if( response.debug ){
					  console.log(response.debug)
					}

					// Should we hide form?
					if (response.hide_form) {
					  parent.element.style.display = 'none'
					}

					// Should we redirect?
					if (response.redirect_url) {
					  window.location = response.redirect_url
					}

					// clear form
					if (!response.message.errors) {
					  parent.element.reset()
					}
				} else {
					// Server error :(
					console.log( this.responseText )
				}
			}
		}
	}

	reCaptcha() {
		const { recaptcha } = this.element.dataset;
		if( ! JSON.parse( recaptcha ) ){
			return
		}
		this.enableRecaptcha = true

		var recaptchaUrl = 'https://www.google.com/recaptcha/api.js';

		var sitekey = formello.settings.reCaptcha.site_key;
		var buttons = this.element.getElementsByTagName( 'button' )

		if( '1' === formello.settings.reCaptcha.version ){
			var recaptchaDiv = document.createElement( 'div' );
			recaptchaDiv.classList.add( 'g-recaptcha' );
			recaptchaDiv.setAttribute( 'data-sitekey', sitekey );

			this.element.insertBefore( recaptchaDiv, buttons[0] )
		}
		else{
			recaptchaUrl += '?render=' + sitekey
			var recaptchaInput = document.createElement("input");
			recaptchaInput.type = "hidden";
			recaptchaInput.name = "g-recaptcha-response";
			recaptchaInput.classList.add( 'formello-g-recaptcha' );
			this.element.appendChild( recaptchaInput )
		}
		if( sitekey ){
			var script = document.createElement('script');
			script.src = recaptchaUrl;

			document.head.appendChild(script);

		}

	}

	reCaptchaToken() {

        grecaptcha.ready( () => {
			grecaptcha.execute( formello.settings.reCaptcha.site_key, {action: 'submit'} )
			.then( (token) => {
				this.element.querySelector( '.formello-g-recaptcha' ).value = token
				this.submitForm()
			});
        });

	}

	addMessage( message, errors ) {
		let msg = this.element.querySelector( '.formello-message' )
		msg.classList.add( message.type )
		msg.innerHTML = '<p>' + message.text + '</p>'

		if( errors ){
			var ul = document.createElement('ul');

			msg.appendChild(ul);

			errors.forEach(function (item) {
			    let li = document.createElement('li');
			    ul.appendChild(li);
			    li.innerHTML += item;
			});
		}

	}

	cleanMessage() {
		const msg = this.element.querySelector('.formello-message')
		msg.innerHTML = ""
		msg.setAttribute( 'class', 'formello-message' );
	}

	showLoading() {
		const btn = this.element.querySelector('.wp-block-formello-button')
		btn.classList.toggle( 'wp-block-formello-button--loading' )
		btn.toggleAttribute( 'disabled' )
	}

}

export { Formello }