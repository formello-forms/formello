import { Card, CardHeader, CardBody, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useSelect, dispatch } from '@wordpress/data';

import { __ } from '@wordpress/i18n';

export default function Messages() {
	const settings = useSelect(
		( select ) => select( 'formello/data' ).getSettings(),
		[]
	);

	const updateSetting = ( group, field, value ) => {
		const newSettings = Object.assign( {}, settings.messages[ group ] );
		newSettings[ field ] = value;
		dispatch( 'formello/data' ).setSettingGroup(
			'messages',
			group,
			newSettings
		);
	};

	const missingValue = Object.keys( settings.messages.missingValue );
	const patternMismatch = Object.keys( settings.messages.patternMismatch );
	const outOfRange = Object.keys( settings.messages.outOfRange );
	const wrongLength = Object.keys( settings.messages.wrongLength );

	return (
		<Fragment>
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
										settings.messages.missingValue[ oneKey ]
									}
									onChange={ ( val ) => {
										updateSetting(
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
									settings.messages.patternMismatch[ oneKey ]
								}
								onChange={ ( val ) => {
									updateSetting(
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
								value={ settings.messages.outOfRange[ oneKey ] }
								onChange={ ( val ) => {
									updateSetting( 'outOfRange', oneKey, val );
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
								value={ settings.messages.wrongLength[ oneKey ] }
								onChange={ ( val ) => {
									updateSetting( 'wrongLength', oneKey, val );
								} }
							/>
						);
					} ) }
				</CardBody>
			</Card>
		</Fragment>
	);
}
