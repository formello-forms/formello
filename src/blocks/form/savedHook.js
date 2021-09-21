import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

function usePostSaved() {
	const is_saving = useSelect( select => select( 'core/editor' ).isSavingPost() );
	const is_auto_saving = useSelect( select => select( 'core/editor' ).isAutosavingPost() );
	const [ was_saving, setWasSaving ] = useState( is_saving );
	const [ was_auto_saving, setWasAutoSaving ] = useState( is_auto_saving );

	const shouldTriggerAjax = (
		( was_saving && ! is_saving && ! was_auto_saving )
	);


	if(shouldTriggerAjax){
	  //return true
	  console.log('TRIGGER')
	}

	if( was_saving ) {
		if( ! is_saving && ! is_auto_saving ) {
			setWasSaving( false );

			return true;
		}
	}
	else if( is_saving && ! is_auto_saving ) {
		setWasSaving( true );
	}

	return false;
}

export default usePostSaved;