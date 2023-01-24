import { Fragment } from '@wordpress/element';

import { Modal, Button } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import MergeTags from '../../../components/merge-tags';

export function ActionsModal( props ) {
	const { onRequestClose, action, deleteAction, updateAction, clientId } =
		props;

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
					updateAction,
					settingsUrl
				) }

				<div className="formello-modal-buttons">
					<Button
						isPrimary={ true }
						onClick={ () => {
							onRequestClose();
						} }
					>
						{ __( 'Save' ) }
					</Button>
					<Button
						isDestructive={ true }
						onClick={ () => {
							if ( window.confirm( __( 'Delete action ' + action.title + '?', 'formello' ) ) ) {
								deleteAction();
							}
						} }
					>
						{ __( 'Delete', 'formello' ) }
					</Button>
				</div>
			</Fragment>
		</Modal>
	);
}
