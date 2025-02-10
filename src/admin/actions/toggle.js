import { starFilled, heading } from '@wordpress/icons';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

export const toggleNew = {
	id: 'seen-unseen',
	label: __( 'Toggle new', 'formello' ),
	isPrimary: false,
	icon: heading,
	isEligible: () => true,
	supportsBulk: true,
	hideModalHeader: true,
	async callback( items, { registry } ) {
		const { saveEntityRecord } = registry.dispatch( coreStore );
		const promiseResult = await Promise.allSettled(
			items.map( ( item ) =>
				saveEntityRecord(
					'formello/v1',
					'submissions',
					{
						id: item.id,
						details: { is_new: ! parseInt( item.details.is_new ) },
					},
					{ throwOnError: true }
				)
			)
		);
	},
};

export const toggleStar = {
	id: 'star-unstar',
	label: __( 'Toggle favorite', 'formello' ),
	isPrimary: false,
	icon: starFilled,
	isEligible: () => true,
	supportsBulk: true,
	hideModalHeader: true,
	async callback( items, { registry } ) {
		const { saveEntityRecord } = registry.dispatch( coreStore );
		const promiseResult = await Promise.allSettled(
			items.map( ( item ) =>
				saveEntityRecord(
					'formello/v1',
					'submissions',
					{
						id: item.id,
						details: {
							starred: ! parseInt( item.details.starred ),
						},
					},
					{ throwOnError: true }
				)
			)
		);
	},
};
