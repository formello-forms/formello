import {
	Card,
	CardHeader,
	CardBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';

export function SubmissionData( props ) {
	const { data } = props;
	const { formats } = getSettings();

	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Submission data', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<table>
					<tbody>
						<tr>
							<th>{ __( 'Submission ID', 'formello' ) }</th>
							<td>{ data.id }</td>
						</tr>
						<tr>
							<th>{ __( 'Form ID', 'formello' ) }</th>
							<td>{ data.form_id }</td>
						</tr>
						<tr>
							<th>{ 'Timestamp' }</th>
							<td>{ dateI18n( formats.datetime, data.submitted_at ) }</td>
						</tr>
						<tr>
							<th>{ 'Referrer URL' }</th>
							<td>{ data.referer_url }</td>
						</tr>
						<tr>
							<th>{ 'IP' }</th>
							<td>{ data.ip_address }</td>
						</tr>
						<tr>
							<th>{ 'User Agent' }</th>
							<td>{ data.user_agent }</td>
						</tr>
					</tbody>
				</table>
			</CardBody>
		</Card>
	);
}
