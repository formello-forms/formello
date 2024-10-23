import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	RichText,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import clsx from 'clsx';

import Label from '../../components/label';
import Options from '../../components/field-options';
import ValidationOptions from '../../components/field-options/validation';
import AdvancedOptions from '../../components/field-options/advanced';
import Toolbar from '../../components/field-options/toolbar';

import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';
import { getInputClassesAndStyles } from '../input/use-field-props';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { cols, rows, value, placeholder, showHelp, help } = attributes;

	const supported = SUPPORTED_ATTRIBUTES.textarea;

	const fieldProps = getInputClassesAndStyles( attributes );

	const blockProps = useBlockProps( {
		className: fieldProps.containerClass,
	} );

	return (
		<div { ...blockProps }>
			<BlockControls>
				{ supported.includes( 'required' ) && (
					<ToolbarGroup>
						<Toolbar { ...props } />
					</ToolbarGroup>
				) }
			</BlockControls>
			<InspectorControls>
				<Options { ...props } fieldType="textarea" />
				<ValidationOptions { ...props } fieldType="textarea" />
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvancedOptions { ...props } fieldType="textarea" />
			</InspectorAdvancedControls>

			<Label { ...props } />
			<textarea
				cols={ cols }
				rows={ rows }
				value={ value }
				onChange={ ( event ) =>
					setAttributes( { value: event.target.value } )
				}
				placeholder={ placeholder }
				style={ fieldProps.inputStyle }
				className={ fieldProps.inputClass }
			></textarea>

			{ showHelp && (
				<RichText
					tagName="small"
					value={ help }
					onChange={ ( val ) => setAttributes( { help: val } ) }
					placeholder={ __( 'Enter help message…', 'formello' ) }
					allowedFormats={ [
						'core/bold',
						'core/italic',
						'core/link',
					] }
					multiline={ false }
				/>
			) }
		</div>
	);
}
