import {
	getFieldsTags,
	getWordpressTags,
	getOtherTags,
	getMetaTags,
} from './functions';

export function useTabs( clientId ) {
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
			name: 'meta',
			title: 'Meta',
			data: getMetaTags(),
		},
		{
			name: 'other',
			title: 'Other',
			data: getOtherTags(),
		},
	];

	return tabs;
}
