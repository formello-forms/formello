const { __ } = wp.i18n;
import { SelectControl, PanelBody, Disabled, Toolbar, ToolbarButton, ToolbarGroup, Placeholder, Button } from '@wordpress/components';
import { useEffect, useState, Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import {
	useBlockProps,
	InspectorControls,
	BlockControls
} from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { TemplatesModal } from '../form/library';

export default function Edit ( props ) {

	const { attributes, setAttributes, clientId } = props;

	const [ options, setOptions ] = useState( [ { label: 'Select a form', value: 0 } ] );
	const blockProps = useBlockProps();
	const [ isModalOpen, setModalOpen ] = useState( false );

	useEffect(
	  	() => {
			apiFetch( {
				path: '/wp/v2/formello_form',
				method: 'GET',
			} ).then( ( result ) => {
			    const forms = result.map( f => {
					return {
						label: f.title.rendered,
						value: f.id
					}
			    })
			    setOptions( options.concat(forms) )
			} );
	  	},
	  []
	);

	let blockContent = (<p>{ __( 'Please, select a form to show', 'formello' ) }</p>);

    if ( attributes.id ) {
        blockContent = <ServerSideRender
	            block="formello/form-reusable"
	            attributes={ attributes }
	        />
    }

	return (
		<div {...blockProps}>
			{	attributes.id > 0 &&
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Edit this form', 'formello' ) }
							icon="edit"
							onClick={ () => window.open( formello.formURL + attributes.id + '&action=edit', '_blank' ) }
						/>
					</ToolbarGroup>
				</BlockControls>
			}
			<InspectorControls>
				<PanelBody title="Form Settings" initialOpen={ true }>
					<SelectControl
				        label={ __( 'Choose a form', 'formello' ) }
				        value={ attributes.id }
				        options={ options }
				        onChange={ ( val ) => { 
							setAttributes( { id: parseInt( val ) } )
				        } }
					/>
				</PanelBody>
			</InspectorControls>
            <Fragment>
            	{ 
            		attributes.id > 0 ?
            		<Disabled>
            			{ blockContent }
            		</Disabled>
            	:
					<Placeholder label={ __( 'Insert a form', 'formello' ) }>
					{
						'widgets' === pagenow ?
						<SelectControl
					        label={ __( 'Choose a form', 'formello' ) }
					        value={ attributes.id }
					        options={ options }
					        onChange={ ( val ) => { 
								setAttributes( { id: parseInt( val ) } )
					        } }
						/>
						:
					    <>
							<Button
								className="plugin-formello-panel-button is-large"
								isPrimary
								onClick={ () => {
								setModalOpen( 'templates' );
							} }
							>
								{ __( 'Open Library', 'formello' ) }
							</Button> 
							<Button isSecondary href={ formello.templatesURL }>{ __( 'Create new form', 'formello' ) }</Button>
			    		</>

					}
					</Placeholder>
            	}
            </Fragment>
			{ 'templates' === isModalOpen &&
				<TemplatesModal
					onRequestClose={ ( id ) => { 
						setModalOpen( false )
						if( 'number' === typeof id ){
							setAttributes( { id: id } )
						}
					} }
					clientId={ clientId }
					type={ 'local' }
				/>
			}
		</div>
	)
}



