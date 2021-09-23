export const SUPPORTED_ATTRIBUTES = {
	text: 		[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'maxlength', 'minlength', 'pattern', 'placeholder' ],
	tel: 		[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'maxlength', 'minlength', 'pattern', 'placeholder' ],
	url: 		[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'maxlength', 'minlength', 'pattern', 'placeholder' ],
	email:		[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'placeholder' ],
	number:		[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'max', 'min', 'step', 'placeholder' ],
	date:		[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'step', 'placeholder' ],
	time:		[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'step', 'min', 'max' ],
	range:		[ 'name', 'id', 'type', 'required', 'readonly', 'disabled', 'max', 'min', 'step' ],
	checkbox:	[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'checked' ],
	radio: 		[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'checked' ],
	hidden: 	[ 'name', 'id', 'type', 'value' ],
	color: 		[ 'name', 'id', 'type', 'value', 'readonly', 'disabled' ],
	textarea:	[ 'name', 'id', 'type', 'required', 'value', 'readonly', 'disabled', 'maxlength', 'minlength', 'placeholder', 'cols', 'rows' ],
}
