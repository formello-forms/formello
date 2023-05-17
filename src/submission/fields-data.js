import {
	Card,
	CardHeader,
	CardBody,
} from '@wordpress/components';
import { RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function FieldsData( props ) {
	const { data } = props;

	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Fields', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<table>
					<tbody>
						{
							Object.keys( data.data ).map( ( key, i ) => {
								return (
									<tr key={ i }>
										<th>{ key }</th>
										<td><RawHTML>{ data.data[ key ] }</RawHTML></td>
									</tr>
								);
							} )
						}
					</tbody>
				</table>
			</CardBody>
		</Card>
	);
}
