import { Card, CardHeader, CardBody } from '@wordpress/components';
import { RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';

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
						{ Object.keys( data ).map( ( key, i ) => {
							const field = JSON.parse(
								JSON.stringify( data[ key ] )
							);
							return (
								<tr key={ i }>
									<th>
										{ key
											.replaceAll( '_', ' ' )
											.toUpperCase() }
									</th>
									<td>
										<RawHTML className="display-linebreak">
											{ Array.isArray( field )
												? field.join( ', ' )
												: decodeEntities( field ) }
										</RawHTML>
									</td>
								</tr>
							);
						} ) }
					</tbody>
				</table>
			</CardBody>
		</Card>
	);
}
