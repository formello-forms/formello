import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect, dispatch } from '@wordpress/data';
import {
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { getFieldsBlock } from '../../components/merge-tags/functions';

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

	const {
		autoComplete,
		requiredText,
		enableJsValidation,
		noValidate,
		debug,
	} = meta._formello_settings;

	const setOptions = ( key, val ) => {
		setMeta( {
			...meta,
			_formello_settings: {
				...meta._formello_settings,
				[ key ]: val,
			},
		} );
	};

	const changeRequiredText = ( val ) => {
		setOptions( 'requiredText', val );

		const fields = getFieldsBlock();

		fields.forEach( ( block ) => {
			dispatch( blockEditorStore ).updateBlockAttributes(
				block.clientId,
				{ requiredText: val }
			);
		} );
	};

	return (
		<Fragment>
			<TextControl
				label={ __( 'Required Field Indicator', 'formello' ) }
				value={ requiredText }
				onChange={ ( val ) => changeRequiredText( val ) }
				__nextHasNoMarginBottom
			/>
			<SelectControl
				label={ __( 'Autocomplete', 'formello' ) }
				value={ autoComplete }
				options={ [
					{ label: 'On', value: 'on' },
					{ label: 'Off', value: 'off' },
				] }
				onChange={ ( val ) => {
					setOptions( 'autocomplete', val );
				} }
				help={ __(
					'Add "autocomplete" attribute fo form tag.',
					'formello'
				) }
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={ __( 'Enable Js validation', 'formello' ) }
				checked={ enableJsValidation }
				onChange={ ( val ) => {
					setOptions( 'enableJsValidation', val );
				} }
				__nextHasNoMarginBottom
			/>
			<ToggleControl
				label={ __( 'Disable HTML5 validation', 'formello' ) }
				checked={ noValidate }
				onChange={ ( val ) => {
					setOptions( 'noValidate', val );
				} }
				help={ __(
					'Add "novalidate" attribute fo form tag.',
					'formello'
				) }
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
