import { __, sprintf } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	Dropdown,
	Button,
	MenuGroup,
	MenuItem,
	Icon,
	__experimentalConfirmDialog as ConfirmDialog,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { integrations, icons } from '../actions/constants';
import { close, cog } from '@wordpress/icons';
import { ActionsModal } from '../actions/modal';

export function ActionsSettings() {
	const { postType, postId } = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return {
			postType: select( 'core/editor' ).getCurrentPostType(),
			postId: select( 'core/editor' ).getCurrentPostId(),
			isPreview: getSettings().__unstableIsPreviewMode,
		};
	}, [] );

	const [ meta, setMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	const [ showModal, setShowModal ] = useState( false );
	const [ confirm, setConfirm ] = useState( false );

	if ( ! meta._formello_actions ) {
		return <></>;
	}

	const remove = ( item ) => {
		const arr = meta._formello_actions.filter( ( o ) => {
			return o.id !== item.id;
		} );
		setMeta( { ...meta, _formello_actions: arr } );
		setShowModal( false );
	};

	return (
		<Fragment>
			<Dropdown
				popoverProps={ { placement: 'bottom-start' } }
				renderToggle={ ( { isOpen, onToggle } ) => (
					<Button
						variant="primary"
						onClick={ onToggle }
						aria-expanded={ isOpen }
					>
						{ __( 'Add action', 'formello' ) }
					</Button>
				) }
				renderContent={ ( { onToggle } ) => (
					<MenuGroup>
						{ integrations.map( ( a, i ) => {
							return (
								<MenuItem
									icon={ <Icon icon={ icons[ a.name ] } /> }
									onClick={ () => {
										setShowModal( a );
										onToggle();
									} }
									iconPosition="left"
									key={ i }
								>
									{ a.name }
								</MenuItem>
							);
						} ) }
					</MenuGroup>
				) }
			/>
			<VStack className={ 'formello-actions-list' }>
				{ meta._formello_actions.map( ( a, i ) => {
					return (
						<HStack
							key={ i }
							direction="row"
							className={ 'formello-action-item' }
						>
							<HStack justify={ 'flex-start' }>
								<Icon icon={ icons[ a.name ] } />
								<b>{ a.name }</b>
							</HStack>
							<HStack justify={ 'flex-end' } spacing="0">
								<Button
									icon={ cog }
									onClick={ () => setShowModal( a ) }
									size="small"
								/>
								<Button
									icon={ close }
									onClick={ () => setConfirm( a ) }
									size="small"
								/>
							</HStack>
						</HStack>
					);
				} ) }
			</VStack>
			{ showModal && (
				<ActionsModal
					settings={ showModal }
					clientId={ '' }
					remove={ remove }
					onRequestClose={ () => {
						setShowModal( false );
					} }
				/>
			) }
			<ConfirmDialog
				isOpen={ confirm }
				onConfirm={ () => {
					remove( confirm );
					setConfirm( false );
				} }
				onCancel={ () => setConfirm( false ) }
			>
				{ sprintf(
					'Are you sure you want delete %s action?',
					confirm.name,
					'formello'
				) }
			</ConfirmDialog>
		</Fragment>
	);
}
