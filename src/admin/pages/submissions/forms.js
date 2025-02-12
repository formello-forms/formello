/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import {
	Button,
	Card,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';
import { useState, useMemo, Fragment } from '@wordpress/element';
import { dateI18n, getDate, getSettings } from '@wordpress/date';
import { addQueryArgs } from '@wordpress/url';
import {
	trashPost,
	permanentlyDeletePost,
	restorePost,
	editPost,
} from '../../actions';

import { commentContent } from '@wordpress/icons';
import { useHistory } from '../../router';

/**
 * Internal dependencies
 */
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews/wp';
import Header from '../../components/masthead.js';

// See https://github.com/WordPress/gutenberg/issues/55886
// We do not support custom statutes at the moment.
const STATUSES = [
	{ value: 'draft', label: __( 'Draft' ) },
	{ value: 'future', label: __( 'Scheduled' ) },
	{ value: 'pending', label: __( 'Pending Review' ) },
	{ value: 'private', label: __( 'Private' ) },
	{ value: 'publish', label: __( 'Published' ) },
	{ value: 'trash', label: __( 'Trash' ) },
];
const DEFAULT_STATUSES = 'draft, future, pending, private, publish'; // All but 'trash'.
const defaultLayouts = {
	table: {
		layout: {
			primaryField: 'id',
			combinedFields: [
				{
					id: 'title',
					label: 'Title',
					children: [ 'excerpt' ],
					direction: 'vertical',
				},
			],
		},
	},
};

export const Forms = () => {
	const history = useHistory();
	const [ view, setView ] = useState( {
		type: 'table',
		filters: [],
		fields: [ 'entries', 'author', 'status', 'date', 'form' ],
		titleField: 'title',
		descriptionField: 'excerpt',
		page: 1,
		perPage: 10,
		sort: {
			field: 'date',
			direction: 'desc',
		},
		search: '',
		// All fields are visible by default, so it's
		// better to keep track of the hidden ones.
		layout: defaultLayouts.table.layout,
	} );

	const queryArgs = useMemo( () => {
		const filters = {};
		view.filters.forEach( ( filter ) => {
			if ( filter.field === 'status' && filter.operator === 'isAny' ) {
				filters.status = filter.value;
			}
			if ( filter.field === 'author' && filter.operator === 'isAny' ) {
				filters.author = filter.value;
			} else if (
				filter.field === 'author' &&
				filter.operator === 'isNone'
			) {
				filters.author_exclude = filter.value;
			}
		} );
		// We want to provide a different default item for the status filter
		// than the REST API provides.
		if ( ! filters.status || filters.status === '' ) {
			filters.status = DEFAULT_STATUSES;
		}
		return {
			per_page: -1,
			page: view.page,
			_embed: 'author',
			order: view.sort?.direction,
			orderby: view.sort?.field,
			search: view.search,
			...filters,
		};
	}, [ view ] );

	const { records: forms, isResolving: isLoadingForms } = useEntityRecords(
		'postType',
		'formello_form',
		queryArgs
	);

	const { records: authors, isResolving: isLoadingAuthors } =
		useEntityRecords( 'root', 'user', { per_page: -1 } );

	const fields = useMemo(
		() => [
			{
				header: __( 'Title' ),
				id: 'title',
				label: __( 'Title' ),
				children: [ 'excerpt' ],
				getValue: ( { item } ) => item.title?.rendered,
				render: ( { item } ) => {
					return (
						<Button
							variant="link"
							onClick={ ( e ) => {
								e.stopPropagation();
								const href = addQueryArgs( 'post.php', {
									post: item.id,
									action: 'edit',
								} );
								document.location.href = href;
							} }
						>
							{ decodeEntities(
								item.title?.rendered || item.slug
							) || __( '(no title)' ) }
						</Button>
					);
				},
				enableGlobalSearch: true,
				enableHiding: false,
				enableSorting: true,
			},
			{
				header: __( 'Excerpt' ),
				label: __( 'Excerpt' ),
				id: 'excerpt',
				getValue: ( { item } ) => item.excerpt.raw,
			},
			{
				header: __( 'Entries' ),
				label: __( 'Entries' ),
				id: 'entries',
				enableSorting: false,
				render: ( { item } ) => {
					return (
						<HStack expanded={ false } spacing="0">
							<Button
								onClick={ ( e ) => {
									e.stopPropagation();
									history.push( {
										page: 'formello',
										section: 'submissions',
										form_id: item.id,
									} );
								} }
								icon={ commentContent }
								iconSize="20"
								label={ __( 'View submissions', 'formello' ) }
								showTooltip
							></Button>
							<span className="components-badge is-info has-icon">
								<span className="components-badge__content">
									{ item.submissions_count.news }
								</span>
							</span>
						</HStack>
					);
				},
			},
			{
				header: __( 'Author' ),
				label: __( 'Author' ),
				id: 'author',
				getValue: ( { item } ) => item._embedded?.author[ 0 ]?.name,
				elements:
					authors?.map( ( { id, name } ) => ( {
						value: id,
						label: name,
					} ) ) || [],
			},
			{
				header: __( 'Status' ),
				label: __( 'Status' ),
				id: 'status',
				/*getValue: ( { item } ) =>
					STATUSES.find( ( { value } ) => value === item.status )
						?.label ?? item.status,*/
				elements: STATUSES,
				filterBy: {
					operators: [ 'isAny', 'isNone', 'isAll', 'isNotAll' ],
				},
			},
			{
				header: __( 'Date' ),
				label: __( 'Date' ),
				id: 'date',
				render: ( { item } ) => {
					const formattedDate = dateI18n(
						getSettings().formats.datetimeAbbreviated,
						getDate( item.date )
					);
					return <time>{ formattedDate }</time>;
				},
			},
			{
				label: __( 'Shortcode' ),
				id: 'shortcode',
				render: ( { item } ) => {
					return <code>{ `[formello ref=${ item.id }]` }</code>;
				},
				enableSorting: false,
			},
		],
		[ authors, history ]
	);

	const { data: shownData, paginationInfo } = useMemo( () => {
		return filterSortAndPaginate( forms, view, fields );
	}, [ view, forms, fields ] );

	const actions = useMemo(
		() => [
			{
				id: 'view-submissions',
				label: __( 'View Submissions', 'formello' ),
				isPrimary: true,
				icon: commentContent,
				callback( posts ) {
					const post = posts[ 0 ];
					history.push( {
						page: 'formello',
						section: 'submissions',
						form_id: post.id,
					} );
				},
			},
			trashPost,
			permanentlyDeletePost,
			restorePost,
			editPost,
		],
		[ history ]
	);

	return (
		<Fragment>
			<Header title={ __( 'Forms' ) } className="full-width">
				<Button
					variant="primary"
					size="small"
					href={ 'post-new.php?post_type=formello_form' }
				>
					{ __( 'Add new' ) }
				</Button>
			</Header>
			<div className="formello-content">
				<Card>
					<DataViews
						paginationInfo={ paginationInfo }
						fields={ fields }
						actions={ actions }
						data={ shownData || [] }
						isLoading={ isLoadingForms || isLoadingAuthors }
						view={ view }
						onChangeView={ setView }
						defaultLayouts={ defaultLayouts }
					/>
				</Card>
			</div>
		</Fragment>
	);
};
