import {
	Card,
	CardHeader,
	CardBody,
	TextControl,
	PanelRow,
	PanelBody,
	Button,
	RadioControl,
	SelectControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

export default function messages( props ) {

	const {
		getSetting,
		changeSettings
	} = props;

	const updateSetting = ( group, field, value ) => {
		var newSettings = Object.assign( {}, getSetting( 'messages', group ) );
		newSettings[ field ] = value;
		changeSettings( 'messages', group, newSettings )
	};

	return (
		<Fragment>

		<Card>

			<CardHeader>
				<h2>{ __( 'Missing value', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>

				<TextControl
					label={ __( 'Default' ) }
					value={ getSetting( 'messages', 'missingValue' ).default }
					onChange={ ( val ) => {
						updateSetting( 'missingValue', 'default', val )
					} }
				/>
				<TextControl
					label={ __( 'Checkbox' ) }
					value={ getSetting( 'messages', 'missingValue' ).checkbox }
					onChange={ ( val ) => {
						updateSetting( 'missingValue', 'checkbox', val )
					} }
				/>
				<TextControl
					label={ __( 'Radio' ) }
					value={ getSetting( 'messages', 'missingValue' ).radio }
					onChange={ ( val ) => {
						updateSetting( 'missingValue', 'radio', val )
					} }
				/>
				<TextControl
					label={ __( 'Select' ) }
					value={ getSetting( 'messages', 'missingValue' ).select }
					onChange={ ( val ) => {
						updateSetting( 'missingValue', 'select', val )
					} }
				/>
				<TextControl
					label={ __( 'Select Multiple' ) }
					value={ getSetting( 'messages', 'missingValue' )['select-multiple'] }
					onChange={ ( val ) => {
						updateSetting( 'missingValue', ['select-multiple'], val )
					} }
				/>

			</CardBody>

		</Card>

		<Card>

			<CardHeader>
				<h2>{ __( 'Pattern mismatch', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>

				<TextControl
					label={ __( 'Email' ) }
					value={ getSetting( 'messages', 'patternMismatch' ).email }
					onChange={ ( val ) => {
						updateSetting( 'patternMismatch', 'email', val )
					} }
				/>
				<TextControl
					label={ __( 'Url' ) }
					value={ getSetting( 'messages', 'patternMismatch' ).url }
					onChange={ ( val ) => {
						updateSetting( 'patternMismatch', 'url', val )
					} }
				/>
				<TextControl
					label={ __( 'Number', 'formello' ) }
					value={ getSetting( 'messages', 'patternMismatch' ).number }
					onChange={ ( val ) => {
						updateSetting( 'patternMismatch', 'number', val )
					} }
				/>
				<TextControl
					label={ __( 'Color', 'formello' ) }
					value={ getSetting( 'messages', 'patternMismatch' ).color }
					onChange={ ( val ) => {
						updateSetting( 'patternMismatch', 'color', val )
					} }
				/>
				<TextControl
					label={ __( 'Date', 'formello' ) }
					value={ getSetting( 'messages', 'patternMismatch' ).date }
					onChange={ ( val ) => {
						updateSetting( 'patternMismatch', 'date', val )
					} }
				/>
				<TextControl
					label={ __( 'Time', 'formello' ) }
					value={ getSetting( 'messages', 'patternMismatch' ).time }
					onChange={ ( val ) => {
						updateSetting( 'patternMismatch', 'time', val )
					} }
				/>
				<TextControl
					label={ __( 'Month', 'formello' ) }
					value={ getSetting( 'messages', 'patternMismatch' ).month }
					onChange={ ( val ) => {
						updateSetting( 'patternMismatch', 'month', val )
					} }
				/>
				<TextControl
					label={ __( 'Default', 'formello' ) }
					value={ getSetting( 'messages', 'patternMismatch' ).default }
					onChange={ ( val ) => {
						updateSetting( 'patternMismatch', 'default', val )
					} }
				/>

			</CardBody>

		</Card>

		<Card>

			<CardHeader>
				<h2>{ __( 'Out of range', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>

				<TextControl
					label={ __( 'Over Range', 'formello' ) }
					value={ getSetting( 'messages', 'outOfRange' ).over }
					onChange={ ( val ) => {
						updateSetting( 'outOfRange', 'over', val )
					} }
				/>
				<TextControl
					label={ __( 'Under Range', 'formello' ) }
					value={ getSetting( 'messages', 'outOfRange' ).under }
					onChange={ ( val ) => {
						updateSetting( 'outOfRange', 'under', val )
					} }
				/>

			</CardBody>

		</Card>

		<Card>

			<CardHeader>
				<h2>{ __( 'Wrong length', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>

				<TextControl
					label={ __( 'Over Length', 'formello' ) }
					value={ getSetting( 'messages', 'wrongLength' ).over }
					onChange={ ( val ) => {
						updateSetting( 'wrongLength', 'over', val )
					} }
				/>
				<TextControl
					label={ __( 'Under Length', 'formello' ) }
					value={ getSetting( 'messages', 'wrongLength' ).under }
					onChange={ ( val ) => {
						updateSetting( 'wrongLength', 'under', val )
					} }
				/>

			</CardBody>

		</Card>

		</Fragment>
	);

};
