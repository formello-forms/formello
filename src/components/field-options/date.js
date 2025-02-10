import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	SelectControl,
	ToggleControl,
	TextControl,
} from '@wordpress/components';

export default function DatepickerSettings( props ) {
	const {
		attributes: { advanced, type, flatpickr },
		setAttributes,
	} = props;

	const handleChange = ( name, value ) => {
		setAttributes( {
			flatpickr: {
				...flatpickr,
				[ name ]: value,
			},
		} );
	};

	return (
		<Fragment>
			{ advanced && 'date' === type && (
				<Fragment>
					<ToggleControl
						label={ __( 'Minimum date from today', 'formello' ) }
						checked={ 'today' === flatpickr?.minDate }
						onChange={ ( val ) =>
							handleChange( 'minDate', val ? 'today' : false )
						}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Date Format', 'formello' ) }
						value={ flatpickr?.dateFormat }
						onChange={ ( val ) =>
							handleChange( 'dateFormat', val )
						}
						options={ [
							{ label: '2022-04-26', value: 'Y-m-d' },
							{ label: '04/26/2022', value: 'm/d/Y' },
							{ label: '26/04/2022', value: 'd/m/Y' },
						] }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<SelectControl
						label={ __( 'Mode', 'formello' ) }
						value={ flatpickr?.mode }
						onChange={ ( val ) => handleChange( 'mode', val ) }
						options={ [
							{ label: 'Single', value: 'single' },
							{ label: 'Multiple', value: 'multiple' },
							{ label: 'Range', value: 'range' },
						] }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<ToggleControl
						label={ __( 'Inline calendar', 'formello' ) }
						checked={ flatpickr?.inline }
						onChange={ ( val ) => handleChange( 'inline', val ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Enable time', 'formello' ) }
						checked={ flatpickr?.enableTime }
						onChange={ ( val ) =>
							handleChange( 'enableTime', val )
						}
						__nextHasNoMarginBottom
					/>
				</Fragment>
			) }
			{ ( ( advanced && 'time' === type ) || flatpickr?.enableTime ) && (
				<Fragment>
					<ToggleControl
						label={ __( '24 hr format', 'formello' ) }
						checked={ flatpickr?.time_24hr }
						onChange={ ( val ) => {
							handleChange( 'time_24hr', val );
						} }
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={ __( 'Min time', 'formello' ) }
						value={ flatpickr?.minTime }
						onChange={ ( val ) => handleChange( 'minTime', val ) }
						type="time"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={ __( 'Max time', 'formello' ) }
						value={ flatpickr?.maxTime }
						onChange={ ( val ) => handleChange( 'maxTime', val ) }
						type="time"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TextControl
						label={ __( 'Minute increment', 'formello' ) }
						value={ flatpickr?.minuteIncrement }
						onChange={ ( val ) =>
							handleChange( 'minuteIncrement', val )
						}
						type="number"
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</Fragment>
			) }
		</Fragment>
	);
}
