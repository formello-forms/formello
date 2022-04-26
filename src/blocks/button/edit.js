import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	AlignmentToolbar,
	BlockControls,
	InspectorAdvancedControls,
	useSetting,
	RichText,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUnitControl as UnitControl,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';

import { SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

import classnames from 'classnames';

export default function Edit({ attributes, setAttributes }) {
	const { style } = attributes;

	const ALIGNMENT_CONTROLS = [
		{
			icon: 'editor-alignleft',
			title: __('Align Button Left', 'formello'),
			align: 'left',
		},
		{
			icon: 'editor-aligncenter',
			title: __('Align Button Center', 'formello'),
			align: 'center',
		},
		{
			icon: 'editor-alignright',
			title: __('Align Button Right', 'formello'),
			align: 'right',
		},
		{
			icon: 'align-wide',
			title: __('Wide Button', 'formello'),
			align: 'wide',
		},
	];
	const EMPTY_ARRAY = [];

	const [showIcon, setShowIcon] = useState(false);
	const colors = useSetting('color.palette') || EMPTY_ARRAY;

	const borderRadius = style?.border?.radius;
	const borderColor = style?.border?.color;
	const borderProps = useBorderProps(attributes);

	// not already merged in Gutenberg
	// const spacingProps = useSpacingProps( attributes );

	// Check for old deprecated numerical border radius. Done as a separate
	// check so that a borderRadius style won't overwrite the longhand
	// per-corner styles.
	if (typeof borderRadius === 'number') {
		borderProps.style.borderRadius = `${borderRadius}px`;
	}

	const colorProps = useColorProps(attributes);

	const buttonClasses = classnames(
		borderProps.className,
		colorProps.className,
		attributes.alignment
	);

	const blockProps = useBlockProps({
		className: buttonClasses,
	});

	return (
		<button {...blockProps}>
			<BlockControls>
				<AlignmentToolbar
					value={attributes.alignment}
					alignmentControls={ALIGNMENT_CONTROLS}
					onChange={(nextAlign) => {
						setAttributes({ alignment: nextAlign });
					}}
				/>
			</BlockControls>
			<InspectorAdvancedControls>
				<SelectControl
					label={__('Icon type', 'formello')}
					value={attributes.type}
					options={[
						{ label: 'Version 1', value: 'Loading' },
						{ label: 'Version 2', value: 'Loading2' },
						{ label: 'Version 3', value: 'Loading3' },
						{ label: 'Version 4', value: 'Loading4' },
						{ label: 'Version 5', value: 'Loading5' },
					]}
					onChange={(val) => {
						setAttributes({ type: val });
					}}
				/>
			</InspectorAdvancedControls>
			<RichText
				tagName="span"
				value={attributes.text}
				onChange={(val) => setAttributes({ text: val })}
				placeholder={__('Enter button text…', 'formello')}
				allowedFormats={['core/bold']}
			/>
		</button>
	);
}
