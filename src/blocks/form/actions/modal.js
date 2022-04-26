import { Fragment } from '@wordpress/element';

import { Modal, Button } from '@wordpress/components';

const { applyFilters } = wp.hooks;

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

	return (
		<Modal
			title={ action.title }
			position="top"
			size="lg"
			className={ 'formello-modal' }
			onRequestClose={ onRequestClose }
		>
			<Fragment>
				{ applyFilters(
					'formello.modal.' + action.type,
					'',
					props,
					MergeTags,
					handleUpdate
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
							deleteAction();
						} }
					>
						Delete
					</Button>
				</div>
			</Fragment>
		</Modal>
	);
}
