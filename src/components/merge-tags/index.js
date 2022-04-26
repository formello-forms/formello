/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import {
	BaseControl,
	Button,
	Dropdown,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';

import TagSelector from './tagSelector';

import './editor.scss';

export default function mergeTags( props ) {
	const { label, value, placeholder, onChange, className } = props;

	const icon = 'list-view';

	const change = ( val ) => {
		onChange( value + val );
	};

	return (
		<BaseControl>
			<InputControl
				className={ className }
				value={ value }
				label={ label }
				onChange={ ( val ) => onChange( val ) }
				labelPosition="top"
				placeholder={ placeholder }
				suffix={
					<Dropdown
						position="bottom right"
						renderToggle={ ( { isOpen, onToggle } ) => (
							<Button
								isSmall
								icon={ icon }
								onClick={ onToggle }
								aria-expanded={ isOpen }
							/>
						) }
						renderContent={ ( { onToggle } ) => (
							<TagSelector
								{ ...props }
								insertTag={ ( val ) => {
									onToggle();
									change( val );
								} }
								onToggle={ onToggle }
							/>
						) }
					/>
				}
			/>
		</BaseControl>
	);
}
