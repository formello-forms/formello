import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

const useFormSaved = () => {

	const { is_saving } = useSelect( ( select ) => ( {
		is_saving: select( 'core/editor' ).isSavingPost()
	} ) );

	const [ was_saving, setWasSaving ] = useState( is_saving );

	if ( was_saving ) {
		if ( ! is_saving ) {
			setWasSaving( false );

			return true;
		}
	} else if ( is_saving ) {
		setWasSaving( true );
	}

	return false;
};


const useFormSaved2 = () => {
	const [ checked, setChecked ] = useState( false );
	const isSavingPost = useSelect( ( select ) =>
		select( 'core/editor' ).isSavingPost()
	);

	if ( isSavingPost && checked ) {
		setChecked( false );
	} else if ( ! isSavingPost && ! checked ) {
		// eslint-disable-next-line no-alert,no-undef
		setChecked( true );
		return true
	}

	return false;
};

export default useFormSaved;

