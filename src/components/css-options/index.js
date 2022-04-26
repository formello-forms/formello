import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default function DisplayOpts(props) {
	const { attributes, setAttributes } = props;

	return (
		<Fragment>
			<TextControl
				label={__('Label Class', 'formello')}
				value={attributes.labelClass}
				onChange={(val) => setAttributes({ labelClass: val })}
			/>
			<TextControl
				label={__('Field Class', 'formello')}
				value={attributes.fieldClass}
				onChange={(val) => setAttributes({ fieldClass: val })}
			/>
			<TextControl
				label={__('Description Class', 'formello')}
				value={attributes.descriptionClass}
				onChange={(val) => setAttributes({ descriptionClass: val })}
			/>
		</Fragment>
	);
}
