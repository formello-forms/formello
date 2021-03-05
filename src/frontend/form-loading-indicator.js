'use strict'

function Loader (formElement) {
  this.form = formElement
  this.button = formElement.querySelector('input[type="submit"], button[type="submit"]')

  if (this.button) {
    this.originalButton = this.button.cloneNode(true)
  }
}

function toggle( button, toggle ){
    if( button.classList.contains( 'ld-over' ) ){
      button.style.width = button.getBoundingClientRect().width + 'px'
      button.style.height = button.getBoundingClientRect().height + 'px'
      button.children[0].style.display = toggle;
    }
}

Loader.prototype.start = function () {
  if (this.button) {
    this.button.disabled = true;
    this.button.classList.add("running");
    toggle( this.button, 'none' )
  }
}

Loader.prototype.stop = function () {
  toggle( this.button, 'block' )
  if (this.button) {
    this.button.disabled = false;
    this.button.classList.remove("running");
    this.button = this.originalButton
  } else {
    this.form.style.opacity = ''
  }
}

module.exports = Loader