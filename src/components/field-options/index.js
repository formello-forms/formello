/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	FormTokenField,
	ToggleControl,
	TextControl,
	Button
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import MergeTags from '../merge-tags';
import {
	useTabs,
} from '../merge-tags/use-tabs';

import { SUPPORTED_ATTRIBUTES } from './constants';

export default function Options( props ) {
	const { attributes, setAttributes, clientId, setModalOpen, fieldType } = props;

	const {
		type,
		name,
		value,
		placeholder,
		required,
		multiple,
		options,
		checked,
		showHelp
	} = attributes;

	const supported = SUPPORTED_ATTRIBUTES[ fieldType ];

	return (
		<Fragment>
			<PanelBody title={ __( 'Options', 'formello' ) } initialOpen={ true }>
				<TextControl
					label={ __( 'Name', 'formello' ) }
					value={ name }
					onChange={ ( val ) =>
						setAttributes( { name: val.toLowerCase() } )
					}
				/>
				{ supported.includes( 'value' ) && (
					<MergeTags
						clientId={ clientId }
						label={ __( 'Value', 'formello' ) }
						value={ value }
						onChange={ ( val ) => {
							setAttributes( { value: val } );
						} }
					/>
				) }
				{ supported.includes( 'placeholder' ) && (
					<TextControl
						label={ __( 'Placeholder', 'formello' ) }
						value={ placeholder }
						onChange={ ( val ) =>
							setAttributes( { placeholder: val } )
						}
					/>
				) }
				{ supported.includes( 'required' ) && (
					<ToggleControl
						label={ __( 'Required', 'formello' ) }
						checked={ required }
						onChange={ ( val ) =>
							setAttributes( { required: val } )
						}
					/>
				) }
				{ supported.includes( 'multiple' ) && (
					<ToggleControl
						label={ __( 'Multiple', 'formello' ) }
						checked={ multiple }
						onChange={ ( val ) =>
							setAttributes( { multiple: val } )
						}
					/>
				) }
				{ supported.includes( 'checked' ) && (
					<ToggleControl
						label={ __( 'Checked', 'formello' ) }
						checked={ checked }
						onChange={ ( newval ) =>
							setAttributes( { checked: newval } )
						}
					/>
				) }
				{ ! ( 'hidden' === type ) && (
					<ToggleControl
						label={ __( 'Show Description', 'formello' ) }
						checked={ showHelp }
						onChange={ ( newval ) =>
							setAttributes( { showHelp: newval } )
						}
					/>
				) }
				{ 'select' === fieldType && (
					<Fragment>
						<Button
							variant={ 'primary' }
							onClick={ () => {
								setModalOpen( true );
							} }
						>
							{ __( 'Manage Options', 'formello' ) }
						</Button>
					</Fragment>
				) }
			</PanelBody>
		</Fragment>
	);
}
