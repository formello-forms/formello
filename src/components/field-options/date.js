import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { SelectControl, ToggleControl } from '@wordpress/components';

export default function DatepickerSettings( props ) {
	const {
		attributes: {
			advanced,
			type,
			dateFormat,
			timeFormat,
			enableTime,
			inlineCalendar,
			mode,
			minDate,
		},
		setAttributes,
	} = props;

	return (
		<Fragment>
			{ advanced && 'date' === type && (
				<Fragment>
					<ToggleControl
						label={ __( 'Minimum date from today', 'formello' ) }
						checked={ 'today' === minDate }
						onChange={ ( val ) => {
							setAttributes( { minDate: val ? 'today' : false } );
						} }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Date Format', 'formello' ) }
						value={ dateFormat }
						options={ [
							{ label: '2022-04-26', value: 'Y-m-d' },
							{ label: '04/26/2022', value: 'm/d/Y' },
							{ label: '26/04/2022', value: 'd/m/Y' },
						] }
						onChange={ ( val ) => {
							setAttributes( { dateFormat: val } );
						} }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Enable time', 'formello' ) }
						checked={ enableTime }
						onChange={ ( val ) => {
							setAttributes( { enableTime: val } );
						} }
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Mode', 'formello' ) }
						value={ mode }
						options={ [
							{ label: 'Single', value: 'single' },
							{ label: 'Multiple', value: 'multiple' },
							{ label: 'Range', value: 'range' },
						] }
						onChange={ ( val ) => setAttributes( { mode: val } ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Inline calendar', 'formello' ) }
						checked={ inlineCalendar }
						onChange={ ( val ) =>
							setAttributes( { inlineCalendar: val } )
						}
						__nextHasNoMarginBottom
					/>
				</Fragment>
			) }
		</Fragment>
	);
}
