/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
//import './editor.scss';

import {
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';

import { useState, Fragment } from '@wordpress/element';

import { OptionsModal } from './modal';
import Label from '../../components/label';
import Toolbar from '../../components/field-options/toolbar';
import Options from '../../components/field-options';
import AdvancedOptions from '../../components/field-options/advanced';
import { useInputId } from '../../components/hooks';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { name, options, showHelp, help, readonly, multiple, disabled } =
		attributes;
	const inputId = useInputId( Edit, props );

	const [ isModalOpen, setModalOpen ] = useState( false );

	const blockProps = useBlockProps( {
		className: 'formello',
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
					id={ inputId }
					name={ name }
					multiple={ multiple }
					readOnly={ readonly }
					disabled={ disabled }
					defaultValue={ selectedOpts() }
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
						onChange={ ( val ) => setAttributes( { val } ) }
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
