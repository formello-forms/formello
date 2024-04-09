import { createContext } from '@wordpress/element';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';

export const SettingsContext = createContext();

function SettingsContextProvider( props ) {
	const [ settings ] = useEntityProp( 'root', 'site', 'formello' );

	const { saveEditedEntityRecord, editEntityRecord } =
		useDispatch( coreStore );

	const { isSaving, hasEdits } = useSelect(
		( select ) => ( {
			isSaving: select( coreStore ).isSavingEntityRecord(
				'root',
				'site'
			),
			hasEdits: select( coreStore ).hasEditsForEntityRecord(
				'root',
				'site',
				undefined,
				'formello'
			),
		} ),
		[]
	);

	const saveSettings = () => {
		return saveEditedEntityRecord( 'root', 'site' );
	};

	const updateSetting = ( key, val ) => {
		editEntityRecord( 'root', 'site', undefined, {
			formello: {
				...settings,
				[ key ]: val,
			},
		} );
	};

	return (
		<SettingsContext.Provider
			value={ {
				settings,
				saveSettings,
				updateSetting,
				hasUpdates: hasEdits,
				isSaving,
			} }
		>
			{ props.children }
		</SettingsContext.Provider>
	);
}

export default SettingsContextProvider;
