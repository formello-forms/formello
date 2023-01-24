import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classnames from 'classnames';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

export default function save( { attributes, className } ) {

	const { 
		name,
		id,
		hideLabel,
		enableRtf,
		validation,
		showHelp,
		help,
		value,
		label,
		required,
		requiredText 
	} = attributes;

	className = classnames( 'formello' );

	const labelClassName = classnames( 'textarea-label', {
		hide: hideLabel,
	} );

	const fieldClassName = classnames( {
		'formello-rtf': enableRtf,
	} );

	// include only supported attributes
	let htmlAttrs = Object.fromEntries( SUPPORTED_ATTRIBUTES[ 'textarea' ].map( col => [col, attributes[col] ] ) );

	if ( validation ) {
		htmlAttrs[ 'data-bouncer-message' ] = validation;
	}

	return (
		<div { ...useBlockProps.save() } className={ className }>
			<label className={ labelClassName } for={ id }>
				<RichText.Content tagName="span" value={ label } />
				{ required && (
					<span className="required">
						{ requiredText }
					</span>
				) }
			</label>
			<textarea { ...htmlAttrs } className={ fieldClassName }>
				{ value }
			</textarea>
			{ help.length > 0 && (
				<RichText.Content tagName="small" value={ help } />
			) }
		</div>
	);
}
