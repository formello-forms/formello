/**
 * Internal dependencies.
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import classnames from 'classnames';
import { pickBy, isEqual, isObject, identity, mapValues } from 'lodash';

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
		'formello-checkbox': ( 'checkbox' == attributes.type || 'radio' == attributes.type ),
		'hide': 'hidden' == attributes.type
	} )

	let labelClassName = classnames( attributes.labelClass, attributes.labelAlign, attributes.labelVAlign, {
		'hide': attributes.label.length < 1,
	} )

	let fieldClass = classnames( attributes.fieldClass, {
		'formello-date': attributes.type == 'date',
		'formello-time': attributes.type == 'time'
	} )

	const htmlAttrs = pickBy( attributes, identity);
	htmlAttrs.className = fieldClass ? fieldClass : undefined;

	if( attributes.validation ){
		htmlAttrs['data-bouncer-message'] = attributes.validation
	}

	if( attributes.noWrapper ){
		return <input {...htmlAttrs}/>
	}

	return (
		<div className={ className }>
			{ !(attributes.type == 'hidden') && (
			<label
				className={ labelClassName }
				htmlFor={ attributes.id }
			>
				{ attributes.label }
				{ attributes.required && !attributes.hideRequired && (
					<span className='required'>*</span>
				) }
				{ ( attributes.hasTooltip && attributes.tooltip.length > 0 ) && <span className='tooltip'>?<span className="tooltiptext">{ attributes.tooltip }</span></span> }
			</label>
			) }
			{ attributes.type == 'textarea' ? (
				<textarea {...htmlAttrs} >
					{ attributes.value }
				</textarea>
			) : (
				<input {...htmlAttrs} />
			) }
			{
				attributes.showHelp && 
				<RichText.Content tagName="small" value={ attributes.help } />
			}
		</div>
	);
}
