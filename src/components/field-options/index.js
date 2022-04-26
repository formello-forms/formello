/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	FormTokenField,
	ToggleControl,
	BaseControl,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import MergeTags from '../merge-tags';

import { SUPPORTED_ATTRIBUTES } from './constants';

export default function Options(props) {
	const { attributes, setAttributes, clientId } = props;

	const supported = SUPPORTED_ATTRIBUTES[attributes.type];

	return (
		<Fragment>
			<PanelBody title={__('Options', 'formello')} initialOpen={true}>
				<BaseControl>
					<InputControl
						label={__('Name', 'formello')}
						value={attributes.name}
						onChange={(val) =>
							setAttributes({ name: val.toLowerCase() })
						}
					/>
				</BaseControl>
				{supported.includes('value') && (
					<MergeTags
						className={'formello-flex'}
						noFields={true}
						clientId={clientId}
						label={__('Value', 'formello')}
						value={attributes.value}
						onChange={(val) => {
							setAttributes({ value: val });
						}}
					/>
				)}
				{supported.includes('placeholder') && (
					<BaseControl>
						<InputControl
							label={__('Placeholder', 'formello')}
							value={attributes.placeholder}
							onChange={(val) =>
								setAttributes({ placeholder: val })
							}
						/>
					</BaseControl>
				)}
				{supported.includes('required') && (
					<Fragment>
						<ToggleControl
							label={__('Required', 'formello')}
							checked={attributes.required}
							onChange={(newval) =>
								setAttributes({ required: newval })
							}
						/>
					</Fragment>
				)}
				{'select' === attributes.type && (
					<Fragment>
						<ToggleControl
							label={__('Allow multiple choices?', 'formello')}
							checked={attributes.multiple}
							onChange={(val) =>
								setAttributes({
									multiple: val,
								})
							}
						/>
						<FormTokenField
							label={__('Selected option', 'formello')}
							value={
								attributes.selectedOpt &&
								attributes.selectedOpt.map((item) => {
									return item.label;
								})
							}
							onChange={(opts) => {
								const selections = attributes.options.filter(
									(x) => opts.includes(x.label)
								);
								setAttributes({ selectedOpt: selections });
							}}
							suggestions={
								attributes.options &&
								attributes.options.map((item) => {
									return item.label;
								})
							}
							maxSuggestions={3}
							maxLength={() => (attributes.multiple ? 20 : 1)}
						/>
					</Fragment>
				)}
				{supported.includes('checked') && (
					<ToggleControl
						label={__('Checked', 'formello')}
						checked={attributes.checked}
						onChange={(newval) =>
							setAttributes({ checked: newval })
						}
					/>
				)}
				{!('hidden' === attributes.type) && (
					<Fragment>
						<ToggleControl
							label={__('Show Description', 'formello')}
							checked={attributes.showHelp}
							onChange={(newval) =>
								setAttributes({ showHelp: newval })
							}
						/>
					</Fragment>
				)}
			</PanelBody>
		</Fragment>
	);
}
