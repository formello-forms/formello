/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import {
	store as blockEditorStore,
	__experimentalBlockPatternSetup as BlockPatternSetup,
} from '@wordpress/block-editor';
import { Modal, Flex, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

function TemplatesModal( {
	clientId,
	blockName,
	setIsPatternSelectionModalOpen,
} ) {

	const { updateBlockAttributes, replaceInnerBlocks } = useDispatch( blockEditorStore );

	const [ loading, setLoading ] = useState( false );

	const onBlockPatternSelect = ( blocks ) => {
		if ( 'formello/library' === blockName ) {
			updateBlockAttributes( clientId, {
				ref: blocks[ 0 ].attributes.id,
			} );
			setIsPatternSelectionModalOpen( false );
		} else {
			replaceInnerBlocks( clientId, blocks[ 0 ].innerBlocks );
			setIsPatternSelectionModalOpen( false );
		}
	};

	const patterns = useSelect(
		( select ) => {
			const {
				getBlockRootClientId,
				getPatternsByBlockTypes,
				__experimentalGetAllowedPatterns,
			} = select( blockEditorStore );
			const rootClientId = getBlockRootClientId( clientId );
			return getPatternsByBlockTypes( blockName, rootClientId );
		},
		[ clientId, blockName ]
	);

	const updateTransient = () => {
		setLoading( true );
		apiFetch( {
			path: '/formello/v1/sync_template_library/',
			method: 'POST',
			data: {},
		} ).then( () => {
			setLoading( false );
			window.location.reload();
		} ).catch( () => setLoading( false ) );
	};

	return (
		<Modal
			className="formello-modal"
			isFullScreen
			title={ __( 'Choose a pattern' ) }
			closeLabel={ __( 'Cancel' ) }
			onRequestClose={ () => setIsPatternSelectionModalOpen( false ) }
		>
			{
				! patterns.length &&
			    <div>
			        <p>
			            { __( 'There\'s no patterns available. Try to re-sync.', 'formello' ) }
			        </p>
					<Button
						isPrimary
						onClick={ updateTransient }
						isBusy={ loading }
						disabled={ loading }
					>
						{ __( 'Sync patterns', 'popper' ) }
					</Button>
			    </div>				
			}
			<BlockPatternSetup
				blockName={ blockName }
				clientId={ clientId }
				onBlockPatternSelect={ onBlockPatternSelect }
				showTitles={ true }
			/>
		</Modal>
	);
}

export default TemplatesModal;
