import { __ } from '@wordpress/i18n';

import {
	TextControl,
	PanelBody,
	ToggleControl,
	Button,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import {
	InspectorControls,
	BlockControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { OptionsModal } from '../select/modal';
import Toolbar from '../../components/field-options/toolbar';
import clsx from 'clsx';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { name, required, options, type } = attributes;
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const containerClass = clsx( {
		'missing-name': ! name,
	} );
	const blockProps = useBlockProps( {
		className: containerClass,
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: false,
		templateLock: false,
	} );

	return (
		<div { ...innerBlocksProps }>
			<InspectorControls>
				<BlockControls>
					<ToolbarGroup>
						<Toolbar { ...props } />
						<ToolbarButton
							label={ __( 'Edit options', 'formello' ) }
							icon={ 'editor-ul' }
							onClick={ () => {
								setIsModalOpen( true );
							} }
						/>
					</ToolbarGroup>
				</BlockControls>
				<PanelBody
					title={ __( 'Options', 'formello' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Name', 'formello' ) }
						value={ name }
						onChange={ ( newval ) =>
							setAttributes( { name: newval } )
						}
						help={ __(
							'Affects the "name" attribute of the input element, and is used as a name for the form submission results.',
							'formello'
						) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label={ __( 'Required', 'formello' ) }
						checked={ required }
						onChange={ () =>
							setAttributes( { required: ! required } )
						}
						__nextHasNoMarginBottom
					/>
					<Button
						variant={ 'primary' }
						onClick={ () => {
							setIsModalOpen( true );
						} }
					>
						{ __( 'Manage Options', 'formello' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			{ isModalOpen && (
				<OptionsModal
					{ ...props }
					onRequestClose={ () => {
						setIsModalOpen( false );
					} }
				/>
			) }
			{ options.map( ( opt, index ) => {
				const id = name + '-' + index;
				return (
					<div key={ index } className={ 'wp-block-formello-input' }>
						<label htmlFor={ id }>{ opt.label }</label>
						<input
							value={ opt.value || opt.label }
							name={ name }
							type={ type }
							required={ required }
							checked={ opt.selected }
							id={ id }
							readOnly
						/>
					</div>
				);
			} ) }
		</div>
	);
}
