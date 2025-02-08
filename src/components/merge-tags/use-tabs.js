import { getFieldsTags, getWordpressTags, getOtherTags } from './functions';

export function defaultTabs( clientId ) {
	const tabs = [
		{
			name: 'fields',
			title: 'Fields',
			data: getFieldsTags( clientId ),
		},
		{
			name: 'wordpress',
			title: 'WordPress',
			data: getWordpressTags(),
		},
		{
			name: 'other',
			title: 'Other',
			data: getOtherTags(),
		},
	];

	return tabs;
}
