import { __, sprintf } from '@wordpress/i18n';
import {
	Card,
	CardHeader,
	CardBody,
	CardMedia,
	CardFooter,
	Button,
	ToggleControl,
	Modal,
} from '@wordpress/components';
import {
	useState,
	Fragment,
} from '@wordpress/element';
import {
	addQueryArgs,
} from '@wordpress/url';

export default function Addon( props ) {
	const { info, addons, handleAddonChange } = props;

	const isChecked = formello.can_use_premium_code ? addons.includes( info.slug ) : false;

	const [ isOpen, setOpen ] = useState( false );

	const closeModal = () => setOpen( false );

	const installUrl = addQueryArgs( 'plugin-install.php', {
		s: 'popper',
		type: 'term',
		tab: 'search',
	} );

	function onAddonChange( checked ) {
		if ( formello.can_use_premium_code ) {
			handleAddonChange( checked, info.slug );
		} else {
			setOpen( true );
		}
	}

	return (
		<Fragment>
			<Card className="addon">
				<CardHeader>
					<h2>{ info.title }</h2>
				</CardHeader>
				<CardBody>
					<CardMedia as="aside">
						<img src={ require( `../../../../assets/addons/${ info.slug }.png` ) } alt={ info.title } />
					</CardMedia>
					<p>{ info.excerpt }</p>
				</CardBody>
				<CardFooter>
					{
						'popper' === info.slug
							? <Button
								href={ installUrl }
								variant="primary"
								isSmall
							>
								{ sprintf(
								/* translators: %s: Popper plugin name */
									__( 'Install %s' ),
									info.title
								) }
							</Button>
							:	
							<ToggleControl
								checked={ isChecked }
								onChange={ ( checked ) => onAddonChange( checked ) }
								__nextHasNoMarginBottom
							/>
					}
				</CardFooter>
			</Card>
			{ isOpen && (
				<Modal
					title={ __( 'Formello Pro' ) }
					shouldCloseOnClickOutside={ false }
					onRequestClose={ closeModal }
				>
					<p>
						{ 
							__( 'To enable this addon you need a free Formello license.', 'formello' )
						}
					</p>
					<Button
						variant="primary" 
						href="https://formello.net" 
						icon="download" 
						iconPosition={ 'right' }
						target="_blank"
					>
						{ __( 'Free download', 'formello-pro' ) }
					</Button>
				</Modal>
			) }
		</Fragment>
	);
}
