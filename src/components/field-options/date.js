import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import {
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

export default function DatepickerSettings(props) {
	const {
		attributes: { flatpickr, advancedDate },
		setAttributes,
	} = props;

	const change = (key, val) => {
		setAttributes({
			flatpickr: {
				...flatpickr,
				[key]: val,
			},
		});
	};

	const setFormat = () => {
		let format = dateFormat;
		if (timeEnabled) {
			format += ' ' + timeFormat;
		}
		change('date-format', format);
	};

	const [dateFormat, setDateFormat] = useState('Y-m-d');
	const [timeFormat, setTimeFormat] = useState('H:i');
	const [timeEnabled, setTimeEnabled] = useState(flatpickr['enable-time']);

	useEffect(() => {
		setFormat();
	}, [dateFormat, timeFormat, timeEnabled]);

	return (
		<Fragment>
			{advancedDate && (
				<Fragment>
					<ToggleControl
						label={__('Minimum date from today', 'formello')}
						checked={'today' === flatpickr['min-date']}
						onChange={(val) => {
							change('min-date', val ? 'today' : '');
						}}
					/>
					<SelectControl
						label={__('Date Format', 'formello')}
						value={flatpickr['date-format']}
						options={[
							{ label: '2022-04-26', value: 'Y-m-d' },
							{ label: '04/26/2022', value: 'm/d/Y' },
							{ label: '26/04/2022', value: 'd/m/Y' },
						]}
						onChange={(val) => {
							setDateFormat(val);
						}}
					/>
					<TextControl
						label={__('Custom Date Format', 'formello')}
						value={flatpickr['date-format'] || 'Y-m-d'}
						onChange={(val) => {
							change('date-format', val);
						}}
					/>
					<ToggleControl
						label={__('Enable time', 'formello')}
						checked={flatpickr['enable-time']}
						onChange={(val) => {
							setTimeEnabled(val);
							change('enable-time', val);
						}}
					/>
					{flatpickr['enable-time'] && (
						<Fragment>
							<TextControl
								label={__('Time Format', 'formello')}
								value={timeFormat}
								onChange={(val) => {
									setTimeFormat(val);
								}}
							/>
							<ToggleControl
								label={__('Enable seconds', 'formello')}
								checked={flatpickr['enable-seconds']}
								onChange={(val) => {
									setTimeFormat(timeFormat + ':s');
									change('enable-seconds', val);
								}}
							/>
						</Fragment>
					)}
					<SelectControl
						label={__('Mode', 'formello')}
						value={flatpickr.mode}
						options={[
							{ label: 'Single', value: 'single' },
							{ label: 'Multiple', value: 'multiple' },
							{ label: 'Range', value: 'range' },
						]}
						onChange={(val) => change('mode', val)}
					/>
					<ToggleControl
						label={__('Inline calendar', 'formello')}
						checked={flatpickr.inline}
						onChange={(val) => change('inline', val)}
					/>
				</Fragment>
			)}
		</Fragment>
	);
}
