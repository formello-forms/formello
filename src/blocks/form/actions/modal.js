import { Fragment, useState } from '@wordpress/element';

import { Modal, Button, TextControl } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

import { applyFilters } from '@wordpress/hooks';
import { __, sprintf } from '@wordpress/i18n';

export function ActionsModal( props ) {
	const { onRequestClose, settings, deleteAction, updateAction } = props;

	const [ action, setAction ] = useState( Object.assign( {}, settings ) );

	const settingsUrl = addQueryArgs( 'admin.php', {
		page: 'formello-settings',
		tab: 'integrations',
	} );

	const updateSettings = ( prop, val ) => {
		setAction( { ...action, [ prop ]: val } );
	};

	return (
		<Modal
			title={ settings.title }
			className={ 'formello-modal' }
			onRequestClose={ onRequestClose }
			shouldCloseOnClickOutside={ false }
		>
			<div className="formello-action-modal">
				<TextControl
					label={ __( 'Title' ) }
					value={ action.title }
					onChange={ ( val ) => updateSettings( 'title', val ) }
					help={ __(
						'Name of the action. For debug purpose.',
						'formello'
					) }
				/>
				<Fragment>
					{ applyFilters(
						'formello.modal.' + settings.type,
						'',
						props,
						action,
						updateSettings,
						settingsUrl
					) }

					<div className="formello-modal-buttons">
						<Button
							isPrimary={ true }
							onClick={ () => {
								onRequestClose( action );
								updateAction( action );
							} }
						>
							{ __( 'Save' ) }
						</Button>
						<Button
							isDestructive={ true }
							onClick={ () => {
								if (
									window.confirm(
										/* translators: %s: Name of form action */
										sprintf(
											__(
												`Delete action %s?`,
												'formello'
											),
											settings.title
										)
									)
								) {
									deleteAction( action );
								}
							} }
						>
							{ __( 'Delete', 'formello' ) }
						</Button>
					</div>
				</Fragment>
			</div>
		</Modal>
	);
}
