import { __ } from '@wordpress/i18n';
import { Card, CardHeader, CardBody, CardMedia, CardDivider, CardFooter, Button } from '@wordpress/components';

export default function Addon( props ) {

	const { info } = props;

	return (
		<Card>
			<CardHeader>
				<h2>{ info.title }</h2>
			</CardHeader>
			<CardBody>
				<CardMedia as="aside">
					<img src={ info.thumbnail } />
				</CardMedia>
				<p>{ info.excerpt }</p>
			</CardBody>
			<CardFooter>
				<Button
					isPrimary
					target="_blank"
					href={ info.permalink }
				>
					{ __( 'Download', 'formello' ) }
				</Button>
			</CardFooter>
		</Card>
	)
}