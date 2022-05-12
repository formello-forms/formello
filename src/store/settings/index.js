import apiFetch from '@wordpress/api-fetch';
import { createReduxStore, register } from '@wordpress/data';

const DEFAULT_STATE = {
	settings: {},
	loaded: false,
};

const actions = {
	setSettings( settings ) {
		return {
			type: 'SET_SETTINGS',
			settings,
		};
	},

	setSetting( key, value ) {
		return {
			type: 'SET_SETTING',
			key,
			value,
		};
	},

	setSettingGroup( group, key, value ) {
		return {
			type: 'SET_SETTING_GROUP',
			group,
			key,
			value,
		};
	},

	setLoaded( val ) {
		return {
			type: 'SET_LOADED',
			val,
		};
	},

	fetchFromAPI( path ) {
		return {
			type: 'FETCH_FROM_API',
			path,
		};
	},
};

const store = createReduxStore( 'formello/data', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_SETTING_GROUP':
				return {
					...state,
					settings: {
						...state.settings,
						formello: {
							...state.settings.formello,
							[ action.group ]: {
								...state.settings.formello[ action.group ],
								[ action.key ]: action.value,
							},
						},
					},
				};

			case 'SET_SETTINGS':
				return {
					...state,
					settings: action.settings,
				};

			case 'SET_SETTING':
				return {
					...state,
					settings: {
						...state.settings,
						formello: {
							...state.settings.formello,
							[ action.key ]: action.value,
						},
					},
				};
		}

		return state;
	},

	actions,

	selectors: {
		getGlobalSettings( state ) {
			const { settings } = state;
			return settings;
		},
		getSettings( state ) {
			const { settings } = state;
			return settings.formello;
		},
	},

	controls: {
		FETCH_FROM_API( action ) {
			return apiFetch( { path: action.path } );
		},
	},

	/*resolvers: {
        *getSettings() {
            const path = '/wp/v2/settings/';
            const settings = yield actions.fetchFromAPI( path );
            return actions.setSettings( settings.formello );
        },
    },*/
} );

register( store );
