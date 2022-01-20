const attributes = 		
	{	
	    lock: {
	        type: 'object',
	        default: {
	            move: true,
	            remove: true
	        }
	    },
		form_id: {
			type: 'number'
		},
		text: {
			type: 'string',
			default: 'Submit',
		},
		iconPosition: {
			type: 'string',
			default: 'ld-ext-right',
		},
		iconType: {
			type: 'string',
			default: 'ld-ring',
		},
		alignment: {
			type: 'string',
			default: 'left',
		},
		fontSize: {
			type: 'number',
			default: '14',
		},
		backgroundColor: {
			type: 'string',
		},
		backgroundColorOpacity: {
			type: 'number',
		},
		backgroundColorHover: {
			type: 'string',
		},
		backgroundColorHoverOpacity: {
			type: 'number',
		},
		textColorHover: {
			type: 'string',
		},
		borderColor: {
			type: 'string',
		},
		borderColorOpacity: {
			type: 'number',
		},
		borderColorHover: {
			type: 'string',
		},
		borderColorHoverOpacity: {
			type: 'number',
		},
		textColor: {
			type: 'string'
		},
		borderWidth: {
			type: 'numeric'
		},
		borderRadius: {
			type: 'numeric'
		},
		borderColor: {
			type: 'string'
		},
		paddingTop: {
			type: 'string',
		},
		paddingRight: {
			type: 'string',
		},
		paddingBottom: {
			type: 'string',
		},
		paddingLeft: {
			type: 'string',
		},
		paddingUnit: {
			type: 'string',
		},
		style: {
			type: 'object'
		}
	};