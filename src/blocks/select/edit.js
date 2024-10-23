import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	RichText,
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';

import { useState, Fragment } from '@wordpress/element';

import { OptionsModal } from './modal';
import Label from '../../components/label';
import Toolbar from '../../components/field-options/toolbar';
import Options from '../../components/field-options';
import AdvancedOptions from '../../components/field-options/advanced';
import { getInputClassesAndStyles } from '../input/use-field-props';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { name, options, showHelp, help, readonly, multiple, disabled } =
		attributes;

	const [ isModalOpen, setModalOpen ] = useState( false );

	const fieldProps = getInputClassesAndStyles( attributes );

	const blockProps = useBlockProps( {
		className: fieldProps.containerClass,
	} );

	const selectedOpts = () => {
		const selection = options
			.filter( ( x ) => true === x.selected )
			.map( ( x ) => x.value );
		if ( ! multiple ) {
			return selection[ 0 ];
		}
		return selection;
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<BlockControls>
					<ToolbarGroup>
						<Toolbar { ...props } />
						<ToolbarButton
							label={ __( 'Add options', 'formello' ) }
							icon={ 'editor-ul' }
							onClick={ () => {
								setModalOpen( true );
							} }
						/>
					</ToolbarGroup>
				</BlockControls>
				<Options
					{ ...props }
					setModalOpen={ setModalOpen }
					fieldType="select"
				/>
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvancedOptions { ...props } fieldType="select" />
			</InspectorAdvancedControls>
			<Fragment>
				<Label { ...props } />

				<select
					name={ name }
					multiple={ multiple }
					readOnly={ readonly }
					disabled={ disabled }
					defaultValue={ selectedOpts() }
					style={ fieldProps.inputStyle }
					className={ fieldProps.inputClass }
				>
					{ options.map( ( opt, index ) => {
						return (
							<option
								value={ opt.value || opt.label }
								key={ index }
								//selected={ opt.selected }
							>
								{ opt.label }
							</option>
						);
					} ) }
				</select>
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
					/>
				) }
			</Fragment>
			{ isModalOpen && (
				<OptionsModal
					{ ...props }
					onRequestClose={ () => {
						setModalOpen( false );
					} }
				/>
			) }
		</div>
	);
}
