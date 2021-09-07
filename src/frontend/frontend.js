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

        if( response.debug ){
          console.log(response.debug)
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
  var errors = bouncer.validateAll(formEl);

  if( errors.length ){
    loader.stop()
    //window.scrollTo(0, errors[0].offsetTop);
    errors[0].scrollIntoView({behaviour: "smooth", block: "end", inline: "nearest"});
    return
  }

  var settings = formEl.dataset

  if( !settings.recaptcha ){
    submitForm( formEl )
    return
  }

  if( !formello.settings.recaptcha.site_key ){
    submitForm( formEl )
    return
  }

  if( formello.settings.recaptcha.version == 3 ){
    grecaptcha.ready(function() {
      grecaptcha.execute( formello.settings.recaptcha.site_key, {action: 'submit'}).then(function(token) {

        submitForm( formEl, token )

      });
    });
  }

  if( formello.settings.recaptcha.version == 1 ){
        submitForm( formEl )
  }

}

document.addEventListener('submit', handleSubmitEvents, false) // useCapture=false to ensure we bubble upwards (and thus can cancel propagation)

var bouncer = new Bouncer('.wp-block-formello-form', {
  disableSubmit: true,
  messages: formello.settings.messages
})

// add recaptcha div to all formello buttons on page
window.formelloCallback = () => {
  let buttons = document.querySelectorAll('.wp-block-formello-button')

  for (var i = 0; i < buttons.length; i++) {

    let gReCaptcha = document.createElement('div')
    gReCaptcha.className = 'g-recaptcha'
    buttons[i].parentNode.appendChild(gReCaptcha);

    grecaptcha.render( gReCaptcha, {
      'sitekey' : formello.settings.recaptcha.site_key
    });

  }

};

// check if the input date is supported
function checkDateInput() {

    var input = document.createElement('input');
    input.setAttribute('type','date');

    var notADateValue = 'not-a-date';
    input.setAttribute('value', notADateValue); 

    return (input.value !== notADateValue);

}

if ( !checkDateInput() ) {

  var script = document.createElement('script');
  script.onload = function () {
    const date = flatpickr(".formello-date", {});
    const time = flatpickr(".formello-time", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
    });
  };
  script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';

  document.head.appendChild(script); //or something of the likes

  var link = document.createElement( "link" );
  link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";

  document.getElementsByTagName( "head" )[0].appendChild( link );

}

console.log("formello loaded")
