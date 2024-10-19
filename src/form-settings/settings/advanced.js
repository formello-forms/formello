import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { ToggleControl } from '@wordpress/components';

export function AdvancedSettings() {
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

	if ( ! meta._formello_settings ) {
		return <></>;
	}

	const { enableJsValidation, debug } = meta._formello_settings;

	const setOptions = ( key, val ) => {
		setMeta( {
			...meta,
			_formello_settings: {
				...meta._formello_settings,
				[ key ]: val,
			},
		} );
	};

	return (
		<Fragment>
			<ToggleControl
				label={ __( 'Enable Js validation', 'formello' ) }
				checked={ enableJsValidation }
				onChange={ ( val ) => {
					setOptions( 'enableJsValidation', val );
				} }
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={ __( 'Enable debug', 'formello' ) }
				checked={ debug }
				onChange={ ( val ) => {
					setOptions( 'debug', val );
				} }
				__nextHasNoMarginBottom
			/>
		</Fragment>
	);
}
