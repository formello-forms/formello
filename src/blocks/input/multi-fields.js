import { registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockVariation( 'core/group', {
	name: 'full-name',
	title: __( 'Full Name' ),
	attributes: { layout: { type: 'flex', flexWrap: 'nowrap' } },
	innerBlocks: [
		[
			'formello/input',
			{
				type: 'text',
				label: 'First Name',
				name: 'name',
				style: { layout: { selfStretch: 'fill', flexSize: null } },
			},
		],
		[
			'formello/input',
			{
				type: 'text',
				label: 'Last Name',
				name: 'lastname',
				style: { layout: { selfStretch: 'fill', flexSize: null } },
			},
		],
	],
	scope: [ 'inserter' ],
	example: undefined,
} );

registerBlockVariation( 'core/group', {
	name: 'date-time',
	title: __( 'Date & Time' ),
	attributes: { layout: { type: 'flex', flexWrap: 'nowrap' } },
	innerBlocks: [
		[
			'formello/input',
			{
				type: 'date',
				label: 'Date',
				name: 'date',
				style: { layout: { selfStretch: 'fill', flexSize: null } },
			},
		],
		[ 'formello/input', { type: 'time', label: 'Time', name: 'time' } ],
	],
	scope: [ 'inserter' ],
	example: undefined,
} );
