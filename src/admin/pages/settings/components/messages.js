import { Card, CardHeader, CardBody, TextControl } from '@wordpress/components';
import { Fragment, useContext } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import { SettingsContext } from '../../../context/settings-context';

export default function Messages() {
	const { settings, updateSetting } = useContext( SettingsContext );
	const messages = settings.messages;

	function setMessage( group, field, value ) {
		const newSettings = Object.assign( {}, messages );
		newSettings[ group ][ field ] = value;
		updateSetting( 'messages', newSettings );
	}

	const formMessages = Object.keys( messages.form );
	const missingValue = Object.keys( messages.missingValue );
	const patternMismatch = Object.keys( messages.patternMismatch );
	const outOfRange = Object.keys( messages.outOfRange );
	const wrongLength = Object.keys( messages.wrongLength );

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h2>{ __( 'Form messages', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					{ formMessages.map( ( oneKey, i ) => {
						return (
							<Fragment key={ i }>
								<TextControl
									label={ oneKey }
									value={
										messages.form[ oneKey ]
									}
									onChange={ ( val ) => {
										setMessage(
											'form',
											oneKey,
											val
										);
									} }
								/>
							</Fragment>
						);
					} ) }
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h2>{ __( 'Missing value', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					{ missingValue.map( ( oneKey, i ) => {
						return (
							<Fragment key={ i }>
								<TextControl
									label={ oneKey }
									value={
										messages.missingValue[ oneKey ]
									}
									onChange={ ( val ) => {
										setMessage(
											'missingValue',
											oneKey,
											val
										);
									} }
								/>
							</Fragment>
						);
					} ) }
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h2>{ __( 'Pattern mismatch', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					{ patternMismatch.map( ( oneKey, i ) => {
						return (
							<TextControl
								key={ i }
								label={ oneKey }
								value={
									messages.patternMismatch[ oneKey ]
								}
								onChange={ ( val ) => {
									setMessage(
										'patternMismatch',
										oneKey,
										val
									);
								} }
							/>
						);
					} ) }
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h2>{ __( 'Out of range', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					{ outOfRange.map( ( oneKey, i ) => {
						return (
							<TextControl
								key={ i }
								label={ oneKey }
								value={ messages.outOfRange[ oneKey ] }
								onChange={ ( val ) => {
									setMessage( 'outOfRange', oneKey, val );
								} }
							/>
						);
					} ) }
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h2>{ __( 'Wrong length', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					{ wrongLength.map( ( oneKey, i ) => {
						return (
							<TextControl
								key={ i }
								label={ oneKey }
								value={ messages.wrongLength[ oneKey ] }
								onChange={ ( val ) => {
									setMessage( 'wrongLength', oneKey, val );
								} }
							/>
						);
					} ) }
				</CardBody>
			</Card>
		</Fragment>
	);
}
