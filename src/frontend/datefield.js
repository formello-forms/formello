// check if the input date is supported
function checkDateInput() {
    var input = document.createElement('input');
    input.setAttribute('type','date');

    var notADateValue = 'not-a-date';
    input.setAttribute('value', notADateValue); 

    return (input.value !== notADateValue);
}

if ( !checkDateInput ) {
	flatpickr(".formello-date", {});
}