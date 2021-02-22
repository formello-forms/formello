/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
	RichText,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	Panel,
	Tooltip,
	PanelBody,
	TextareaControl,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	Flex,
	FlexItem,
	FlexBlock,
	Button,
	FormTokenField,
	Draggable,
} from '@wordpress/components';
import { cog, more, insert } from '@wordpress/icons';

import { useState, useEffect, Fragment } from '@wordpress/element';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';

const { createBlock, cloneBlock } = wp.blocks;

import OptionsList from './opts';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( {
	attributes,
	className,
	setAttributes,
	clientId,
} ) {
	// componentDidMount -> set field id
	useEffect(
		() =>
			setAttributes( {
				id: 'field_' + clientId.substr( 2, 9 ).replace( '-', '' ),
			} ),
		[]
	);

	const [ showRaw, setShowRaw ] = useState( false );
	const [ options, setOptions ] = useState( attributes.options );

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

	const defaultOpts = ( options ) => {
		if( !options.length ){
			return attributes.multiple ? [] : '';
		}
		options = options.map( ( opt ) => {
			return opt.value
		} )
		if( !attributes.multiple && options.length ){
			options = options[0]
		}
		return options
	};

	return (
		<div className="formello">
			<InspectorControls>
				<PanelBody title="Field Options" initialOpen={ true }>
					<TextControl
						label={ __( 'Name', 'formello' ) }
						value={ attributes.name }
						onChange={ ( val ) =>
							setAttributes( { name: val.replace(/\W/g, '') } )
						}
					/>
					<TextControl
						label={ __( 'Label', 'formello' ) }
						value={ attributes.label }
						onChange={ ( val ) =>
							setAttributes( { label: val } )
						}
					/>
					<ToggleControl
						label={ __(
							'Allow multiple choices?',
							'formello'
						) }
						checked={ attributes.multiple }
						onChange={ ( val ) =>
							setAttributes( { 
								multiple: val
							} )
						}
					/>
					<ToggleControl
						label={ __( 'Required', 'formello' ) }
						checked={ attributes.required }
						onChange={ ( val ) =>
							setAttributes( { required: val } )
						}
					/>
					{ attributes.required && (
						<ToggleControl
							label={ __( 'Mark as Required', 'formello' ) }
							checked={ attributes.markRequired }
							onChange={ ( newval ) =>
								setAttributes( { markRequired: newval } )
							}
						/>
					) }
				    <FormTokenField 
				    	label={ __( 'Selected option', 'formello' ) }
						value={
							attributes.selectedOpt &&
							attributes.selectedOpt.map( ( item ) => {
								return item.label
							} )
						}
						onChange={ (opts) => { 
							let selections = attributes.options.filter( x => opts.includes( x.label ) );
							setAttributes( { selectedOpt: selections } ) 
						} }
						suggestions={ 
							attributes.options &&
							attributes.options.map( (item) => {
								return item.label
							} )
						}
						maxSuggestions={ 3 }
						maxLength={ () => attributes.multiple ? 20 : 1 }
					/>
					<ToggleControl
						label={ __( 'Show description', 'formello' ) }
						checked={ attributes.showHelp }
						onChange={ ( newval ) =>
							setAttributes( { showHelp: newval } )
						}
					/>
					{ attributes.hasTooltip && (
						<TextareaControl
							label="Tooltip"
							help="Enter some useful text"
							value={ attributes.tooltip }
							onChange={ ( val ) =>
								setAttributes( { tooltip: val } )
							}
						/>
					) }
				</PanelBody>
				<PanelBody title="Options Select" initialOpen={ true }>
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
							help="Enter one option per row"
							placeholder="Insert value and label separated by comma. Ex.: US, United States Of America"
							defaultValue={ 
								attributes.options.map( ( item ) => {
									return item.value + ',' + item.label;
								} )
								.join( '\r\n' )
							}
							onChange={ ( val ) =>
								bulkOpts( val )
							}
						/> ) 
					}
					{ !showRaw && 
						<Fragment>
							<OptionsList 
								delete={ deleteRow }
								onChange={ handleChange }
								options={ attributes.options }
							/>
							<Button isPrimary isSmall onClick={ addNewRow }>Add option</Button>
						</Fragment>
					}
				

				</PanelBody>
			</InspectorControls>
			<Fragment>
				<label
					className={ attributes.labelClass }
					htmlFor={ attributes.id }
				>
					{ attributes.label }
					{ attributes.required && <span>*</span> }{ ' ' }
					{ attributes.hasTooltip && <span className='tooltip'>?</span> }
				</label>

				<select
					id={ attributes.id }
					name={ attributes.name }
					className={ attributes.fieldClass }
					multiple={ attributes.multiple }
					disabled
					value={ defaultOpts( attributes.selectedOpt ) }
				>
					{ 
						attributes.options.map( ( obj, index ) => { 
							return <option value={ obj.value } key={ index }>{ obj.label }</option>
						} )
					}
				</select>
				{ attributes.showHelp && (
					<RichText
						tagName="small"
						className={ className }
						value={ attributes.help }
						onChange={ ( help ) =>
							setAttributes( { help } )
						}
						placeholder={ __(
							'Enter help message...',
							'formello'
						) }
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/link',
						] }
						keepPlaceholderOnFocus={ true }
					/>
				) }
			</Fragment>
		</div>
	);
}
