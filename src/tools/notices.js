/**
 * External dependencies
 */
import { filter } from 'lodash';

/**
 * WordPress dependencies
 */
import { NoticeList, SnackbarList } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

export default function Notices() {
	const { removeNotice } = useDispatch( noticesStore );
	const notices = useSelect(
		( select ) => select( noticesStore ).getNotices(),
		[]
	);
	const dismissibleNotices = filter( notices, {
		isDismissible: true,
		type: 'default',
	} );
	const nonDismissibleNotices = filter( notices, {
		isDismissible: false,
		type: 'default',
	} );
	const snackbarNotices = filter( notices, {
		type: 'snackbar',
	} );

	return (
		<>
			<NoticeList
				notices={ nonDismissibleNotices }
				className="formello-notices__notice-list"
			/>
			<NoticeList
				notices={ dismissibleNotices }
				className="formello-notices__notice-list"
				onRemove={ removeNotice }
			/>
			<SnackbarList
				notices={ snackbarNotices }
				className="formello-notices__snackbar-list"
				onRemove={ removeNotice }
			/>
		</>
	);
}
