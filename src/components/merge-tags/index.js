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
import { moreVertical } from '@wordpress/icons';
import { defaultTabs } from './use-tabs';
import TabContent from './tab-content';

export default function MergeTags( props ) {
	const {
		label,
		value,
		placeholder,
		help,
		onChange,
		icon = moreVertical,
		clientId,
		tabs = defaultTabs( clientId ),
	} = props;

	return (
		<BaseControl __nextHasNoMarginBottom>
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
						size="small"
					>
						{ () => (
							<TabContent tabs={ tabs } onChange={ onChange } />
						) }
					</DropdownMenu>
				}
				__next40pxDefaultSize
			/>
		</BaseControl>
	);
}

export function MergeTagsMenu( props ) {
	const { label, onChange, icon = moreVertical, clientId } = props;

	const tabs = defaultTabs( clientId );

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
