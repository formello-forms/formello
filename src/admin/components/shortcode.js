/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { useCopyToClipboard } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

import { copySmall } from '@wordpress/icons';
import {
	__experimentalInputControl as InputControl,
	Button,
} from '@wordpress/components';

export default function Shortcode( { item } ) {
	const { createNotice } = useDispatch( noticesStore );

	const id = item.id ?? '';

	const copyButtonRef = useCopyToClipboard( `[formello ref=${ id }]`, () => {
		createNotice(
			'info',
			__( 'Copied Shortcode to clipboard.', 'formello' ),
			{
				isDismissible: true,
				type: 'snackbar',
			}
		);
	} );

	return (
		<>
			<InputControl
				__next40pxDefaultSize
				suffix={
					<Button
						__next40pxDefaultSize
						icon={ copySmall }
						ref={ copyButtonRef }
						label={ __( 'Copy' ) }
						onClick={ ( e ) => e.stopPropagation() }
					/>
				}
				label={ __( 'Shortcode' ) }
				hideLabelFromVision
				value={ `[formello ref=${ id }]` }
				autoComplete="off"
				spellCheck="false"
				type="text"
				className="fields-controls__slug-input"
				readOnly
				disabled
			/>
		</>
	);
}
