import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	BlockControls,
	InspectorAdvancedControls,
	RichText,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';

import { SelectControl, ToggleControl, ToolbarDropdownMenu, ToolbarGroup } from '@wordpress/components';
import { useState } from '@wordpress/element';

import classnames from 'classnames';
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

export default function Edit( { attributes, setAttributes } ) {
	const { style, type, alignment } = attributes;

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

	const [ showIcon, setShowIcon ] = useState( false );

	const borderRadius = style?.border?.radius;
	const borderProps = useBorderProps( attributes );

	// not already merged in Gutenberg
	// const spacingProps = useSpacingProps( attributes );

	// Check for old deprecated numerical border radius. Done as a separate
	// check so that a borderRadius style won't overwrite the longhand
	// per-corner styles.
	if ( typeof borderRadius === 'number' ) {
		borderProps.style.borderRadius = `${ borderRadius }px`;
	}

	const colorProps = useColorProps( attributes );

	const buttonClasses = classnames(
		'wp-element-button',
		borderProps.className,
		colorProps.className,
		alignment,
		{
			'wp-block-formello-button--loading': showIcon,
		}
	);

	const blockProps = useBlockProps( {
		className: buttonClasses,
	} );

	return (
		<button { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={ 'align-' + alignment }
						label={ __( 'Align' ) }
						controls={ ALIGNMENT_CONTROLS.map( ( control ) => {
							const { align } = control;
							const isActive = align === alignment;

							return {
								...control,
								isActive,
								onClick: () => setAttributes( { alignment: align } ),
							};
						} ) }
					/>
				</ToolbarGroup>
			</BlockControls>
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
					options={
						Object.keys( icons ).map( ( icon ) => {
							return { label: icon, value: icon };
						} )
					}
					/*options={ [
						{ label: 'Version 1', value: 'Loading' },
						{ label: 'Version 2', value: 'Loading2' },
						{ label: 'Pulse', value: 'Pulse' },
						{ label: 'Version 4', value: 'Loading4' },
						{ label: 'Version 5', value: 'Loading5' },
						{ label: 'Loading Circles', value: 'LoadingCircles' },
						{ label: 'Loading Circle Path', value: 'LoadingCirclePath' },
						{ label: 'Audio', value: 'Audio' },
						{ label: 'BallTriangle', value: 'BallTriangle' },
						{ label: 'Bars', value: 'Bars' },
						{ label: 'Circles', value: 'Circles' },
						{ label: 'Grid', value: 'Grid' },
						{ label: 'Puff', value: 'Puff' },
						{ label: 'ThreeDots', value: 'ThreeDots' },
					] }*/
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
			/>
			<ButtonIcon />
		</button>
	);
}
