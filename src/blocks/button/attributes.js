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
		}
	};