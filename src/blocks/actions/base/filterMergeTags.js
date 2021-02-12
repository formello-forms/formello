/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks; 
const { createHigherOrderComponent } = wp.compose;
const { Fragment }	= wp.element;
const { Fill } = wp.components;
import MergeTags from '../../components/merge-tags';
import { useState } from '@wordpress/element';

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {function} BlockEdit Block edit component.
 *
 * @return {function} BlockEdit Modified block edit component.
 */
const withMergeControls = createHigherOrderComponent( ( BlockEdit ) => {

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

		const updateSetting = ( name, value ) => {
			var newSettings = Object.assign( {}, attributes.settings.merge_fields );
			newSettings[ name ] = value;
			setAttributes( { settings: { ...attributes.settings, merge_fields: newSettings } } );
		};

		return (
			<Fragment>
				<BlockEdit {...props} />
				{ isSelected &&
			        <Fill name="formello-merge-slot">
			            {
			                ( fillProps ) => {
			                    return (
			                    	<Fragment>
										<MergeTags {...props} 
											label={ props.label }
											value={ props.value }
											settingname={ props.settingname }
											onChange={ ( val ) => { updateSetting( props.settingname, val ) } } />
									</Fragment>
			                    )
			                }
			            }
			        </Fill>
				}

			</Fragment>
		);
	};
}, 'withMergeControls');

addFilter(
	'editor.BlockEdit',
	'formello/merge-control',
	withMergeControls
);
