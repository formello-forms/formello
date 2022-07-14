import { each } from 'lodash';

const { getBlock, getClientIdsOfDescendants, getBlockParents } =
	wp.data.select( 'core/block-editor' );

const allowed = [ 'formello/input', 'formello/select' ];

/**
 * Find the root form block.
 *
 * @param {string} clientId The id of the block of which we are finding the form block
 */
export function getFormBlock( clientId ) {
	if ( 'formello/form' === getBlock( clientId ).name ) {
		return getBlock( clientId );
	}
	// if it's not an form block, get parent form.
	const parents = getBlockParents( clientId );

	for ( const block of parents ) {
		if ( getBlock( block ).name === 'formello/form' ) {
			return getBlock( block );
		}
	}
}

/**
 * Find the root form block.
 *
 * @param {string} clientId The id of the form block of which we are finding the children fields
 */
export function getFieldsBlock( clientId ) {
	const fields = [];
	const fieldsId = getClientIdsOfDescendants( [ clientId ] );

	fieldsId.forEach( ( b ) => {
		const block = getBlock( b );
		if ( allowed.includes( block.name ) ) {
			fields.push( block );
		}
	} );

	return fields;
}

/**
 * Find the root form block.
 *
 * @param {string} clientId The id of the form block of which we are finding the children fields
 */
export function getFieldsName( clientId ) {
	const fields = {};
	const fieldsBlock = getFieldsBlock( clientId );

	fieldsBlock.forEach( ( b ) => {
		fields[ b.attributes.name ] = b.attributes.type;
		if ( b.attributes.enableRtf ) {
			fields[ b.attributes.name ] = 'richtext';
		}
		if ( b.attributes.multiple && 'select' === b.attributes.type ) {
			fields[ b.attributes.name ] = 'select-multiple';
		}
	} );

	return fields;
}

export function serializeFields( clientId ) {
	const fields = [];
	const fieldsBlock = getFieldsBlock( clientId );

	fieldsBlock.forEach( ( b ) => {
		fields.push( {
			title: b.attributes.name,
			tag: '{{fields.' + b.attributes.name + '}}',
		} );
	} );

	return fields;
}

export function getFieldsTags( clientId ) {
	let fields = [];
	const formBlock = getFormBlock( clientId );
	if ( formBlock ) {
		fields = serializeFields( formBlock.clientId );
	}

	return [
		{
			title: 'All Data',
			tag: '{{fields.all_data}}',
		},
		...fields,
	];
}

export function getConstraints( clientId ) {
	const constraints = {};
	const fields = getFieldsBlock( clientId );

	if ( fields ) {
		fields.forEach( ( b ) => {
			const constraint = getFieldConstraint( b );
			let name = b.attributes.name;
			if( 'file' === b.attributes.type ){
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
		constraints.push( 'min:' + field.attributes.minlength );
	}

	if ( field.attributes.maxlength ) {
		constraints.push( 'max:' + field.attributes.maxlength );
	}

	if ( field.attributes.min && 'date' !== field.attributes.type ) {
		constraints.push( 'min:' + field.attributes.min );
	}

	if ( field.attributes.max && 'date' !== field.attributes.type && 'file' !== field.attributes.type ) {
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

	if ( 'date' === field.attributes.type && ! field.attributes.advancedDate ) {
		constraints.push( 'date' );
	}

	if ( 'file' === field.attributes.type && field.attributes.max ) {
		constraints.push( 'uploaded_file' );
	}

	if ( 'file' === field.attributes.type && field.attributes.accept.length ) {
		constraints.push( 'mimes:' + field.attributes.accept.join(',').replace(/\|/g, ",") );
	}

	if ( 'file' === field.attributes.type && field.attributes.max ) {
		constraints.push( 'max:' + field.attributes.max + 'KB' );
	}

	if (
		field.attributes.advancedDate &&
		'range' !== field.attributes.flatpickr.mode &&
		'multiple' !== field.attributes.flatpickr.mode
	) {
		constraints.push( 'date:' + field.attributes.flatpickr[ 'date-format' ] );
	}

	if ( constraints.length ) {
		constraints = constraints.join( '|' );
	}

	return constraints.length ? constraints : undefined;
}

export function getMetaTags() {
	const { getEditedPostAttribute } = wp.data.select( 'core/editor' );
	const meta = getEditedPostAttribute( 'meta' );
	const metaTags = [];

	each( meta, ( _, key ) => {
		const tag = {
			title: key,
			tag: `{{post_meta.${ key }}}`,
		};

		metaTags.push( tag );
	} );

	return metaTags;
}

export function getWordpressTags() {
	const tags = [
		{
			title: 'Post ID',
			tag: `{{wp.post_id}}`, // done
		},
		{
			title: 'Post Title',
			tag: `{{wp.post_title}}`, // done
		},
		{
			title: 'Post URL',
			tag: `{{wp.post_url}}`, // done
		},
		{
			title: 'Post Author',
			tag: `{{wp.post_author}}`, // done
		},
		{
			title: 'Post Author Email',
			tag: `{{wp.post_author_email}}`, // done
		},
		{
			title: 'User ID',
			tag: `{{wp.user_id}}`, // done
		},
		{
			title: 'User First Name',
			tag: `{{wp.user_first_name}}`, // done
		},
		{
			title: 'User Last Name',
			tag: `{{wp.user_last_name}}`, // done
		},
		{
			title: 'User Display Name',
			tag: `{{wp.user_display_name}}`, // done
		},
		{
			title: 'User Username',
			tag: `{{wp.user_username}}`, // done
		},
		{
			title: 'User Email',
			tag: `{{wp.user_email}}`, // done
		},
		{
			title: 'User URL',
			tag: `{{wp.user_url}}`, // done
		},
		{
			title: 'Site Title',
			tag: `{{wp.site_title}}`, // done
		},
		{
			title: 'Site URL',
			tag: `{{wp.site_url}}`, // done
		},
		{
			title: 'Admin Email',
			tag: `{{wp.admin_email}}`, // done
		},
	];

	return tags;
}

export function getFormTags() {
	const tags = [
		{
			title: 'Form ID',
			tag: `{{form.form_id}}`, // done
		},
		{
			title: 'Form Label',
			tag: `{{form.form_name}}`, // done
		},
	];

	return tags;
}

export function getOtherTags() {
	const tags = [
		{
			title: 'Date',
			tag: `{{other.system_date}}`, // done
		},
		{
			title: 'Time',
			tag: `{{other.system_time}}`, // done
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
