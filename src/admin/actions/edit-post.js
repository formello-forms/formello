import { __ } from '@wordpress/i18n';
import { edit } from '@wordpress/icons';

const editPost = {
	id: 'edit-post',
	label: __( 'Edit' ),
	isPrimary: true,
	supportsBulk: false,
	icon: edit,
	isEligible( post ) {
		return post.status !== 'trash';
	},
	callback( posts ) {
		const post = posts[ 0 ];
		document.location.href =
			'/wp-admin/post.php?post=' + post.id + '&action=edit';
	},
};

export default editPost;
