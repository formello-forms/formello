import {
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

	const updateSetting = ( group, field, value ) => {
		var newSettings = Object.assign( {}, props.getSetting( 'validation_messages', group ) );
		newSettings[ field ] = value;
		props.changeSettings( 'validation_messages', group, newSettings )
	};

    return (
    	<Fragment>
		<PanelBody
			initialOpen={ true }
			title={ __( 'MIssing Value', 'formello' ) }>

			<div className="formello-dashboard-panel-row-wrapper">

				<PanelRow>
					<TextControl
						label={ __( 'Default' ) }
						value={ props.getSetting( 'validation_messages', 'missingValue' ).default }
						onChange={ ( val ) => {
							updateSetting( 'missingValue', 'default', val )
						} }
					/>
					<TextControl
						label={ __( 'Checkbox' ) }
						value={ props.getSetting( 'validation_messages', 'missingValue' ).checkbox }
						onChange={ ( val ) => {
							updateSetting( 'missingValue', 'checkbox', val )
						} }
					/>
					<TextControl
						label={ __( 'Radio' ) }
						value={ props.getSetting( 'validation_messages', 'missingValue' ).radio }
						onChange={ ( val ) => {
							updateSetting( 'missingValue', 'radio', val )
						} }
					/>
					<TextControl
						label={ __( 'Select' ) }
						value={ props.getSetting( 'validation_messages', 'missingValue' ).select }
						onChange={ ( val ) => {
							updateSetting( 'missingValue', 'select', val )
						} }
					/>
					<TextControl
						label={ __( 'Select Multiple' ) }
						value={ props.getSetting( 'validation_messages', 'missingValue' ).['select-multiple'] }
						onChange={ ( val ) => {
							updateSetting( 'missingValue', ['select-multiple'], val )
						} }
					/>
				</PanelRow>

			</div>

		</PanelBody>

		<PanelBody
			initialOpen={ true }
			title={ __( 'Pattern Mismatch', 'formello' ) }>

			<div className="formello-dashboard-panel-row-wrapper">

				<PanelRow>
					<TextControl
						label={ __( 'Email' ) }
						value={ props.getSetting( 'validation_messages', 'patternMismatch' ).email }
						onChange={ ( val ) => {
							updateSetting( 'patternMismatch', 'email', val )
						} }
					/>
					<TextControl
						label={ __( 'Url' ) }
						value={ props.getSetting( 'validation_messages', 'patternMismatch' ).url }
						onChange={ ( val ) => {
							updateSetting( 'patternMismatch', 'url', val )
						} }
					/>
					<TextControl
						label={ __( 'Number' ) }
						value={ props.getSetting( 'validation_messages', 'patternMismatch' ).number }
						onChange={ ( val ) => {
							updateSetting( 'patternMismatch', 'number', val )
						} }
					/>
					<TextControl
						label={ __( 'Color' ) }
						value={ props.getSetting( 'validation_messages', 'patternMismatch' ).color }
						onChange={ ( val ) => {
							updateSetting( 'patternMismatch', 'color', val )
						} }
					/>
					<TextControl
						label={ __( 'Date' ) }
						value={ props.getSetting( 'validation_messages', 'patternMismatch' ).date }
						onChange={ ( val ) => {
							updateSetting( 'patternMismatch', 'date', val )
						} }
					/>
					<TextControl
						label={ __( 'Time' ) }
						value={ props.getSetting( 'validation_messages', 'patternMismatch' ).time }
						onChange={ ( val ) => {
							updateSetting( 'patternMismatch', 'time', val )
						} }
					/>
					<TextControl
						label={ __( 'Month' ) }
						value={ props.getSetting( 'validation_messages', 'patternMismatch' ).month }
						onChange={ ( val ) => {
							updateSetting( 'patternMismatch', 'month', val )
						} }
					/>
					<TextControl
						label={ __( 'Default' ) }
						value={ props.getSetting( 'validation_messages', 'patternMismatch' ).default }
						onChange={ ( val ) => {
							updateSetting( 'patternMismatch', 'default', val )
						} }
					/>
				</PanelRow>

			</div>

		</PanelBody>

		<PanelBody
			initialOpen={ true }
			title={ __( 'Out of Range', 'formello' ) }>

			<div className="formello-dashboard-panel-row-wrapper">

				<PanelRow>
					<TextControl
						label={ __( 'Over Range' ) }
						value={ props.getSetting( 'validation_messages', 'outOfRange' ).over }
						onChange={ ( val ) => {
							updateSetting( 'outOfRange', 'over', val )
						} }
					/>
					<TextControl
						label={ __( 'Under Range' ) }
						value={ props.getSetting( 'validation_messages', 'outOfRange' ).under }
						onChange={ ( val ) => {
							updateSetting( 'outOfRange', 'under', val )
						} }
					/>
				</PanelRow>

			</div>

		</PanelBody>

		<PanelBody
			initialOpen={ true }
			title={ __( 'Wrong Length', 'formello' ) }>

			<div className="formello-dashboard-panel-row-wrapper">

				<PanelRow>
					<TextControl
						label={ __( 'Over Length' ) }
						value={ props.getSetting( 'validation_messages', 'wrongLength' ).over }
						onChange={ ( val ) => {
							updateSetting( 'wrongLength', 'over', val )
						} }
					/>
					<TextControl
						label={ __( 'Under Length' ) }
						value={ props.getSetting( 'validation_messages', 'wrongLength' ).under }
						onChange={ ( val ) => {
							updateSetting( 'wrongLength', 'under', val )
						} }
					/>
				</PanelRow>

			</div>

		</PanelBody>

		</Fragment>
    );

};
