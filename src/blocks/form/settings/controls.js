import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';

import {
	useEntityProp,
} from '@wordpress/core-data';

import { ActionsModal } from '../actions/modal';
import { getActions } from '../actions/actions';

import {
	ToolbarButton,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from '@wordpress/components';

export function Controls( { attributes, clientId } ) {
	const [ meta, setMeta ] = useEntityProp( 'postType', 'formello_form', 'meta', attributes.id );

	const registeredActions = getActions();
	const actions = meta?._formello_actions;
	const [ active, setActive ] = useState( 0 );
	const [ showActionsModal, setShowActionsModal ] = useState( false );

	const addAction = ( type ) => {
		registeredActions.forEach( ( a ) => {
			if ( a.type === type ) {
				setMeta( { _formello_actions: [ ...actions, a ] } );
				setShowActionsModal( a );
				setActive( actions.length );
			}
		} );
	};

	const updateAction = ( settings ) => {
		// 1. Make a shallow copy of the items
		const items = [ ...actions ];

		// 2. Make a shallow copy of the item you want to mutate
		items[ active ] = settings;

		setMeta( { _formello_actions: items } );
		//setActions( items );
	};

	const deleteAction = () => {
		const items = [ ...actions ]; // make a separate copy of the array
		items.splice( active, 1 );
		setMeta( { _formello_actions: items } );
		setShowActionsModal( false );
	};

	return (
		<Fragment>
			<ToolbarGroup>
				<ToolbarDropdownMenu
					icon={ 'admin-generic' }
					label={ __( 'Add action', 'formello' ) }
					controls={ registeredActions.map( ( a ) => {
						return {
							title: a.title,
							icon: a.icon,
							onClick: () => {
								addAction( a.type );
							},
						};
					} ) }
				/>
				{ actions?.map( ( a, i ) => {
					const action = registeredActions.find( ( obj ) => {
						return obj.type === a.type;
					} );
					if ( ! action ) {
						return;
					}
					return (
						<ToolbarButton
							label={ a.title }
							icon={ action.icon }
							key={ i }
							onClick={ () => {
								setActive( i );
								setShowActionsModal( a );
							} }
						/>
					);
				} ) }
			</ToolbarGroup>

			{ showActionsModal && (
				<ActionsModal
					settings={ showActionsModal }
					className={ 'formello-modal' }
					clientId={ clientId }
					deleteAction={ deleteAction }
					updateAction={ updateAction }
					onRequestClose={ () => {
						setShowActionsModal( false );
					} }
				/>
			) }
		</Fragment>
	);
}
