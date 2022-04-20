/**
 * Internal dependencies.
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';
import { pickBy, identity, pick } from 'lodash';
import { InnerBlocks } from '@wordpress/block-editor';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( { attributes, className } ) {

	// if value is empty assign undefined;
	if ( 'checkbox' == attributes.type || 'radio' == attributes.type ) {
		attributes.value = attributes.value ? attributes.value : undefined;
	}

	if ( !attributes.name ) {
		attributes.name = attributes.id
	}

	className = classnames( 'formello', {
		'formello-group': attributes.withButton || attributes.withOutput,
		'formello-group grouped': attributes.grouped,
		'formello-checkbox': ( 'checkbox' == attributes.type || 'radio' == attributes.type ),
	} )

	const labelClassName = classnames( {
		'hide': attributes.hideLabel,
		'textarea-label': 'textarea' === attributes.type,
	} )

	// include only supported attributes
	let htmlAttrs = pick( attributes, SUPPORTED_ATTRIBUTES[attributes.type] );
	// clean empty attributes
	htmlAttrs = pickBy( htmlAttrs, identity );

	if( attributes.validation ){
		htmlAttrs['data-bouncer-message'] = attributes.validation
	}

	if( attributes.withOutput ){
		htmlAttrs['oninput'] = "this.nextElementSibling.value = this.value"
	}

	if( attributes.noWrapper || 'hidden' === attributes.type ){
		return <input {...htmlAttrs}/>
	}

	return (
		<div { ...useBlockProps.save() } className={ className }>
			{ !(attributes.type == 'hidden') && (
			<label
				className={ labelClassName }
				htmlFor={ attributes.id }
			>
				{ attributes.label }
				{ attributes.required && !attributes.hideRequired && (
					<span className='required'>{ attributes.requiredText }</span>
				) }
			</label>
			) }
			{ attributes.type == 'textarea' ? (
				<textarea {...htmlAttrs} >
					{ attributes.value }
				</textarea>
			) : (
				<input {...htmlAttrs} />
			) }
			{ attributes.withButton &&
				<InnerBlocks.Content />
			}
			{ attributes.withOutput && 
				<output></output>
			}
			{
				('hidden' !== attributes.type && attributes.showHelp ) && 
				<RichText.Content tagName="small" value={ attributes.help } />
			}
		</div>
	);
}
