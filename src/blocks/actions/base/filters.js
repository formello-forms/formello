/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks; 
const { createHigherOrderComponent } = wp.compose;
const { Fragment }	= wp.element;
const { Button, Fill } = wp.components;
const { InspectorAdvancedControls }	= wp.editor;
import OptionsList from "./option-fields";
import { useState } from '@wordpress/element';

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {function} BlockEdit Block edit component.
 *
 * @return {function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {

	return ( props ) => {

		const {
			attributes,
			setAttributes,
			isSelected,
			name
		} = props;

		if( !name.includes('formello/actions') ){
			return (<BlockEdit {...props} />)
		}

		const addNewRow = (e) => {
			setAttributes( {
				settings: {
					...attributes.settings,
					options: [
						...attributes.settings.options,
						{ key: '', value: '' }
					]
				}
			})
		}

		const handleChange = ( value, index, prop ) => {
			// 1. Make a shallow copy of the items
			let items = [...attributes.settings.options];
			// 2. Make a shallow copy of the item you want to mutate
			let item = {...attributes.settings.options[index]};
			// 3. Replace the property you're intested in
			item[prop] = value;
			// 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
			items[index] = item;
			// 5. Set the state to our new copy
			setAttributes( { settings: { ...attributes.settings, options: items } } );
		}

		const deleteRow = (record, index) => {

			let items = [...attributes.settings.options]; // make a separate copy of the array
			items.splice(index, 1);
			setAttributes( { settings: { ...attributes.settings, options: items } } );

		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				{ isSelected &&
			        <Fill name="formello-options-slot">
			            {
			                ( fillProps ) => {
			                    return (
			                    	<Fragment>
									<OptionsList 
										{...props}
										clientId={ props.clientId }
										add={ addNewRow.bind(this) }
										delete={ deleteRow }
										onChange={ handleChange }
										options={ attributes.settings.options }
									/>
									<Button 
										isSmall 
										isPrimary
										onClick={ addNewRow }
									>Add new</Button>
									</Fragment>
			                    )
			                }
			            }
			        </Fill>
				}

			</Fragment>
		);
	};
}, 'withAdvancedControls');

addFilter(
	'editor.BlockEdit',
	'formello/options-control',
	withAdvancedControls
);
