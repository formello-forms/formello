import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	BlockControls,
	InspectorAdvancedControls,
	RichText,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';

import {
	SelectControl,
	ToggleControl,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import clsx from 'clsx';
import {
	Loading,
	Loading2,
	Pulse,
	Loading4,
	LoadingCircles,
	LoadingCirclePath,
	Audio,
	BallTriangle,
	Bars,
	Circles,
	Grid,
	ThreeDots,
} from '../../icons/loading';

const ALIGNMENT_CONTROLS = [
	{
		icon: 'align-left',
		title: __( 'Align Left', 'formello' ),
		align: 'left',
	},
	{
		icon: 'align-center',
		title: __( 'Align Center', 'formello' ),
		align: 'center',
	},
	{
		icon: 'align-right',
		title: __( 'Align Right', 'formello' ),
		align: 'right',
	},
	{
		icon: 'align-wide',
		title: __( 'Wide', 'formello' ),
		align: 'wide',
	},
];

export default function Edit( { attributes, setAttributes } ) {
	const { style, type, alignment, noWrapper } = attributes;

	const icons = {
		Loading,
		Loading2,
		Pulse,
		Loading4,
		LoadingCircles,
		LoadingCirclePath,
		Audio,
		BallTriangle,
		Bars,
		Circles,
		Grid,
		ThreeDots,
	};

	const ButtonIcon = icons[ type ];

	const [ showIcon, setShowIcon ] = useState( false );

	// not already merged in Gutenberg
	// const spacingProps = useSpacingProps( attributes );

	const colorProps = useColorProps( attributes );
	const borderProps = useBorderProps( attributes );

	const buttonClasses = clsx(
		'wp-element-button',
		borderProps.className,
		colorProps.className,
		{
			'wp-block-formello-button--loading': showIcon,
		}
	);

	const blockProps = useBlockProps( {
		className: alignment,
	} );

	return (
		<div { ...blockProps }>
			<button className={ buttonClasses }>
				{ ! noWrapper && (
					<BlockControls>
						<ToolbarGroup>
							<ToolbarDropdownMenu
								icon={ 'align-' + alignment }
								label={ __( 'Align' ) }
								controls={ ALIGNMENT_CONTROLS.map(
									( control ) => {
										const { align } = control;
										const isActive = align === alignment;

										return {
											...control,
											isActive,
											onClick: () =>
												setAttributes( {
													alignment: align,
												} ),
										};
									}
								) }
							/>
						</ToolbarGroup>
					</BlockControls>
				) }
				<InspectorAdvancedControls>
					<ToggleControl
						label={ __( 'Show Icon', 'formello' ) }
						checked={ showIcon }
						onChange={ ( val ) => {
							setShowIcon( val );
						} }
					/>
					<SelectControl
						label={ __( 'Icon type', 'formello' ) }
						value={ attributes.type }
						options={ Object.keys( icons ).map( ( icon ) => {
							return { label: icon, value: icon };
						} ) }
						onChange={ ( val ) => {
							setAttributes( { type: val } );
						} }
					/>
				</InspectorAdvancedControls>
				<RichText
					tagName="span"
					value={ attributes.text }
					onChange={ ( val ) => setAttributes( { text: val } ) }
					placeholder={ __( 'Enter button text…', 'formello' ) }
					allowedFormats={ [ 'core/bold' ] }
					className="buttonClasses"
				/>
				<ButtonIcon />
			</button>
		</div>
	);
}
