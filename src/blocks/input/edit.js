import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { ToolbarGroup } from '@wordpress/components';

import { Hidden } from '../../icons/icons';
import Label from '../../components/label';
import Options from '../../components/field-options';
import ValidationOptions from '../../components/field-options/validation';
import AdvancedOptions from '../../components/field-options/advanced';
import Toolbar from '../../components/field-options/toolbar';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';
import { getInputClassesAndStyles } from './use-field-props';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const {
		type,
		showHelp,
		name,
		checked,
		value,
		step,
		placeholder,
		autocomplete,
		help,
	} = attributes;

	const TagName = type === 'textarea' ? 'textarea' : 'input';
	const supported = SUPPORTED_ATTRIBUTES[ type ];

	const fieldProps = getInputClassesAndStyles( attributes );

	const blockProps = useBlockProps( {
		className: fieldProps.containerClass,
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'formello/button', 'formello/output' ],
		orientation: 'horizontal',
		renderAppender: false,
	} );

	const onChange = ( e ) => {
		if ( 'checkbox' === type || 'radio' === type ) {
			setAttributes( { checked: ! checked } );
		}
		setAttributes( { placeholder: e.target.value } );
	};

	return (
		<div { ...innerBlocksProps }>
			<BlockControls>
				{ supported.includes( 'required' ) && (
					<ToolbarGroup>
						<Toolbar { ...props } />
					</ToolbarGroup>
				) }
			</BlockControls>
			<InspectorControls>
				<Options { ...props } fieldType={ type } />
				{ 'hidden' !== type && (
					<ValidationOptions { ...props } fieldType={ type } />
				) }
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvancedOptions { ...props } fieldType={ type } />
			</InspectorAdvancedControls>

			{ 'hidden' !== type ? (
				<Label { ...props } htmlFor="input" />
			) : (
				<div className="formello-hidden">
					<Hidden width="30" height="30" />
					<div>[{ name }]</div>
				</div>
			) }

			<TagName
				className={ fieldProps.inputClass }
				style={ fieldProps.inputStyle }
				type={ 'password' !== type ? type : 'text' }
				value={ 'password' !== type ? value : '' }
				checked={ checked || false }
				step={ step || undefined }
				onChange={ onChange }
				placeholder={ placeholder }
				disabled={ 'file' === type }
				autoComplete={ autocomplete || 'new-password' }
			/>

			{ children }

			{ 'hidden' !== type && showHelp && (
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
					disableLineBreaks
				/>
			) }
		</div>
	);
}
