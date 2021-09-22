/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	Fragment,
	RawHTML,
	useState,
	useEffect
} from '@wordpress/element';

import {
	__,
	sprintf,
} from '@wordpress/i18n';

import {
	compose,
} from '@wordpress/compose';

import {
	useSelect,
} from '@wordpress/data';

import {
	ToggleControl,
	TextareaControl,
	Button,
	Modal,
} from '@wordpress/components';

import OptionsList from './opts';

export function OptionsModal ( props ) {

	const {
		onRequestClose,
		attributes,
		setAttributes
	} = props;

	const [ showRaw, setShowRaw ] = useState( false );

	const addNewRow = (e) => {
		setAttributes( {
			options: [
				...attributes.options,
				{ label: '', value: '' }
			]
		} )
	}

	const deleteRow = (record, index) => {

		let items = [...attributes.options]; // make a separate copy of the array
		items.splice(index, 1);
		setAttributes( { options: items } );

	}

	const handleChange = ( value, index, prop ) => {
		// 1. Make a shallow copy of the items
		let items = [...attributes.options];
		// 2. Make a shallow copy of the item you want to mutate
		let item = {...attributes.options[index]};
		// 3. Replace the property you're intested in
		item[prop] = value;
		// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
		items[index] = item;
		// 5. Set the state to our new copy
		setAttributes( { options: items } );
	}

	const bulkOpts = ( val ) => {
		let opts = val.match(/[^\r\n]+/g)
		let newSettings = [];
		for (let i in opts) {
			let tmp = opts[i].split(",");
			newSettings.push( { value: tmp[0], label: tmp[1] } );
		}
		setAttributes( { options: newSettings } );
	}

	return (
		<Modal
			title={ __( 'Options', 'formello' ) }
			onRequestClose={ onRequestClose }
		>
			<div>
				<ToggleControl
					label="Bulk add"
					checked={ showRaw }
					onChange={ ( newval ) =>
						setShowRaw( newval )
					}
				/>
				{ showRaw && 
					( <TextareaControl
						label="Bulk"
						help={ __( 'Enter one option per row separated by comma. Ex.: [US, United States Of America]', 'formello' ) }
						placeholder={ __( 'Insert value and label separated by comma. Ex.: US, United States Of America', 'formello' ) }
						defaultValue={ 
							attributes.options.map( ( item ) => {
								return item.value + ',' + item.label;
							} )
							.join( '\r\n' )
						}
						onChange={ ( val ) =>
							bulkOpts( val )
						}
						rows="6"
					/> ) 
				}
				{ !showRaw && 
					<Fragment>
						<OptionsList 
							delete={ deleteRow }
							onChange={ handleChange }
							options={ attributes.options }
						/>
						<Button isPrimary onClick={ addNewRow }>Add option</Button>
					</Fragment>
				}
			</div>
			<div className="formello-modal-footer">
				<Button 
					isPrimary
					onClick={ onRequestClose }
				>Save</Button>
			</div>
		</Modal>
	);
}
