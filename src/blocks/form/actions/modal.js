import { Fragment } from '@wordpress/element';

import { Modal, Button } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import MergeTags from '../../../components/merge-tags';

export function ActionsModal( props ) {
	const { onRequestClose, action, actionId, attributes, setAttributes } =
		props;

	const handleUpdate = ( settings ) => {
		// 1. Make a shallow copy of the items
		const items = [ ...attributes.actions ];
		// 2. Make a shallow copy of the item you want to mutate
		items[ actionId ] = settings;

		setAttributes( { actions: items } );
	};

	const deleteAction = () => {
		const items = [ ...attributes.actions ]; // make a separate copy of the array
		items.splice( actionId, 1 );
		setAttributes( { actions: items } );
		onRequestClose();
	};

	const settingsUrl = addQueryArgs( 'edit.php', {
		post_type: 'formello_form',
		page: 'formello-settings',
		tab: 'integrations',
	} );

	return (
		<Modal
			title={ action.title }
			className={ 'formello-modal' }
			onRequestClose={ onRequestClose }
			shouldCloseOnClickOutside={ false }
		>
			<Fragment>
				{ applyFilters(
					'formello.modal.' + action.type,
					'',
					props,
					MergeTags,
					handleUpdate,
					settingsUrl
				) }

				<div className="formello-modal-buttons">
					<Button
						isPrimary={ true }
						onClick={ () => {
							onRequestClose();
						} }
					>
						Save
					</Button>
					<Button
						isDestructive={ true }
						onClick={ () => {
							if ( window.confirm( __( 'Delete action?', 'formello' ) ) ) {
								deleteAction();
							}
						} }
					>
						Delete
					</Button>
				</div>
			</Fragment>
		</Modal>
	);
}
