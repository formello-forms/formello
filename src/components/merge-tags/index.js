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
import { useTabs } from './use-tabs';
import TabContent from './tab-content';

export default function MergeTags( props ) {
	const {
		label,
		value,
		placeholder,
		help,
		onChange,
		icon = 'list-view',
		clientId,
	} = props;

	const tabs = useTabs( clientId );

	return (
		<BaseControl>
			<InputControl
				value={ value }
				label={ label }
				onChange={ onChange }
				placeholder={ placeholder }
				help={ help }
				suffix={
					<DropdownMenu
						icon={ icon }
						label={ label }
						toggleProps={ { isSmall: true } }
					>
						{ () => (
							<TabContent tabs={ tabs } onChange={ onChange } />
						) }
					</DropdownMenu>
				}
			/>
		</BaseControl>
	);
}

export function MergeTagsMenu( props ) {
	const { label, onChange, icon = 'list-view', clientId } = props;

	const tabs = useTabs( clientId );

	return (
		<DropdownMenu
			icon={ icon }
			label={ label }
			toggleProps={ { isSmall: true } }
		>
			{ () => <TabContent tabs={ tabs } onChange={ onChange } /> }
		</DropdownMenu>
	);
}
