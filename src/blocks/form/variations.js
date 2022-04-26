import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const variations = [
	{
		name: 'basic',
		title: __('Basic'),
		description: __('Basic form'),
		icon: (
			<SVG
				width="48"
				height="48"
				viewBox="0 0 48 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="m39.0625 14h-30.0625v20.0938h30.0625zm-30.0625-2c-1.10457 0-2 .8954-2 2v20.0938c0 1.1045.89543 2 2 2h30.0625c1.1046 0 2-.8955 2-2v-20.0938c0-1.1046-.8954-2-2-2z"
				/>
			</SVG>
		),
		isDefault: true,
		innerBlocks: [
			['formello/input', { type: 'text', label: 'Name', name: 'name' }],
			['formello/button', { txt: 'Book appointment' }],
		],
		scope: ['block'],
	},
	{
		name: 'contact',
		title: __('Contact'),
		description: __('A simple contact form'),
		icon: (
			<SVG
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 48 48"
				width="48"
				height="48"
			>
				<Path d="m37 17c0-1.1-.9-2-2-2h-22c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h22c1.1 0 2-.9 2-2zm-2 0-11 7-11-7zm0 16h-22v-14l11 7 11-7z" />
			</SVG>
		),
		innerBlocks: [
			['formello/input', { type: 'text', label: 'Name', name: 'name' }],
			[
				'formello/input',
				{
					type: 'email',
					label: 'Email',
					name: 'email',
					required: true,
				},
			],
			[
				'formello/input',
				{ type: 'text', label: 'Subject', name: 'subject' },
			],
			[
				'formello/input',
				{
					type: 'textarea',
					label: 'Message',
					name: 'message',
					rows: 5,
				},
			],
			['formello/button', { txt: 'Send' }],
		],
		scope: ['block'],
	},
	{
		name: 'event',
		title: __('Event'),
		description: __('Book event form'),
		icon: (
			<SVG
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 48 48"
				width="48"
				height="48"
			>
				<Path d="m34 16h-1v-2h-2v2h-14v-2h-2v2h-1c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2zm0 18h-20v-11h20zm0-13h-20v-3h20zm-18 4h4v4h-4z"></Path>
			</SVG>
		),
		innerBlocks: [
			[
				'core/columns',
				{},
				[
					[
						'core/column',
						{},
						[
							[
								'formello/input',
								{
									type: 'text',
									label: 'First Name',
									name: 'name',
								},
							],
						],
					],
					[
						'core/column',
						{},
						[
							[
								'formello/input',
								{
									type: 'text',
									label: 'Last Name',
									name: 'last_name',
								},
							],
						],
					],
				],
			],
			[
				'formello/input',
				{
					type: 'email',
					label: 'Email',
					name: 'email',
					required: true,
				},
			],
			[
				'formello/input',
				{ type: 'tel', label: 'Phone', name: 'phone', required: true },
			],
			[
				'core/columns',
				{},
				[
					[
						'core/column',
						{},
						[
							[
								'formello/input',
								{
									type: 'date',
									label: 'Date',
									name: 'date',
									required: true,
								},
							],
						],
					],
					[
						'core/column',
						{},
						[
							[
								'formello/input',
								{ type: 'time', label: 'Hour', name: 'hour' },
							],
						],
					],
				],
			],
			[
				'formello/input',
				{
					type: 'textarea',
					label: 'Message',
					name: 'message',
					rows: 5,
				},
			],
			['formello/button', { txt: 'Book appointment' }],
		],
		scope: ['block'],
	},
];

export default variations;
