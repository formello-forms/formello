/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
//import './editor.scss';

import {
	InspectorControls,
	InspectorAdvancedControls,
	InnerBlocks,
	BlockControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	SelectControl,
	Panel,
	Tooltip,
	PanelBody,
	TextareaControl,
	ToolbarButton,
	ToolbarGroup,
	Flex,
	FlexItem,
	FlexBlock,
	Button,
	FormTokenField,
	Draggable,
} from '@wordpress/components';

import { useState, useEffect, Fragment } from '@wordpress/element';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';

const { createBlock, cloneBlock } = wp.blocks;

import OptionsList from './opts';
import { OptionsModal } from './modal';
import classnames from 'classnames';
import Label from '../../components/label';
import getIcon from '../../utils/get-icon';
import Toolbar from '../../components/field-options/toolbar';
import Options from '../../components/field-options';
import AdvancedOptions from '../../components/field-options/advanced';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;

	useEffect(
		() =>
			setAttributes({
				id: 'field_' + clientId.substr(2, 9).replace('-', ''),
			}),
		[]
	);

	const [options, setOptions] = useState(attributes.options);
	const [isModalOpen, setModalOpen] = useState(false);

	const addNewRow = (e) => {
		setAttributes({
			options: [...attributes.options, { label: '', value: '' }],
		});
	};

	const deleteRow = (record, index) => {
		let items = [...attributes.options]; // make a separate copy of the array
		items.splice(index, 1);
		setAttributes({ options: items });
	};

	const handleChange = (value, index, prop) => {
		// 1. Make a shallow copy of the items
		let items = [...attributes.options];
		// 2. Make a shallow copy of the item you want to mutate
		let item = { ...attributes.options[index] };
		// 3. Replace the property you're intested in
		item[prop] = value;
		// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
		items[index] = item;
		// 5. Set the state to our new copy
		setAttributes({ options: items });
	};

	const bulkOpts = (val) => {
		let opts = val.match(/[^\r\n]+/g);
		let newSettings = [];
		for (let i in opts) {
			let tmp = opts[i].split(',');
			newSettings.push({ value: tmp[0], label: tmp[1] });
		}
		setAttributes({ options: newSettings });
	};

	const defaultOpts = (options) => {
		if (!options.length) {
			return attributes.multiple ? [] : '';
		}
		options = options.map((opt) => {
			return opt.value;
		});
		if (!attributes.multiple && options.length) {
			options = options[0];
		}
		return options;
	};

	const blockProps = useBlockProps({
		className: 'formello',
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				<BlockControls>
					<ToolbarGroup>
						<Toolbar {...props} />
						<ToolbarButton
							label={__('Add options', 'formello')}
							icon={'editor-ul'}
							onClick={() => {
								setModalOpen(true);
							}}
						/>
					</ToolbarGroup>
				</BlockControls>
				<Options {...props} />
			</InspectorControls>
			<InspectorAdvancedControls>
				<AdvancedOptions {...props} />
			</InspectorAdvancedControls>
			<Fragment>
				<Label {...props} />

				<select
					id={attributes.id}
					name={attributes.name}
					className={attributes.fieldClass}
					multiple={attributes.multiple}
					defaultValue={defaultOpts(attributes.selectedOpt)}
				>
					{attributes.options.map((obj, index) => {
						return (
							<option value={obj.value} key={index}>
								{obj.label}
							</option>
						);
					})}
				</select>
				{attributes.showHelp && (
					<RichText
						tagName="small"
						className={className}
						value={attributes.help}
						onChange={(help) => setAttributes({ help })}
						placeholder={__('Enter help message...', 'formello')}
						allowedFormats={[
							'core/bold',
							'core/italic',
							'core/link',
						]}
					/>
				)}
			</Fragment>
			{isModalOpen && (
				<OptionsModal
					{...props}
					onRequestClose={() => {
						setModalOpen(false);
					}}
				/>
			)}
		</div>
	);
}
