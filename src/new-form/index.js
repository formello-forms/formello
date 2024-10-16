import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';
import { Settings } from './settings/basic';
import { AdvancedSettings } from './settings/advanced';
import { ActionsSettings } from './settings/actions';
import { useSelect, select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { Fragment } from '@wordpress/element';
import {
	getConstraints,
	getFieldsType,
	validate,
} from '../components/merge-tags/functions';

const PluginDocumentSettingPanelExample = () => {
	const { postType } = useSelect( ( select ) => {
		return {
			postType: select( 'core/editor' ).getCurrentPostType(),
		};
	} );

	if ( 'formello' !== postType ) {
		return null;
	}

	return (
		<Fragment>
			<PluginDocumentSettingPanel
				name="plugin-sidebar-example"
				title={ __( 'Settings' ) }
				className="formello-sidebar"
			>
				<Settings />
			</PluginDocumentSettingPanel>
			<PluginDocumentSettingPanel
				name="plugin-sidebar-example"
				title={ __( 'Actions' ) }
				className="formello-sidebar"
			>
				<ActionsSettings />
			</PluginDocumentSettingPanel>
			<PluginDocumentSettingPanel
				name="plugin-sidebar-example2"
				title={ __( 'Advanced' ) }
				className="formello-sidebar"
			>
				<AdvancedSettings />
			</PluginDocumentSettingPanel>
		</Fragment>
	);
};

// Register the plugin.
registerPlugin( 'plugin-sidebar-example', {
	render: PluginDocumentSettingPanelExample,
} );

function validateAll() {
	const validation = validate();

	if ( ! validation.buttons.length ) {
		return Promise.reject( {
			message: __( 'Missing button', 'formello' ),
		} );
	}

	if ( validation.buttons.length > 1 ) {
		return Promise.reject( {
			message: __( 'You have more than one button', 'formello' ),
		} );
	}

	if ( validation.names.some( ( item ) => item === undefined ) ) {
		return Promise.reject( {
			message: __( 'One or more fields have no name', 'formello' ),
		} );
	}
}

addFilter( 'editor.preSavePost', 'editor', ( edits ) => {
	const postType = select( 'core/editor' ).getCurrentPostType();
	const meta = select( 'core/editor' ).getCurrentPostAttribute( 'meta' );

	if ( 'formello' === postType ) {
		const fields = getFieldsType();
		const constraints = getConstraints();

		let newEdits;

		if ( edits.meta ) {
			newEdits = {
				...edits,
				meta: {
					...edits.meta,
					_formello_settings: {
						...edits.meta._formello_settings,
						constraints,
						fields,
					},
				},
			};
		} else {
			const newMeta = {
				...meta,
				_formello_settings: {
					...meta._formello_settings,
					constraints,
					fields,
				},
			};
			newEdits = {
				...edits,
				meta: newMeta,
			};
		}

		return Promise.resolve( newEdits );
	}

	return Promise.resolve( edits );
} );
