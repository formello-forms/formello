import React, { Fragment, useEffect } from 'react';
import {
	getFieldsTags,
	getWordpressTags,
	getFormTags,
	getOtherTags,
	getMetaTags,
} from './functions';
import TagList from './tagList';
import { get, isEmpty } from 'lodash';

function SearchTags( props ) {
	const search = props.search;

	const getFilteredTags = () => {
		const fields = getFieldsTags(props.clientId, false);

		const filteredFields = fields.filter((field) => {
			const title = get(field, 'title');

			return title.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		const wpTags = getWordpressTags();
		const filteredWordpressTags = wpTags.filter((field) => {
			const title = get(field, 'title');

			return title.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		const formTags = getFormTags();
		const filteredFormTags = formTags.filter((field) => {
			const title = get(field, 'title');

			return title.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		const otherTags = getOtherTags();
		const filteredOtherTags = otherTags.filter((field) => {
			const title = get(field, 'title');

			return title.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		const metaTags = getMetaTags();
		const filteredMetaTags = metaTags.filter((field) => {
			const title = get(field, 'title');

			return title.toLowerCase().search(search.toLowerCase()) !== -1;
		});

		const tabs = [
			{
				list: 'fields',
				label: 'Fields',
				data: filteredFields,
			},
			{
				list: 'wordpress',
				label: 'Wordpress Tags',
				data: filteredWordpressTags,
			},
			{
				list: 'form',
				label: 'Form Tags',
				data: filteredFormTags,
			},
			{
				list: 'other',
				label: 'Other Tags',
				data: filteredOtherTags,
			},
			{
				list: 'meta',
				label: 'Meta',
				data: filteredMetaTags,
			},
		];

		if( noFields ){
			tabs = tabs.shift();
		}

		return tabs;

	};

	const noTagsFound = () => {
		const tags = getFilteredTags();
		let emptyGroups = [];

		tags.forEach((tag) => {
			if (isEmpty(tag.data)) {
				emptyGroups.push(tag.list);
			}
		});

		const notFound = emptyGroups.length === 5;

		return notFound;
	};

	return (
		<div>
			{getFilteredTags().map((result, index) => {
				const { list, label, data } = result;

				return (
					!isEmpty(data) && (
						<Fragment key={index}>
							<h4>{label}</h4>
							<TagList
								list={list}
								data={data}
								noStyling
								onSelect={props.onSelect}
							/>
						</Fragment>
					)
				);
			})}
			{noTagsFound() && (
				<div>
					<h3>No Tags Found</h3>
				</div>
			)}
		</div>
	);
}

export default SearchTags;