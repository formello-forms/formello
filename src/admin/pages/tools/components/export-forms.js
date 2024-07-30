import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { dateI18n } from '@wordpress/date';
import { downloadBlob } from '@wordpress/blob';

export default function ExportForms() {
	const { records: forms, isResolving } = useEntityRecords(
		'postType',
		'formello_form',
		{
			_embed: 'wp:term',
		}
	);

	const currentDate = dateI18n( '', new Date() );

	const exportForms = () => {
		const fileContent = JSON.stringify( forms, null, 2 );
		const filename = `formello-forms-export-${ currentDate }.json`;

		downloadBlob( filename, fileContent, 'application/json' );
	};

	return (
		<Button
			onClick={ exportForms }
			text={ __( 'Export forms', 'formello' ) }
			variant="primary"
			disabled={ isResolving }
		/>
	);
}
