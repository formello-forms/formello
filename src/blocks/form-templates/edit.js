/**
 * Block: Template Library
 */

import { TemplatesModal } from './library';

import {
	__,
} from '@wordpress/i18n';

import {
	Placeholder,
	Button,
} from '@wordpress/components';

import {
	Fragment,
	useState,
} from '@wordpress/element';

function FormelloTemplateLibrary ( { clientId } ) {

	const [ isModalOpen, setModalOpen ] = useState( false );

	return (
		<Fragment>
			<Placeholder
				label={ __( 'Template Library', 'formello' ) }
				instructions={ __( 'Insert pre-built templates directly into your content.', 'formello' ) }
				className="formello-select-template"
			>
				<Button
					className="plugin-formello-panel-button is-large"
					isPrimary
					onClick={ () => {
						setModalOpen( 'templates' );
					} }
				>
					{ __( 'Open Library', 'formello' ) }
				</Button>
				
				<Button isLink onClick={ () => onSelect() }>
					{ __( 'Skip' ) }
				</Button>

				{ 'templates' === isModalOpen &&
					<TemplatesModal
						onRequestClose={ () => setModalOpen( false ) }
						clientId={ clientId }
					/>
				}
			</Placeholder>

		</Fragment>
	);

}

export default FormelloTemplateLibrary;
