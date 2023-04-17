import { __ } from '@wordpress/i18n';
import {
	SelectControl,
	PanelBody,
	Disabled,
	ToolbarButton,
	ToolbarGroup,
	Placeholder,
	Button,
} from '@wordpress/components';
import { useEffect, useState, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { addQueryArgs } from '@wordpress/url';
import TemplatesModal from './templates-modal.js';

export default function Edit( props ) {
	const { attributes, setAttributes, clientId } = props;

	const [ options, setOptions ] = useState( [
		{ label: 'Select a form', value: 0 },
	] );
	const blockProps = useBlockProps();
	const [ isModalOpen, setModalOpen ] = useState( false );

	useEffect( () => {
		apiFetch( {
			path: '/wp/v2/formello_form',
			method: 'GET',
		} ).then( ( result ) => {
			const forms = result.map( ( f ) => {
				return {
					label: f.title.rendered,
					value: f.id,
				};
			} );
			setOptions( options.concat( forms ) );
		} );
	}, [] );

	const editUrl = addQueryArgs( 'post.php', {
		post: attributes.id,
		action: 'edit',
	} );

	const templatesUrl = addQueryArgs( 'edit.php', {
		post_type: 'formello_form',
	} );

	return (
		<div { ...blockProps }>
			{ attributes.id > 0 && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Template', 'popper' ) }
							icon={ 'layout' }
							onClick={ () => {
								setModalOpen( 'templates' );
							} }
						/>
						<ToolbarButton
							label={ __( 'Edit this form', 'formello' ) }
							icon="edit"
							onClick={ () => window.open( editUrl, '_blank' ) }
						/>
					</ToolbarGroup>
				</BlockControls>
			) }
			<InspectorControls>
				<PanelBody title={ __( 'Form Settings', 'formello' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Choose a form', 'formello' ) }
						value={ attributes.id }
						options={ options }
						onChange={ ( val ) => {
							setAttributes( { id: parseInt( val ) } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			<Fragment>
				{ attributes.id ? (
					<Disabled isDisabled={ true }>
						<ServerSideRender
							block="formello/library"
							attributes={ attributes }
						/>
					</Disabled>
				) : (
					<Placeholder label={ __( 'Insert a form', 'formello' ) }>
						{ 'widgets' === pagenow ? (
							<SelectControl
								label={ __( 'Choose a form', 'formello' ) }
								value={ attributes.id }
								options={ options }
								onChange={ ( val ) => {
									setAttributes( { id: parseInt( val ) } );
								} }
							/>
						) : (
							<Fragment>
								<Button
									isPrimary
									onClick={ () => {
										setModalOpen( 'templates' );
									} }
								>
									{ __( 'Open Library', 'formello' ) }
								</Button>
								<Button
									isSecondary
									href={ templatesUrl }
									target="_blank"
								>
									{ __( 'Create new form', 'formello' ) }
								</Button>
							</Fragment>
						) }
					</Placeholder>
				) }
			</Fragment>
			{ 'templates' === isModalOpen && (
				<TemplatesModal
					blockName={ props.name }
					setIsPatternSelectionModalOpen={ () => setModalOpen( false ) }
					clientId={ clientId }
				/>
			) }
		</div>
	);
}
