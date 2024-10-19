import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import { ActionsModal } from '../../form-settings/actions/modal';
import { integrations, icons } from '../../form-settings/actions/constants';
import {
	ToolbarButton,
	ToolbarGroup,
	ToolbarDropdownMenu,
	Icon,
} from '@wordpress/components';
import { TemplatesModal } from './templates-modal.js';
import { layout } from '@wordpress/icons';

export function Controls( { attributes, clientId } ) {
	const [ meta ] = useEntityProp(
		'postType',
		'formello_form',
		'meta',
		attributes.id
	);

	const [ showActionsModal, setShowActionsModal ] = useState( false );
	const [ showTemplatesModal, setShowTemplatesModal ] = useState( false );

	return (
		<Fragment>
			<ToolbarGroup>
				<ToolbarButton
					label={ __( 'Template', 'popper' ) }
					icon={ layout }
					onClick={ () => {
						setShowTemplatesModal( 'templates' );
					} }
				/>
			</ToolbarGroup>
			<ToolbarGroup>
				<ToolbarDropdownMenu
					icon={ 'admin-generic' }
					label={ __( 'Add action', 'formello' ) }
					controls={ integrations.map( ( a ) => {
						return {
							title: a.name,
							icon: icons[ a.name ],
							onClick: () => {
								setShowActionsModal( a );
							},
						};
					} ) }
				/>
				{ meta._formello_actions.map( ( a, i ) => {
					return (
						<ToolbarButton
							label={ a.name }
							icon={ <Icon icon={ icons[ a.name ] } /> }
							onClick={ () => {
								setShowActionsModal( a );
							} }
							key={ i }
						/>
					);
				} ) }
			</ToolbarGroup>
			{ 'templates' === showTemplatesModal && (
				<TemplatesModal
					clientId={ clientId }
					onRequestClose={ () => setShowTemplatesModal( false ) }
					blockName={ 'formello/form' }
				/>
			) }
			{ showActionsModal && (
				<ActionsModal
					settings={ showActionsModal }
					className={ 'formello-modal' }
					clientId={ clientId }
					onRequestClose={ () => {
						setShowActionsModal( false );
					} }
				/>
			) }
		</Fragment>
	);
}
