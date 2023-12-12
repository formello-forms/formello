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
import { useState, Fragment, useContext } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { SettingsContext } from '../../context/settings-context';
import { useEntityRecord, store as coreStore } from '@wordpress/core-data';

export default function Addon( props ) {
	const { settings, updateSetting } = useContext( SettingsContext );
	const { addon } = props;

	const [ isOpen, setOpen ] = useState( false );

	const { saveEntityRecord } = useDispatch( coreStore );

	const popper = useEntityRecord( 'root', 'plugin', 'popper/popper' );
	const formelloPro = useEntityRecord(
		'root',
		'plugin',
		'formello-pro/formello-pro'
	);

	const installPopper = () => {
		if ( popper.record ) {
			popper.edit( { status: 'active' } );
			popper.save();
		} else {
			saveEntityRecord( 'root', 'plugin', {
				slug: 'popper',
				status: 'active',
			} );
		}
	};

	const { isInstalling } = useSelect(
		( select ) => ( {
			isInstalling: select( coreStore ).isSavingEntityRecord(
				'root',
				'plugin',
				'popper/popper'
			),
		} ),
		[]
	);

	const toggleAddon = ( val, slug ) => {
		if ( ! formelloPro.record || 'active' !== formelloPro.record.status ) {
			return setOpen( true );
		}
		if ( val ) {
			updateSetting( 'enabled_addons', [
				...settings.enabled_addons,
				slug,
			] );
		} else {
			const enabledAddons = settings.enabled_addons.filter( ( item ) => {
				return item !== slug;
			} );
			updateSetting( 'enabled_addons', enabledAddons );
		}
	};

	return (
		<Fragment>
			<Card className="addon">
				<CardHeader>
					<h2>{ addon.title }</h2>
				</CardHeader>
				<CardBody>
					<CardMedia as="aside">
						<img
							src={ require(
								`../../../../assets/addons/${ addon.slug }.png`
							) }
							alt={ addon.title }
						/>
					</CardMedia>
					<p>{ addon.excerpt }</p>
				</CardBody>
				<CardFooter>
					{ 'popper' === addon.slug ? (
						<Button
							onClick={ () => installPopper() }
							variant="primary"
							size="small"
							isBusy={ popper.isResolving || isInstalling }
							disabled={
								popper.isResolving ||
								'active' === popper.editedRecord.status ||
								isInstalling
							}
							aria-disabled={ popper.isResolving }
						>
							{ 'active' === popper.editedRecord.status
								? __( 'Is Active' )
								: __( 'Activate' ) }
						</Button>
					) : (
						<ToggleControl
							checked={
								settings?.enabled_addons?.includes(
									addon.slug
								) || false
							}
							onChange={ ( checked ) =>
								toggleAddon( checked, addon.slug )
							}
							__nextHasNoMarginBottom
						/>
					) }
				</CardFooter>
			</Card>
			{ isOpen && (
				<Modal
					onRequestClose={ () => setOpen( false ) }
				>
					<p>
						{ sprintf(
							/* translators: %s: Addon name */
							__(
								'To enable %s addon you need a Formello Pro license.',
								'formello'
							),
							addon.title
						) }
					</p>
					<Button
						variant="primary"
						href="https://formello.net"
						icon="download"
						iconPosition={ 'right' }
						target="_blank"
					>
						{ __( 'Download', 'formello-pro' ) }
					</Button>
				</Modal>
			) }
		</Fragment>
	);
}
