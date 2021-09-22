import React, { useState, useEffect } from 'react';
import { TextControl, TabPanel } from '@wordpress/components';
import { isEmpty } from 'lodash';
import TagList from './tagList';
import SearchTags from './searchTags';

const { __ } = wp.i18n;

function TagSelector( props ) {

	const { clientId, insertTag } = props;
	const [ search, setSearch ] = useState('');

	const tabs = [
		{
			name: 'fields',
			title: 'Fields',
		},
		{
			name: 'wordpress',
			title: 'WordPress',
		},
		{
			name: 'meta',
			title: 'Meta',
		},
		{
			name: 'other',
			title: 'Other',
		},
	];

	return (
		<div className="formello-mergetags-container">
			<div>
				<TextControl
					value={ search }
					onChange={ setSearch }
					placeholder={ __( 'Search Tags', 'formello' ) }
				/>
			</div>
			<div>
				{ isEmpty( search ) ? (
					<TabPanel
						className=''
						activeClass=''
						tabs={ tabs }
					>
						{ ( tab ) => {
							return (
								<TagList
									list={ tab.name }
									clientId={ clientId }
									onSelect={ insertTag }
								/>
							);
						}}
					</TabPanel>
				) : (
					<SearchTags
						search={ search }
						clientId={ clientId }
						onSelect={ insertTag }
					/>
				)}
			</div>
		</div>
	);
}

export default TagSelector;