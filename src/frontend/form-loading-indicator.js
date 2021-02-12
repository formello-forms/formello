'use strict'

function Loader (formElement) {
  this.form = formElement
  this.button = formElement.querySelector('input[type="submit"], button[type="submit"]')

  if (this.button) {
    this.originalButton = this.button.cloneNode(true)
  }
}

Loader.prototype.start = function () {
  if (this.button) {
    this.button.disabled = true;
    this.button.style.width = this.button.getBoundingClientRect().width + 'px'
    this.button.style.height = this.button.getBoundingClientRect().height + 'px'
    this.button.classList.add("loading-start");
  }
}

Loader.prototype.stop = function () {
  if (this.button) {
    this.button.disabled = false;
    this.button.classList.remove("loading-start");
    this.button = this.originalButton
  } else {
    this.form.style.opacity = ''
  }
}

module.exports = Loader