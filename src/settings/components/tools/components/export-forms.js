import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { dateI18n } from '@wordpress/date';

export default function ExportForms() {
	const [ loading, setLoading ] = useState( false );

	const currentDate = dateI18n( '', new Date() )

	const exportForms = () => {
		setLoading( true );

		return apiFetch( {
			path: '/formello/v1/templates/export',
			method: 'POST',
			parse: false,
		} )
		.then( ( res ) => res.blob() )
		.then( ( blob ) => {
			setLoading( false );
			const url = window.URL.createObjectURL( blob );
			const a = document.createElement( 'a' );
			a.href = url;
			a.download = `forms-exported-${ currentDate }.json`;
			document.body.appendChild( a ); // we need to append the element to the dom -> otherwise it will not work in firefox
			a.click();
			a.remove(); //afterwards we remove the element again
		} )
		.catch( () => setLoading( false ) );
	};

	return (
		<Button
			onClick={ exportForms }
			text={ __( 'Export forms', 'formello' ) }
			variant="primary"
			isBusy={ loading }
			disabled={ loading }
		/>
	);
}
