import { Card, CardHeader, CardBody, TextControl } from '@wordpress/components';
import { Fragment, useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';

import { SettingsContext } from '../../../context/settings-context';

export default function Messages() {
	const { settings } = useContext( SettingsContext );
	const { editEntityRecord } = useDispatch( coreStore );

	const setMessage = ( group, field, value ) => {
		editEntityRecord( 'root', 'site', undefined, {
			formello: {
				...settings,
				messages: {
					...settings.messages,
					[ group ]: {
						...settings.messages[ group ],
						[ field ]: value,
					},
				},
			},
		} );
	};

	const formMessages = Object.keys( settings.messages.form );
	const missingValue = Object.keys( settings.messages.missingValue );
	const patternMismatch = Object.keys( settings.messages.patternMismatch );
	const outOfRange = Object.keys( settings.messages.outOfRange );
	const wrongLength = Object.keys( settings.messages.wrongLength );

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h2>{ __( 'Form messages', 'formello' ) }</h2>
				</CardHeader>

				<CardBody>
					<p>
						{ __(
							'Default messages displayed after form submission. This setting can be overriden on form block panel.',
							'formello'
						) }
					</p>
					{ formMessages.map( ( key, i ) => {
						return (
							<Fragment key={ i }>
								<TextControl
									label={ key }
									value={ settings.messages.form[ key ] }
									onChange={ ( val ) => {
										setMessage( 'form', key, val );
									} }
									__nextHasNoMarginBottom
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
					{ missingValue.map( ( key, i ) => {
						return (
							<Fragment key={ i }>
								<TextControl
									label={ key }
									value={
										settings.messages.missingValue[ key ]
									}
									onChange={ ( val ) => {
										setMessage( 'missingValue', key, val );
									} }
									__nextHasNoMarginBottom
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
					{ patternMismatch.map( ( key, i ) => {
						return (
							<TextControl
								key={ i }
								label={ key }
								value={
									settings.messages.patternMismatch[ key ]
								}
								onChange={ ( val ) => {
									setMessage( 'patternMismatch', key, val );
								} }
								__nextHasNoMarginBottom
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
					{ outOfRange.map( ( key, i ) => {
						return (
							<TextControl
								key={ i }
								label={ key }
								value={ settings.messages.outOfRange[ key ] }
								onChange={ ( val ) => {
									setMessage( 'outOfRange', key, val );
								} }
								__nextHasNoMarginBottom
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
					{ wrongLength.map( ( key, i ) => {
						return (
							<TextControl
								key={ i }
								label={ key }
								value={ settings.messages.wrongLength[ key ] }
								onChange={ ( val ) => {
									setMessage( 'wrongLength', key, val );
								} }
								__nextHasNoMarginBottom
							/>
						);
					} ) }
				</CardBody>
			</Card>
		</Fragment>
	);
}
