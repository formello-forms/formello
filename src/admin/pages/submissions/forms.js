/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { Button, Card } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';
import { useState, useMemo, Fragment } from '@wordpress/element';
import { dateI18n, getDate, getSettings } from '@wordpress/date';
import { addQueryArgs } from '@wordpress/url';
import {
	trashPostAction,
	usePermanentlyDeletePostAction,
	useRestorePostAction,
	editPostAction,
} from '../../components/actions';
import { commentContent } from '@wordpress/icons';
import { useHistory } from '../../router';

/**
 * Internal dependencies
 */
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews';
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
					id: 'form',
					label: 'Form',
					children: [ 'title', 'excerpt' ],
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
		fields: [
			'form',
			'title',
			'excerpt',
			'entries',
			'author',
			'status',
			'date',
		],
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
			per_page: view.perPage,
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
		'formello',
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
				getValue: ( { item } ) => item.title?.rendered,
				render: ( { item } ) => {
					return (
						<div>
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
							{ item.submissions_count.news > 0 && (
								<span className="formello-badge">
									{ item.submissions_count.news }
								</span>
							) }
						</div>
					);
				},
				enableGlobalSearch: true,
				enableHiding: false,
			},
			{
				header: __( 'Excerpt' ),
				label: __( 'Excerpt' ),
				id: 'excerpt',
				getValue: ( { item } ) => item.excerpt.raw,
			},
			{
				header: __( 'Entries' ),
				id: 'entries',
				render: ( { item } ) => {
					return (
						<div>
							<Button
								variant="link"
								onClick={ ( e ) => {
									e.stopPropagation();
									history.push( {
										page: 'formello',
										section: 'submissions',
										form_id: item.id,
									} );
								} }
							>
								{ item.submissions_count.total }
							</Button>
						</div>
					);
				},
			},
			{
				header: __( 'Author' ),
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
				header: 'Shortcode',
				id: 'shortcode',
				render: ( { item } ) => {
					return <code>{ `[formello id=${ item.id }]` }</code>;
				},
				enableSorting: false,
			},
		],
		[ authors ]
	);

	const { data: shownData, paginationInfo } = useMemo( () => {
		return filterSortAndPaginate( forms, view, fields );
	}, [ view, forms, fields ] );

	const permanentlyDeletePostAction = usePermanentlyDeletePostAction();
	const restorePostAction = useRestorePostAction();
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
			trashPostAction,
			restorePostAction,
			permanentlyDeletePostAction,
			editPostAction,
		],
		[ permanentlyDeletePostAction, restorePostAction, history ]
	);

	return (
		<Fragment>
			<Header title={ __( 'Forms' ) } className="full-width">
				<Button
					variant="primary"
					size="small"
					href={ 'post-new.php?post_type=formello' }
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
