/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { SearchControl, TabPanel, MenuItem } from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';

export default function TabContent( { tabs, onChange } ) {
	const [ searchInput, setSearchInput ] = useState( '' );

	const filterAddon = ( element ) => {
		if ( '' === searchInput ) {
			return true;
		}
		return (
			element.title.toLowerCase().search( searchInput.toLowerCase() ) !==
			-1
		);
	};

	return (
		<Fragment>
			<SearchControl
				value={ searchInput }
				onChange={ setSearchInput }
				__nextHasNoMarginBottom
			/>
			<TabPanel tabs={ tabs }>
				{ ( tab ) =>
					tab.data
						.filter( ( element ) => {
							return filterAddon( element );
						} )
						.map( ( data ) => {
							return (
								<MenuItem
									key={ data.title }
									onClick={ () => onChange( data.tag ) }
									info={ data.description }
								>
									{ data.title }
								</MenuItem>
							);
						} )
				}
			</TabPanel>
		</Fragment>
	);
}
