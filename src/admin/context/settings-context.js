import { useState, createContext, useEffect } from '@wordpress/element';
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { __experimentalUseNavigator as useNavigator } from '@wordpress/components';
import { useEntityRecord, store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { getQueryArg, removeQueryArgs } from '@wordpress/url';

export const SettingsContext = createContext();

function SettingsContextProvider( props ) {
	const [ settings, setSettings ] = useState( false );
	const [ hasUpdates, setHasUpdates ] = useState( false );

	const {
		record: savedSettings,
		isResolving: isLoadingSettings,
		hasResolved: ready,
	} = useEntityRecord( 'root', 'site' );

	const { saveEntityRecord } = useDispatch( coreStore );

	const saveSettings = () => {
		return saveEntityRecord( 'root', 'site', {
			formello: settings,
		} );
	};

	const updateSetting = ( key, value ) => {
		setSettings( { ...settings, [ key ]: value } );
		setHasUpdates( true );
	};

	useEffect( () => {
		if ( savedSettings ) {
			setSettings( savedSettings.formello );
		}
	}, [ savedSettings ] );

	const navigator = useNavigator();

	const handleChange = ( e ) => {
		const cleanUrl = removeQueryArgs(
			window.location.href,
			'page',
			'tab',
			'id'
		);
		const slug = getQueryArg( e.detail, 'page' );
		const newUrl = new URL( cleanUrl );
		newUrl.searchParams.set( 'page', slug );
		window.history.pushState( { page: slug }, '', newUrl.toString() );

		navigator.goTo( '/' + slug );
	};

	const handlePopstate = ( e ) => {
		const newUrl = removeQueryArgs( e.target.location.href, 'tab' );
		const slug = getQueryArg( newUrl, 'page' );
		navigator.goTo( '/' + slug );
	};

	useEffect( () => {
		window.addEventListener( 'changePage', handleChange );
		window.addEventListener( 'popstate', handlePopstate );

		return () => {
			window.removeEventListener( 'changePage', handleChange );
			window.removeEventListener( 'popstate', handlePopstate );
		};
	}, [] );

	return (
		<SettingsContext.Provider
			value={ {
				isLoadingSettings,
				ready,
				settings,
				saveSettings,
				updateSetting,
				hasUpdates,
			} }
		>
			{ props.children }
		</SettingsContext.Provider>
	);
}

export default SettingsContextProvider;
