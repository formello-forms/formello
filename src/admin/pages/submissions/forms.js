/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalUseNavigator as useNavigator,
	__experimentalHeading as Heading,
	__experimentalVStack as VStack,
	Card,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';
import { useState, useMemo, useCallback, Fragment } from '@wordpress/element';
import { dateI18n, getDate, getSettings } from '@wordpress/date';
import {
	trashPostAction,
	usePermanentlyDeletePostAction,
	useRestorePostAction,
	useEditPostAction,
} from '../../components/actions';
import { commentContent } from '@wordpress/icons';
import { OPERATOR_IN } from '../../components/dataviews/constants';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { DataViews } from '../../components/dataviews';
import Header from '../../components/masthead.js';

const EMPTY_ARRAY = [];
const defaultConfigPerViewType = {
	list: {},
};

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
const DEFAULT_STATUSES = 'draft,future,pending,private,publish'; // All but 'trash'.

export const Forms = () => {
	const { goTo } = useNavigator();
	const [ view, setView ] = useState( {
		type: 'list',
		filters: [
			{ field: 'status', operator: OPERATOR_IN, value: 'publish' },
		],
		page: 1,
		perPage: 10,
		sort: {
			field: 'date',
			direction: 'desc',
		},
		search: '',
		visibleFilters: [ 'status' ],
		// All fields are visible by default, so it's
		// better to keep track of the hidden ones.
		hiddenFields: [ 'shortcode' ],
		layout: {},
	} );

	const queryArgs = useMemo( () => {
		const filters = {};
		view.filters.forEach( ( filter ) => {
			if (
				filter.field === 'status' &&
				filter.operator === OPERATOR_IN
			) {
				filters.status = filter.value;
			}
			if (
				filter.field === 'author' &&
				filter.operator === OPERATOR_IN
			) {
				filters.author = filter.value;
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

	// Request post statuses to get the proper labels.
	const forms = useEntityRecords( 'postType', 'formello_form', queryArgs );

	const { records: authors } = useEntityRecords( 'root', 'user', {
		who: 'authors',
	} );

	const paginationInfo = useMemo( () => {
		return {
			totalItems: forms?.totalItems,
			totalPages: forms?.totalPages,
		};
	}, [ forms ] );

	const fields = useMemo(
		() => [
			{
				header: __( 'Form' ),
				id: 'title',
				getValue: ( item ) => item.title?.rendered || item.slug,
				render: ( { item } ) => {
					return (
						<VStack spacing={ 1 }>
							<Heading as="h3" level={ 5 }>
								<Button
									variant="link"
									onClick={ () => {
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
									<span className="badge">
										{ item.submissions_count.news }
									</span>
								) }
							</Heading>
						</VStack>
					);
				},
				maxWidth: 400,
				enableHiding: false,
			},
			{
				header: 'Shortcode',
				id: 'shortcode',
				getValue: ( item ) => item.id,
				render: ( { item } ) => {
					return <code>{ `[formello id=${ item.id }]` }</code>;
				},
				enableSorting: true,
			},
			{
				header: __( 'Author' ),
				id: 'author',
				getValue: ( item ) => item._embedded?.author[ 0 ]?.name,
				render: ( { item } ) => {
					const author = item._embedded?.author[ 0 ];
					return (
						<a href={ `user-edit.php?user_id=${ author.id }` }>
							{ author.name }
						</a>
					);
				},
				filters: [ OPERATOR_IN ],
				elements: [
					{
						value: '',
						label: __( 'All' ),
					},
					...( authors?.map( ( { id, name } ) => ( {
						value: id,
						label: name,
					} ) ) || [] ),
				],
			},
			{
				header: __( 'Status' ),
				id: 'status',
				getValue: ( { item } ) =>
					STATUSES.find( ( { value } ) => value === item.status )
						?.label ?? item.status,
				filters: [ OPERATOR_IN ],
				elements: STATUSES,
				enableSorting: false,
			},
			{
				header: 'Date',
				id: 'date',
				getValue: ( item ) => item.date,
				render: ( { item } ) => {
					const formattedDate = dateI18n(
						getSettings().formats.datetimeAbbreviated,
						getDate( item.date )
					);
					return <time>{ formattedDate }</time>;
				},
				enableSorting: true,
			},
		],
		[ authors ]
	);

	const onChangeView = useCallback(
		( viewUpdater ) => {
			let updatedView =
				typeof viewUpdater === 'function'
					? viewUpdater( view )
					: viewUpdater;
			if ( updatedView.type !== view.type ) {
				updatedView = {
					...updatedView,
					layout: {
						...defaultConfigPerViewType[ updatedView.type ],
					},
				};
			}

			setView( updatedView );
		},
		[ view ]
	);

	const permanentlyDeletePostAction = usePermanentlyDeletePostAction();
	const restorePostAction = useRestorePostAction();
	const editPostAction = useEditPostAction();
	const actions = useMemo(
		() => [
			{
				id: 'view-submissions',
				label: __( 'View Submissions', 'formello' ),
				isPrimary: true,
				icon: commentContent,
				callback( post ) {
					goTo( '/formello/submissions/' + post.id );
				},
			},
			trashPostAction,
			restorePostAction,
			permanentlyDeletePostAction,
			editPostAction,
		],
		[ permanentlyDeletePostAction, restorePostAction, editPostAction, goTo ]
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
						data={ forms.records || EMPTY_ARRAY }
						isLoading={ forms.isResolving }
						view={ view }
						onChangeView={ onChangeView }
					/>
				</Card>
			</div>
		</Fragment>
	);
};
