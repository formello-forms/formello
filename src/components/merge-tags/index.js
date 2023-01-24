/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import {
	BaseControl,
	DropdownMenu,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import {
	useTabs,
} from './use-tabs';
import TabContent from './tab-content';

export default function mergeTags( props ) {
	const { 
		label,
		value,
		placeholder,
		onChange,
		icon = 'list-view',
		clientId,
		tabs = useTabs( clientId ),
		children
	} = props;

	const change = ( val ) => {
		onChange( val );
	};

	return (
		<BaseControl>
			<InputControl
				value={ value }
				label={ label }
				onChange={ onChange }
				placeholder={ placeholder }
				suffix={
					<DropdownMenu 
						icon={ icon } 
						label={ label } 
						toggleProps={{ isSmall: true }}
					>
						{ ( { onClose } ) => (
							
							<TabContent tabs={ tabs } onChange={ onChange } />
						
						) }
					</DropdownMenu>
				}
			/>
		</BaseControl>
	);
}
