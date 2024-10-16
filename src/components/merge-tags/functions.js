import { applyFilters } from '@wordpress/hooks';
import { useEntityProp } from '@wordpress/core-data';
import { select } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

const allowed = [
	'formello/input',
	'formello/select',
	'formello/textarea',
	'formello/multichoices',
];

/**
 * Find the input fields blocks IDS.
 */
export function getFieldsBlock() {
	const fields = [];
	const inputs =
		select( blockEditorStore ).getBlocksByName( 'formello/input' );
	const textareas =
		select( blockEditorStore ).getBlocksByName( 'formello/textarea' );
	const selects =
		select( blockEditorStore ).getBlocksByName( 'formello/select' );
	const outputs =
		select( blockEditorStore ).getBlocksByName( 'formello/output' );
	const multichoices = select( blockEditorStore ).getBlocksByName(
		'formello/multichoices'
	);

	const fieldsId = inputs.concat( textareas, selects, outputs, multichoices );

	fieldsId.forEach( ( b ) => {
		const block = select( blockEditorStore ).getBlock( b );
		if ( allowed.includes( block.name ) ) {
			fields.push( block );
		}
	} );

	return fields;
}

/**
 * Validate form before saving
 */
export function validate() {
	const fields = {
		names: [],
		buttons:
			select( blockEditorStore ).getBlocksByName( 'formello/button' ),
	};
	const fieldsBlock = getFieldsBlock();

	fieldsBlock.forEach( ( b ) => {
		fields.names.push( b.attributes.name );
	} );

	return fields;
}

/**
 * Get fields type.
 */
export function getFieldsType() {
	const fields = {};
	const fieldsBlock = getFieldsBlock();

	fieldsBlock.forEach( ( b ) => {
		// get block type by name
		let type = b.name.split( '/' )[ 1 ];
		if ( 'input' === type ) {
			type = b.attributes.type;
		}

		fields[ b.attributes.name ] = type;
		if ( b.attributes.enableRtf ) {
			fields[ b.attributes.name ] = 'richtext';
		}
		if ( b.attributes.multiple && 'select' === type ) {
			fields[ b.attributes.name ] = type + '-multiple';
		}
	} );

	return fields;
}

export function serializeFields() {
	const fields = [];
	const fieldsBlock = getFieldsBlock();

	fieldsBlock.forEach( ( b ) => {
		fields.push( {
			title: b.attributes.name,
			tag: '{{fields.' + b.attributes.name + '}}',
		} );
	} );

	return fields;
}

export function serializeFieldsName() {
	const fields = [];
	const fieldsBlock = getFieldsBlock();

	fieldsBlock.forEach( ( b ) => {
		fields.push( {
			label: b.attributes.name,
			value: b.attributes.name,
		} );
	} );

	return fields;
}

export function getFieldsTags() {
	const fields = serializeFields();

	return [
		{
			title: 'All Data',
			tag: '{{fields.all_data}}',
		},
		...fields,
	];
}

export function getConstraints() {
	const constraints = {};
	const fields = getFieldsBlock();

	if ( fields ) {
		fields.forEach( ( b ) => {
			const constraint = getFieldConstraint( b );
			let name = b.attributes.name;

			if ( b.attributes.multiple ) {
				name += '.*';
			}
			if ( constraint ) {
				constraints[ name ] = constraint;
			}
		} );
	}

	return constraints;
}

export function getFieldConstraint( field ) {
	let constraints = [];

	if ( field.attributes.type === 'url' ) {
		constraints.push( 'url' );
	}

	if ( field.attributes.required ) {
		constraints.push( 'required' );
	}

	if ( field.attributes.minlength ) {
		constraints.push( 'minlength:' + field.attributes.minlength );
	}

	if ( field.attributes.maxlength ) {
		constraints.push( 'maxlength:' + field.attributes.maxlength );
	}

	if ( field.attributes.min && 'date' !== field.attributes.type ) {
		constraints.push( 'min:' + field.attributes.min );
	}

	if (
		field.attributes.max &&
		'date' !== field.attributes.type &&
		'file' !== field.attributes.type
	) {
		constraints.push( 'max:' + field.attributes.max );
	}

	if ( field.attributes.type === 'email' ) {
		constraints.push( 'email' );
	}

	if (
		field.attributes.type === 'number' ||
		field.attributes.type === 'range'
	) {
		constraints.push( 'numeric' );
	}

	if ( 'date' === field.attributes.type && ! field.attributes.advanced ) {
		constraints.push( 'date' );
	}

	if ( field.attributes.pattern ) {
		const regEx = new RegExp( field.attributes.pattern );
		constraints.push( 'regex:' + regEx );
	}

	if ( field.attributes.enableMismatch && '' !== field.attributes.match ) {
		constraints.push( 'same:' + field.attributes.match );
	}

	applyFilters( 'formello.constraints', constraints, field );

	if ( constraints.length ) {
		constraints = constraints.join( '|' );
	}

	return constraints.length ? constraints : undefined;
}

export function getMetaTags() {
	const postType = select( 'core/editor' ).getCurrentPostType();
	const postId = select( 'core/editor' ).getCurrentPostId();

	const [ meta ] = useEntityProp( 'postType', postType, 'meta', postId );
	const metaTags = [];

	for ( const key in meta ) {
		if ( meta[ key ] !== Object( key ) ) {
			continue;
		}
		const tag = {
			title: key,
			tag: `{{meta.${ key }}}`,
		};
		metaTags.push( tag );
	}

	return metaTags;
}

export function getWordpressTags() {
	const tags = [
		{
			title: 'Post ID',
			tag: `{{wp.post_id}}`,
		},
		{
			title: 'Post Title',
			tag: `{{wp.post_title}}`,
		},
		{
			title: 'Post URL',
			tag: `{{wp.post_url}}`,
		},
		{
			title: 'Post Author',
			tag: `{{wp.post_author}}`,
		},
		{
			title: 'Post Author Email',
			tag: `{{wp.post_author_email}}`,
		},
		{
			title: 'User ID',
			tag: `{{wp.user_id}}`,
		},
		{
			title: 'User First Name',
			tag: `{{wp.user_first_name}}`,
		},
		{
			title: 'User Last Name',
			tag: `{{wp.user_last_name}}`,
		},
		{
			title: 'User Display Name',
			tag: `{{wp.user_display_name}}`,
		},
		{
			title: 'User Username',
			tag: `{{wp.user_username}}`,
		},
		{
			title: 'User Email',
			tag: `{{wp.user_email}}`,
		},
		{
			title: 'User URL',
			tag: `{{wp.user_url}}`,
		},
		{
			title: 'Site Title',
			tag: `{{wp.site_title}}`,
		},
		{
			title: 'Site URL',
			tag: `{{wp.site_url}}`,
		},
		{
			title: 'Admin Email',
			tag: `{{wp.admin_email}}`,
		},
	];

	return tags;
}

export function getFormTags() {
	const tags = [
		{
			title: 'Form ID',
			tag: `{{form.form_id}}`,
		},
		{
			title: 'Form Label',
			tag: `{{form.form_name}}`,
		},
	];

	return tags;
}

export function getOtherTags() {
	const tags = [
		{
			title: 'Date',
			tag: `{{other.system_date}}`,
		},
		{
			title: 'Time',
			tag: `{{other.system_time}}`,
		},
		{
			title: 'Referrer URL',
			tag: `{{other.referrer}}`,
		},
		{
			title: 'User IP',
			tag: `{{other.user_ip}}`,
		},
	];

	return tags;
}

export function getPatternTabs() {
	const passwords = [
		{
			title: 'Password',
			tag: `^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$`,
			description: 'One uppercase, one number, at least 8 chars',
		},
		{
			title: 'Password with special characters',
			tag: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$`,
			description:
				'One uppercase, one number, one special chars, at least 8 chars',
		},
	];

	const dates = [
		{
			title: 'dd/mm/yyyy',
			tag: '^\\d{2}-\\d{2}-\\d{4}$',
		},
		{
			title: 'dd/mm/yy',
			tag: '^\\d{2}-\\d{2}-\\d{2}$',
		},
	];

	const tabs = [
		{
			name: 'passwords',
			title: 'Passwords',
			data: passwords,
		},
		{
			name: 'dates',
			title: 'Dates',
			data: dates,
		},
	];

	return tabs;
}
