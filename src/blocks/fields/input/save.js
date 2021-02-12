/**
 * Internal dependencies.
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

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

	//className = 'formello';
	if ( 'checkbox' == attributes.type || 'radio' == attributes.type ) {
		attributes.value = attributes.value ? attributes.value : undefined;
	}

	className = classnames( 'formello', {
		'formello-checkbox': ( 'checkbox' == attributes.type || 'radio' == attributes.type ),
		'hide': 'hidden' == attributes.type
	} )

	let labelClassName = classnames( attributes.labelClass, attributes.labelAlign, attributes.labelVAlign )

	return (
		<div className={ className }>
			{ !(attributes.type == 'hidden') && (
			<label
				className={ labelClassName }
				htmlFor={ attributes.id }
			>
				{ attributes.label }
				{ attributes.required && attributes.markRequired && (
					<span className='required'>*</span>
				) }
				{ ( attributes.hasTooltip && attributes.tooltip.length > 0 ) && <span className='tooltip'>?<span class="tooltiptext">{ attributes.tooltip }</span></span> }
			</label>
			) }
			{ attributes.type == 'textarea' ? (
				<textarea
					className={ attributes.fieldClass }
					name={ attributes.name }
					id={ attributes.id }
					cols={ attributes.cols }
					rows={ attributes.rows }
					minLength={ attributes.minlength }
					maxLength={ attributes.maxlength }
					required={ attributes.required }
					placeholder={ attributes.placeholder }
				>
					{ attributes.value }
				</textarea>
			) : (
				<input
					className={ attributes.fieldClass }
					type={ attributes.type }
					name={ attributes.name }
					id={ attributes.id }
					checked={ attributes.checked }
					min={ attributes.min }
					max={ attributes.max }
					step={ attributes.step }
					minLength={ attributes.minlength }
					maxLength={ attributes.maxlength }
					required={ attributes.required }
					placeholder={ attributes.placeholder }
					value={ attributes.value }
					data-bouncer-message={ attributes.validation }
				/>
			) }
			{
				attributes.showHelp && 
				<RichText.Content tagName="small" value={ attributes.help } />
			}
		</div>
	);
}
