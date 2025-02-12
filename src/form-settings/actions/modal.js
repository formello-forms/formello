import { Fragment, useState, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import {
	Modal,
	Button,
	Icon,
	__experimentalHStack as HStack,
	__experimentalConfirmDialog as ConfirmDialog,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __, sprintf } from '@wordpress/i18n';
import { icons } from './constants';
import MergeTags from '../../components/merge-tags';
import { Promo } from '../../components/promo';
import './filters';

export function ActionsModal( props ) {
	const { onRequestClose, settings, clientId } = props;

	const [ action, setAction ] = useState( Object.assign( {}, settings ) );
	const [ isOpen, setIsOpen ] = useState( false );

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

	const setActions = useCallback(
		( actions ) => {
			setMeta( {
				...meta,
				_formello_actions: actions,
			} );
		},
		[ meta, setMeta ]
	);

	const save = ( item ) => {
		if ( ! item.id ) {
			const newItem = Object.assign( item, {
				id: meta._formello_actions.length + 1,
			} );
			const actions = [ ...meta._formello_actions, newItem ];
			setActions( actions );
		} else {
			const actions = meta._formello_actions.map( ( el ) =>
				el.id === item.id ? { ...el, ...item } : el
			);
			setActions( actions );
		}
		onRequestClose( false );
	};

	const remove = ( item ) => {
		const actions = meta._formello_actions.filter( ( o ) => {
			return o.id !== item.id;
		} );
		setActions( actions );
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
			onRequestClose={ onRequestClose }
			shouldCloseOnClickOutside={ false }
			size="large"
		>
			<div className="formello-action-modal">
				{ 'email' !== settings.type && (
					<Promo { ...props } mergeTags={ MergeTags } />
				) }
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
							variant="primary"
							onClick={ () => {
								save( action );
							} }
						>
							{ __( 'Save' ) }
						</Button>
						{ settings.id && (
							<Button
								isDestructive={ true }
								onClick={ () => setIsOpen( true ) }
							>
								{ __( 'Delete', 'formello' ) }
							</Button>
						) }
					</div>
					{ isOpen && (
						<ConfirmDialog onConfirm={ () => remove( action ) }>
							{ sprintf(
								/* translators: %s: Name of form action */
								__( `Delete action %s?`, 'formello' ),
								settings.name
							) }
						</ConfirmDialog>
					) }
				</Fragment>
			</div>
		</Modal>
	);
}
