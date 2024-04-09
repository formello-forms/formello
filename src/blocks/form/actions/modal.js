import { Fragment, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

import {
	Modal,
	Button,
	Icon,
	__experimentalHStack as HStack,
} from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';
import { __, sprintf } from '@wordpress/i18n';
import { icons } from './constants';
import MergeTags from '../../../components/merge-tags';
import { Promo } from '../../../components/promo';

export function ActionsModal( props ) {
	const { onRequestClose, settings, clientId } = props;

	const [ action, setAction ] = useState( Object.assign( {}, settings ) );

	const updateSettings = ( prop, val ) => {
		setAction( { ...action, [ prop ]: val } );
	};

	const { postType, postId } = useSelect( ( select ) => {
		return {
			postType: select( 'core/editor' ).getCurrentPostType(),
			postId: select( 'core/editor' ).getCurrentPostId(),
		};
	}, [] );

	const [ meta, setMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	const save = ( item ) => {
		if ( ! item.id ) {
			const newItem = Object.assign( item, {
				id: meta._formello_actions.length + 1,
			} );
			setMeta( {
				_formello_actions: [ ...meta._formello_actions, newItem ],
			} );
		} else {
			const arr = meta._formello_actions.map( ( el ) =>
				el.id === item.id ? { ...el, ...item } : el
			);
			setMeta( { _formello_actions: arr } );
		}
		onRequestClose( false );
	};

	const remove = ( item ) => {
		const arr = meta._formello_actions.filter( ( o ) => {
			return o.id !== item.id;
		} );
		setMeta( { _formello_actions: arr } );
		onRequestClose( false );
	};

	return (
		<Modal
			title={
				<HStack>
					<Icon icon={ icons[ settings.name ] } />
					<b>{ settings.name }</b>
				</HStack>
			}
			className={ 'formello-modal' }
			onRequestClose={ onRequestClose }
			shouldCloseOnClickOutside={ false }
		>
			<div className="formello-action-modal">
				<Promo { ...props } mergeTags={ MergeTags } />
				<Fragment>
					{ applyFilters(
						'formello.modal.' + settings.type,
						'',
						clientId,
						action,
						updateSettings,
						MergeTags
					) }

					<div className="formello-modal-buttons">
						<Button
							isPrimary={ true }
							onClick={ () => {
								save( action );
							} }
						>
							{ __( 'Save' ) }
						</Button>
						{ settings.id && (
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
												settings.name
											)
										)
									) {
										remove( action );
									}
								} }
							>
								{ __( 'Delete', 'formello' ) }
							</Button>
						) }
					</div>
				</Fragment>
			</div>
		</Modal>
	);
}
