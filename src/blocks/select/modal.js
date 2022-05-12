import { Fragment, useState } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

import {
	ToggleControl,
	TextareaControl,
	Button,
	Modal,
} from '@wordpress/components';

import OptionsList from './opts';

export function OptionsModal( props ) {
	const { onRequestClose, attributes, setAttributes } = props;

	const [ showRaw, setShowRaw ] = useState( false );
	const [ showValue, setShowValue ] = useState( false );

	const addNewRow = () => {
		setAttributes( {
			options: [ ...attributes.options, { label: '', value: '' } ],
		} );
	};

	const deleteRow = ( record, index ) => {
		const items = [ ...attributes.options ]; // make a separate copy of the array
		items.splice( index, 1 );
		setAttributes( { options: items } );
	};

	const handleChange = ( value, index, prop ) => {
		// 1. Make a shallow copy of the items
		const items = [ ...attributes.options ];
		// 2. Make a shallow copy of the item you want to mutate
		const item = { ...attributes.options[ index ] };
		// 3. Replace the property you're intested in
		item[ prop ] = value;
		// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
		items[ index ] = item;
		// 5. Set the state to our new copy
		setAttributes( { options: items } );
	};

	const bulkOpts = ( val ) => {
		const opts = val.match( /[^\r\n]+/g );
		const newSettings = [];
		for ( const i in opts ) {
			const tmp = opts[ i ].split( ',' );
			newSettings.push( {
				value: tmp[ 0 ],
				label: tmp[ 1 ] ? tmp[ 1 ] : tmp[ 0 ],
			} );
		}
		setAttributes( { options: newSettings } );
	};

	return (
		<Modal
			title={ __( 'Options', 'formello' ) }
			onRequestClose={ onRequestClose }
			className={ 'formello-modal' }
			shouldCloseOnClickOutside={ false }
		>
			<div>
				<ToggleControl
					label={ __( 'Bulk add', 'formello' ) }
					checked={ showRaw }
					onChange={ ( newval ) => setShowRaw( newval ) }
				/>

				{ showRaw && (
					<TextareaControl
						label={ __( 'Options', 'formello' ) }
						help={ __(
							'Enter one option per row separated by comma. Ex.: [US, United States Of America]',
							'formello'
						) }
						placeholder={ __(
							'Insert value and label separated by comma. Ex.: US, United States Of America',
							'formello'
						) }
						defaultValue={ attributes.options
							.map( ( item ) => {
								return item.value + ',' + item.label;
							} )
							.join( '\r\n' ) }
						onChange={ ( val ) => bulkOpts( val ) }
						rows="6"
					/>
				) }
				{ ! showRaw && (
					<Fragment>
						<ToggleControl
							label={ __( 'Show value', 'formello' ) }
							checked={ showValue }
							onChange={ ( newval ) => setShowValue( newval ) }
						/>
						<OptionsList
							delete={ deleteRow }
							onChange={ handleChange }
							options={ attributes.options }
							showValue={ showValue }
						/>
						<Button isPrimary isSmall onClick={ addNewRow }>
							Add option
						</Button>
					</Fragment>
				) }
			</div>
			<div className="formello-modal-buttons">
				<Button isPrimary onClick={ onRequestClose }>
					Save
				</Button>
			</div>
		</Modal>
	);
}
