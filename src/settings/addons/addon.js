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
	RawHTML,
} from '@wordpress/element';
import {
	addQueryArgs,
} from '@wordpress/url';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

export default function Addon( props ) {
	const { info, addons, handleAddonChange } = props;

	const [ isOpen, setOpen ] = useState( false );
	const [ loading, setLoading ] = useState( false );

	const closeModal = () => setOpen( false );

	const { isPopperInstalled, isPopperActive, popperInstallUrl } = useSelect( ( select ) => {
		const popper = select( 'core' ).getPlugin( 'popper/popper' );
		return {
			isPopperInstalled: popper,
			isPopperActive: popper?.status === 'active',
			popperInstallUrl: popper?._links.self[0].href,
		};
	} );

	const installPopper = async () => {
		const status = isPopperActive ? 'inactive' : 'active';
		setLoading(true)
		if ( popperInstallUrl ) {
			await apiFetch( {
				method: 'PUT',
				url: popperInstallUrl,
				data: { status: status },
			} );
		} else {
			await apiFetch( {
				method: 'POST',
				path: 'wp/v2/plugins',
				data: { slug: 'popper', status: 'active' },
			} );
		}
		setLoading(false)
		window.navigation.reload();
	}

	const onAddonChange = ( checked ) => {
		if ( formello.can_use_premium_code ) {
			handleAddonChange( checked, info.slug );
		} else {
			setOpen( true );
		}
	}

	const isChecked = ( 'popper' === info.slug ) ? isPopperActive : addons?.includes( info.slug );

	const title = info.title.rendered.replace(/(<([^>]+)>)/gi, '');

	return (
		<Fragment>
			<Card className="addon">
				<CardHeader>
					<h2>{ title }</h2>
				</CardHeader>
				<CardBody>
					<CardMedia as="aside">
						<img src={ require( `../../../assets/addons/${ info.slug }.png` ) } alt={ title } />
					</CardMedia>
					<RawHTML>{ info.excerpt.rendered }</RawHTML>
				</CardBody>
				<CardFooter>
					{
						( 'popper' === info.slug ) ? 
							<Button
								onClick={ installPopper }
								variant="primary"
								isSmall
								isBusy={ loading }
								disabled={ loading }
								aria-disabled={ loading }
							>
								{ sprintf(
								/* translators: %s: Popper plugin name */
									__( '%s %s', 'formello' ),
									isPopperInstalled ? __( 'Deactivate' ) : __( 'Activate' ),
									title
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
						{ sprintf(
							/* translators: %s: Popper plugin name */
							__( 'To enable %s addon you need a free Formello license.', 'formello' ),
							title
						) }
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
