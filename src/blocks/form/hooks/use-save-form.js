import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

const useSaveForm = () => {
	const { isSaving } = useSelect( ( select ) => ( {
		isSaving: select( 'core/editor' ).isSavingPost(),
	} ) );

	const [ wasSaving, setWasSaving ] = useState( isSaving );

	if ( wasSaving ) {
		if ( ! isSaving ) {
			setWasSaving( false );

			return true;
		}
	} else if ( isSaving ) {
		setWasSaving( true );
	}

	return false;
};

export default useSaveForm;

