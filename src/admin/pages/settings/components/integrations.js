import {
	Card,
	CardHeader,
	CardBody,
	withFilters,
	Button,
} from '@wordpress/components';
import { Fragment, createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { useHistory } from '../../../router';
import { integrations, icons } from '../../../../blocks/form/actions/constants';

const Integrations = withFilters( 'formello.settings.integrations' )( () => {
	const history = useHistory();
	const noticeString = ( text ) =>
		createInterpolateElement( text, {
			a: (
				<Button
					text={ __( 'addons page', 'search-console' ) }
					onClick={ () => {
						history.push( { page: 'formello-addons' } );
					} }
					variant="link"
				/>
			),
		} );
	return (
		<Card>
			<CardHeader>
				<h2>{ __( 'Integrations', 'formello' ) }</h2>
			</CardHeader>

			<CardBody>
				<p>
					{ noticeString(
						__(
							'Go to <a /> to enable your preferred integrations.',
							'formello'
						)
					) }
				</p>
			</CardBody>
		</Card>
	);
} );

const IntegrationsTab = () => {
	return (
		<Fragment>
			<Integrations integrations={ integrations } icons={ icons } />
		</Fragment>
	);
};

export default IntegrationsTab;
