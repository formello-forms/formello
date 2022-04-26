const { addFilter } = wp.hooks;

import {
	TextControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

export default function Email(content, props, MergeTags, handleUpdate) {
	const { action, clientId } = props;

	const [settings, setSettings] = useState(Object.assign({}, action));
	const [advanced, setAdvanced] = useState(false);

	const updateSettings = (prop, val) => {
		setSettings({ ...settings, [prop]: val });
		handleUpdate({ ...settings, [prop]: val });
	};

	return (
		<Fragment>
			<TextControl
				label="Name"
				value={settings.title}
				onChange={(val) => {
					updateSettings('title', val);
				}}
			/>
			<MergeTags
				clientId={clientId}
				label="From"
				value={settings.from}
				onChange={(val) => {
					updateSettings('from', val);
				}}
			/>

			<MergeTags
				clientId={clientId}
				label="To"
				value={settings.to}
				onChange={(val) => {
					updateSettings('to', val);
				}}
			/>

			<ToggleControl
				label={__('More', 'formello')}
				onChange={(val) => {
					setAdvanced(val);
				}}
				checked={advanced}
			/>

			{advanced && (
				<>
					<MergeTags
						clientId={clientId}
						label="CC"
						value={settings.cc}
						onChange={(val) => {
							updateSettings('cc', val);
						}}
					/>

					<MergeTags
						clientId={clientId}
						label="BCC"
						value={settings.bcc}
						onChange={(val) => {
							updateSettings('bcc', val);
						}}
					/>
				</>
			)}

			<MergeTags
				clientId={clientId}
				label="Reply To"
				value={settings.replyTo}
				onChange={(val) => {
					updateSettings('replyTo', val);
				}}
			/>

			<MergeTags
				clientId={clientId}
				label="Subject"
				value={settings.subject}
				onChange={(val) => {
					updateSettings('subject', val);
				}}
			/>

			<TextareaControl
				label="Message"
				value={settings.message}
				onChange={(val) => {
					updateSettings('message', val);
				}}
				placeholder={__('Enter message…', 'formello')}
			/>
		</Fragment>
	);
}

addFilter('formello.modal.email', 'formello/actions-email', Email);
