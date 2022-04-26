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

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @param  props
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function mergeTags(props) {
	const { label, value, placeholder, onChange, className } = props;

	const icon = 'list-view';

	const change = (val) => {
		onChange( value + val )
	}

	return (
		<BaseControl>
			<InputControl
				className={className}
				value={value}
				label={label}
				onChange={(val) => onChange(val)}
				labelPosition="top"
				placeholder={placeholder}
				suffix={
					<Dropdown
						position="bottom right"
						renderToggle={({ isOpen, onToggle }) => (
							<Button
								isSmall
								icon={icon}
								onClick={onToggle}
								aria-expanded={isOpen}
							/>
						)}
						renderContent={({ isOpen, onToggle }) => (
							<TagSelector
								{...props}
								insertTag={ (val)=>{
									onToggle()
									change(val)
								} }
								onToggle={onToggle}
							/>
						)}
					/>
				}
			/>
		</BaseControl>
	);
}
