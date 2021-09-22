/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { BaseControl, Button, Dropdown, Dashicon, PanelRow } from '@wordpress/components';
import { __experimentalInputControl as InputControl } from '@wordpress/components';

import { useState } from '@wordpress/element';
import TagSelector from './tagSelector';

import './editor.scss';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function mergeTags( props ) {

	const {
		label,
		value,
		placeholder,
		attributes,
		setAttributes,
		onChange,
		className
	} = props;

	const icon = 'list-view';

	return (
		<BaseControl>
			<InputControl 
				className={ className }
				value={ value }
				label={ label }
				onChange={ (val) => onChange(val) }
				labelPosition="top"
				placeholder={ placeholder }
				suffix={ 
				    <Dropdown
				        className="my-container-class-name"
				        contentClassName="my-popover-content-classname"
				        position="bottom right"
				        renderToggle={ ( { isOpen, onToggle } ) => (
				            <Button 
				            	isSmall
				            	icon={ icon } 
								onClick={ onToggle }
				            	aria-expanded={ isOpen }
				            />
				        ) }
				        renderContent={ ( { isOpen, onToggle } ) => (
							<TagSelector {...props} insertTag={ onChange } onToggle={ onToggle } />
				        ) }
				    />
				}
			 />
		</BaseControl>
	);
}
