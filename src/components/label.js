import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import classnames from 'classnames';

export default function Label(props) {
	const { attributes, setAttributes } = props;

	const labelClassName = classnames(
		attributes.labelClass,
		attributes.labelAlign,
		attributes.labelVAlign,
		{
			hide: attributes.hideLabel,
			required: attributes.required,
			'textarea-label':
				attributes.multiple || 'textarea' === attributes.type,
		}
	);

	return (
		<label className={labelClassName}>
			<RichText
				tagName="span"
				value={attributes.label}
				onChange={(val) => setAttributes({ label: val })}
				placeholder={__('Enter label…', 'formello')}
			/>

			{attributes.required && !attributes.hideRequired && (
				<span className="required">{attributes.requiredText}</span>
			)}
		</label>
	);
}
