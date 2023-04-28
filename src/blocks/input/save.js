import {
	RichText,
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	InnerBlocks,
} from '@wordpress/block-editor';
import classnames from 'classnames';
import { SUPPORTED_ATTRIBUTES } from '../../components/field-options/constants';

export default function save( { attributes } ) {
	const {
		type,
		value,
		id,
		withButton,
		withOutput,
		grouped,
		advanced,
		validation,
		enableMismatch,
		mismatchMessage,
		match,
		enableAutoComplete,
		noWrapper,
		required,
		requiredText,
		label,
		hideLabel,
		showHelp,
		help,
		dateFormat,
		mode,
		inlineCalendar,
		timeFormat,
		enableTime,
		minDate,
	} = attributes;

	const borderProps = getBorderClassesAndStyles( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );

	const containerClass = classnames( 'formello', {
		'formello-group': withButton || withOutput,
		'formello-group grouped': grouped,
		'formello-checkbox':
			'checkbox' === type || 'radio' === type,
	} );

	const labelClassName = classnames( {
		hide: hideLabel,
	} );

	const fieldClassName = classnames( borderProps.className, {
		'formello-advanced': advanced,
	} );

	// include only supported attributes
	const htmlAttrs = Object.fromEntries( SUPPORTED_ATTRIBUTES[ type ].map( ( col ) => [ col, attributes[ col ] ] ) );

	Object.keys( htmlAttrs ).forEach( ( k ) => htmlAttrs[ k ] === '' && delete htmlAttrs[ k ] );

	if ( validation ) {
		htmlAttrs[ 'data-bouncer-message' ] = validation;
	}

	if ( enableMismatch && mismatchMessage ) {
		htmlAttrs[ 'data-bouncer-mismatch-message' ] = mismatchMessage;
	}

	if ( enableMismatch && match ) {
		htmlAttrs[ 'data-bouncer-match' ] = match;
	}

	if ( withOutput ) {
		htmlAttrs.oninput = 'this.nextElementSibling.value = this.value';
	}

	if ( ! enableAutoComplete ) {
		htmlAttrs.autocomplete = undefined;
	}

	if ( advanced && 'date' === type ) {
		htmlAttrs[ 'data-date-format' ] = dateFormat;
		htmlAttrs[ 'data-time-format' ] = timeFormat;
		htmlAttrs[ 'data-enable-time' ] = enableTime;
		htmlAttrs[ 'data-mode' ] = mode;
		htmlAttrs[ 'data-min-date' ] = minDate;
		htmlAttrs[ 'data-inline' ] = inlineCalendar;
	}

	if ( advanced && 'time' === type ) {
		htmlAttrs[ 'data-time-format' ] = timeFormat;
		htmlAttrs[ 'data-enable-time' ] = enableTime;
	}

	const inputStyle = {
		...borderProps.style,
		...spacingProps.style
	}

	if ( noWrapper || 'hidden' === type ) {
		return <input { ...htmlAttrs } className={ fieldClassName } style={ inputStyle } />;
	}

	return (
		<div { ...useBlockProps.save() } className={ containerClass }>
			{ 'hidden' !== type && (
				<label className={ labelClassName } htmlFor={ id }>
					<RichText.Content tagName="span" value={ label } />
					{ required && (
						<span className="required">
							{ requiredText }
						</span>
					) }
				</label>
			) }

			<input { ...htmlAttrs } className={ fieldClassName } style={ inputStyle } />

			<InnerBlocks.Content />
			{ withOutput && <output>{ value }</output> }
			{ 'hidden' !== type && showHelp && (
				<RichText.Content tagName="small" value={ help } />
			) }
		</div>
	);
}
