import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import classnames from 'classnames';

export default function Label( { attributes, setAttributes } ) {
	const {
		labelClass,
		labelAlign,
		labelVAlign,
		hideLabel,
		required,
		multiple,
		type,
		label,
		requiredText,
	} = attributes;

	const labelClassName = classnames(
		'label-div',
		labelClass,
		labelAlign,
		labelVAlign,
		{
			hide: hideLabel,
			required,
			'textarea-label': multiple || 'textarea' === type,
		}
	);

	return (
		<div className={ labelClassName } htmlFor="input">
			<RichText
				tagName="span"
				value={ label }
				onChange={ ( val ) => setAttributes( { label: val } ) }
				placeholder={ __( 'Enter label…', 'formello' ) }
				allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
			/>

			{ required && <span className="required">{ requiredText }</span> }
		</div>
	);
}
