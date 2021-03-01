// check if the input date is supported
function checkDateInput() {
    var input = document.createElement('input');
    input.setAttribute('type','date');

    var notADateValue = 'not-a-date';
    input.setAttribute('value', notADateValue); 

    return (input.value !== notADateValue);
}

if ( !checkDateInput ) {

	var script = document.createElement('script');
	script.onload = function () {
	    //do stuff with the script
		flatpickr(".formello-date", {});
	};
	script.src = something;

	document.head.appendChild(script); //or something of the likes
}