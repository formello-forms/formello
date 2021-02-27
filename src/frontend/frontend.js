import Bouncer from 'formbouncerjs'
import events from './events.js'
const Loader = require('./form-loading-indicator.js')

const vars = window.formello || { ajax_url: window.location.href }

function cleanFormMessages (formEl) {
  const messageElements = formEl.parentNode.querySelectorAll('.formello-message');
  [].forEach.call(messageElements, (el) => {
    el.parentNode.removeChild(el)
  })
}

function addFormErrors (errors) {
  var listItem;
  var listElement = document.createElement('ul');
  for (let key in errors) {
    listItem = document.createElement('li')
    listItem.innerHTML = errors[key];
    listElement.appendChild(listItem);
  }
  return listElement
}

function addFormMessage (formEl, message) {

  var messageDiv = formEl.querySelector('.formello-message')

  if( !messageDiv ){
    messageDiv = document.createElement('p')
    messageDiv.role = 'alert'
  }
  messageDiv.className = 'formello-message ' + message.type
  messageDiv.innerHTML = message.text // uses innerHTML because we allow some HTML strings in the message settings

  if( message.errors ){
    messageDiv.appendChild(addFormErrors(message.errors));
  }

  formEl.parentNode.insertBefore(messageDiv, formEl.nextSibling);

}

function handleSubmitEvents (e) {
  const formEl = e.target
  if (formEl.className.indexOf('wp-block-formello-form') < 0) {
    return
  }
  // always prevent default (because regular submit doesn't work for Formello)
  e.preventDefault()
  e.stopPropagation()

  //submitForm(formEl)
  validate(formEl) // here we perform captcha and other validation
}

function submitForm ( formEl, token ) {
  cleanFormMessages(formEl)
  emitEvent('submit', formEl)

  const formData = new FormData(formEl);

  if( token ){
    formData.append( 'g-recaptcha-response', token )
  }

  let request = new XMLHttpRequest()
  request.onreadystatechange = createRequestHandler(formEl)
  request.open('POST', vars.ajax_url, true)
  request.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  request.send(formData)
  request = null

}

function emitEvent (eventName, element) {
  // browser event API: formElement.on('formello-success', ..)
  element.dispatchEvent(new CustomEvent('formello-' + eventName))

  // custom events API: formello.on('success', ..)
  events.trigger(eventName, [element])
}

function createRequestHandler (formEl) {
  const loader = new Loader(formEl)
  loader.start()

  return function () {
    // are we done?
    if (this.readyState === 4) {
      let response
      loader.stop()

      if (this.status >= 200 && this.status < 400) {
        try {
          response = JSON.parse(this.responseText)
        } catch (error) {
          console.log('Formello: failed to parse AJAX response.\n\nError: "' + error + '"')
          return
        }

        emitEvent('submitted', formEl)

        if (response.error) {
          emitEvent('error', formEl)
        } else {
          emitEvent('success', formEl)
        }

        // Show form message
        if (response.message) {
          addFormMessage(formEl, response.message)
          emitEvent('message', formEl)
        }

        // Should we hide form?
        if (response.hide_form) {
          formEl.style.display = 'none'
        }

        // Should we redirect?
        if (response.redirect_url) {
          window.location = response.redirect_url
        }

        // clear form
        if (!response.message.errors) {
          formEl.reset()
        }
      } else {
        // Server error :(
        console.log(this.responseText)
      }
    }
  }
}

function validate( formEl ){

  // start a loader
  const loader = new Loader(formEl)
  loader.start()

  // BouncerJs validation
  var areValid = bouncer.validateAll(formEl);

  if( areValid.length ){
    loader.stop()
    return
  }

  var settings = formEl.dataset

  if( !settings.recaptcha ){
    submitForm( formEl )
    return
  }

  if( !settings.recaptcha.site_key ){
    submitForm( formEl )
    return
  }

  if( formello.settings.recaptcha.version == 3 ){
    grecaptcha.ready(function() {
      grecaptcha.execute( settings.recaptcha.site_key, {action: 'submit'}).then(function(token) {

        submitForm( formEl, token )

      });
    });
  }

  if( formello.settings.recaptcha.version == 1 ){
        submitForm( formEl )
  }

}

document.addEventListener('submit', handleSubmitEvents, true) // useCapture=false to ensure we bubble upwards (and thus can cancel propagation)

var bouncer = new Bouncer('form', {
  disableSubmit: false,
  messages: formello.settings.messages
})

window.formelloCallback = () => {
  let buttons = document.querySelectorAll('.wp-block-formello-button')

  for (var i = 0; i < buttons.length; i++) {

    let gReCaptcha = document.createElement('div')
    gReCaptcha.className = 'g-recaptcha'
    buttons[i].appendChild(gReCaptcha);

    grecaptcha.render( gReCaptcha, {
      'sitekey' : formello.settings.recaptcha
    });

  }

};

console.log("formello loaded")
