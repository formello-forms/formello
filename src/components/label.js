import { __ } from '@wordpress/i18n';
import { RichText, store as blockEditorStore } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

import clsx from 'clsx';

export default function Label( { attributes, setAttributes, context } ) {
	const {
		labelClass,
		labelAlign,
		labelVAlign,
		hideLabel,
		required,
		multiple,
		type,
		label,
	} = attributes;

	const labelClassName = clsx(
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
				onChange={ ( val ) => {
					setAttributes( { label: val } );
				} }
				placeholder={ __( 'Enter label…', 'formello' ) }
				allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
				disableLineBreaks
			/>

			{ required && (
				<span className="required">
					{ context[ 'formello/requiredText' ] || '*' }
				</span>
			) }
		</div>
	);
}
