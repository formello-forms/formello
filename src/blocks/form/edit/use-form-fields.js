import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';
const ALLOWED_BLOCKS = [
	'formello/input',
	'formello/textarea',
	'formello/output',
	'formello/select',
	'formello/multichoices',
];

function getFieldConstraint( field ) {
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

	if ( field.attributes.advanced && 'date' !== field.attributes.type && field.attributes.dateFormat ) {
		constraints.push( 'date:' + field.attributes.dateFormat );
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

export function useFormFields( clientId ) {
	const [ data, setData ] = useState( false );

	useSelect(
		( select ) => {
			const fieldsBlock =
				select( blockEditorStore ).getClientIdsOfDescendants(
					clientId
				);

			const fields = {};
			const constraints = {};

			fieldsBlock.forEach( ( id ) => {
				const block = select( blockEditorStore ).getBlock( id );
				if ( ALLOWED_BLOCKS.includes( block.name ) ) {
					// get block type by name
					let type = block.name.split( '/' )[ 1 ];
					if ( 'input' === type ) {
						type = block.attributes.type;
					}
					fields[ block.attributes.name ] = type;

					if ( block.attributes.enableRtf ) {
						fields[ block.attributes.name ] = 'richtext';
					}
					if ( block.attributes.multiple && 'select' === type ) {
						fields[ block.attributes.name ] = type + '-multiple';
					}

					const constraint = getFieldConstraint( block );
					let name = block.attributes.name;

					if ( block.attributes.multiple ) {
						name += '.*';
					}
					if ( constraint ) {
						constraints[ name ] = constraint;
					}
				}
			} );
			setData( { fields, constraints } );
		},
		[ clientId ]
	);

	return data;
}

export function useFormFieldsBlocks( clientId ) {
	const fields = useSelect(
		( select ) => {
			const childBlocks =
				select( blockEditorStore ).getClientIdsOfDescendants(
					clientId
				);

			const data = [];

			childBlocks.forEach( ( id ) => {
				const block = select( blockEditorStore ).getBlock( id );
				if ( ALLOWED_BLOCKS.includes( block.name ) ) {
					data.push( block );
				}
			} );
			return data;
		},
		[ clientId ]
	);

	return fields;
}
