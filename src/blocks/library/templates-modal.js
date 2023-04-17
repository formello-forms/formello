/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import {
	store as blockEditorStore,
	//__experimentalBlockPatternSetup as BlockPatternSetup,
} from '@wordpress/block-editor';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import BlockPatternSetup from './blockpattern';

function TemplatesModal( {
	clientId,
	blockName,
	setIsPatternSelectionModalOpen,
} ) {
	const { updateBlockAttributes, replaceInnerBlocks } = useDispatch( blockEditorStore );
	const onBlockPatternSelect = ( blocks ) => {
		if ( 'formello/library' === blockName ) {
			updateBlockAttributes( clientId, {
				id: blocks[ 0 ].attributes.id,
			} );
			setIsPatternSelectionModalOpen( false );
		} else {
			replaceInnerBlocks( clientId, blocks[ 0 ].innerBlocks );
			setIsPatternSelectionModalOpen( false );
		}
	};

	return (
		<Modal
			className="block-editor-query-pattern__selection-modal"
			isFullScreen
			title={ __( 'Choose a pattern' ) }
			closeLabel={ __( 'Cancel' ) }
			onRequestClose={ () => setIsPatternSelectionModalOpen( false ) }
		>
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
