import getIcon from '../../utils/get-icon';
const { __ } = wp.i18n;
import { registerBlockType } from '@wordpress/blocks';
import { SelectControl, PanelBody, Disabled } from '@wordpress/components';
import { useEffect, useState, Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import {
	useBlockProps,
	InspectorControls
} from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';

registerBlockType('formello/form-reusable', {
	title: __('Formello reusable Form'),
	description: __('Block showing a Formello form'),
	category: 'formello',
	attributes: {
		id: {
			type: 'string'
		}
	},
  supports: {
	html: false
  },
  icon: getIcon('form'),

  edit: function ( { attributes, setAttributes } ) {

	const [ options, setOptions ] = useState( [ { label: 'Select a form', value: 0 } ] );
	const blockProps = useBlockProps();

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

	let blockContent = <p>{ __( 'Please, select a form to show' ) }</p>;

    if ( parseInt( attributes.id ) > 0 ) {
        blockContent = <ServerSideRender
            block="formello/form-reusable"
            attributes={ attributes }
        />;
    }

	return (
			<div {...blockProps}>
				<InspectorControls>
					<PanelBody title="Form Settings" initialOpen={ true }>
						<SelectControl
					        label={ __( 'Choose a form', 'formello' ) }
					        value={ attributes.id }
					        options={ options }
					        onChange={ ( val ) => { setAttributes( { id: val } ) } }
						/>
					</PanelBody>
				</InspectorControls>
				<Disabled>
		            <Fragment>
		            	{ blockContent }
		            </Fragment>
	            </Disabled>
			</div>
		)
	},

	save: ( props ) => {
		return null
	}
})