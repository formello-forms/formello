/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalText as Text,
	Button,
	Card,
	Icon,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { useState, useMemo, useCallback, Fragment } from '@wordpress/element';
import { dateI18n, getDate, getSettings } from '@wordpress/date';
import { heading, seen, starFilled } from '@wordpress/icons';
import { trashSubmissionAction } from '../../components/actions/submission.js';
import { useDispatch } from '@wordpress/data';
import {
	store as coreStore,
	useEntityRecord,
	useEntityRecords,
} from '@wordpress/core-data';
/**
 * Internal dependencies
 */
import { DataViews } from '@wordpress/dataviews';
import Header from '../../components/masthead.js';
import { useHistory, useLocation } from '../../router';

const EMPTY_ARRAY = [];
const defaultConfigPerViewType = {
	list: {},
};

const STATUSES = [
	{ value: 'starred', label: __( 'Favorites' ) },
	{ value: 'is_new', label: __( 'Unread' ) },
];

export const Submissions = () => {
	const history = useHistory();
	const { params } = useLocation();
	const [ view, setView ] = useState( {
		type: 'table',
		filters: [ { field: 'status', operator: 'isAny', value: 'all' } ],
		page: 1,
		perPage: 10,
		sort: {
			field: 'submitted_at',
			direction: 'desc',
		},
		search: '',
		visibleFilters: [ 'status' ],
		// All fields are visible by default, so it's
		// better to keep track of the hidden ones.
		hiddenFields: [ 'id' ],
		layout: {},
	} );

	const queryArgs = useMemo( () => {
		const filters = {};
		view.filters.forEach( ( filter ) => {
			if ( filter.field === 'status' && filter.operator === 'isAny' ) {
				filters.status = filter.value;
			}
		} );
		// We want to provide a different default item for the status filter
		// than the REST API provides.
		if ( ! filters.status || filters.status === 'all' ) {
			filters.status = '';
		}

		return {
			id: params.form_id,
			per_page: view.perPage,
			page: view.page,
			order: view.sort?.direction,
			orderby: view.sort?.field,
			search: view.search,
			...filters,
		};
	}, [ view, params ] );

	const submissions = useEntityRecords(
		'formello/v1',
		'submissions',
		queryArgs
	);

	const columns = useEntityRecord( 'formello/v1', 'columns', params.form_id );

	const { record: form } = useEntityRecord(
		'postType',
		'formello_form',
		params.form_id
	);

	const getColumns = useCallback( () => {
		if ( columns.hasResolved ) {
			return columns.record.columns;
		}
		return [];
	}, [ columns ] );

	const paginationInfo = useMemo( () => {
		return {
			totalItems: form?.submissions_count.total,
			totalPages: Math.ceil(
				form?.submissions_count.total / view.perPage
			),
		};
	}, [ form, view ] );

	const fields = useMemo( () => {
		const _fields = [
			{
				header: __( 'Status' ),
				id: 'status',
				getValue: ( { item } ) => item.id,
				render: ( { item } ) => {
					return (
						<VStack spacing={ 1 }>
							{ parseInt( item.details.is_new ) && (
								<Icon icon={ heading } label={ 'Is new' } />
							) }
							{ parseInt( item.details.starred ) && (
								<Icon icon={ starFilled } />
							) }
						</VStack>
					);
				},
				filters: [ 'isAny' ],
				elements: STATUSES,
				maxWidth: 25,
				width: 25,
				enableHiding: false,
				enableSorting: false,
			},
			{
				header: '#',
				id: 'id',
				getValue: ( { item } ) => item.id,
				render: ( { item } ) => (
					<Button
						variant="link"
						text={ item.id }
						onClick={ () =>
							history.push( {
								page: 'formello',
								section: 'submission',
								form_id: item.id,
							} )
						}
					/>
				),
				maxWidth: 25,
				width: 25,
				enableHiding: true,
				enableSorting: true,
			},
		];
		const cols = getColumns();
		const _columns = cols?.map( ( key ) => {
			return {
				accessor: key,
				id: key,
				header: key.replaceAll( '_', ' ' ).toUpperCase(),
				getValue: ( item ) => item[ key ],
				filters: [ { id: 'search', type: 'search' } ],
				render: ( { item } ) => {
					if ( 'submitted_at' === key ) {
						const formattedDate = dateI18n(
							getSettings().formats.datetimeAbbreviated,
							getDate( item.details.submitted_at )
						);
						return <time>{ formattedDate }</time>;
					}
					return (
						<Text numberOfLines={ 4 } truncate>
							{ decodeEntities( item.fields[ key ] ) }
						</Text>
					);
				},
				enableSorting: true,
				maxWidth: 400,
				width: 200,
			};
		} );
		return _fields.concat( _columns );
	}, [ history, getColumns ] );

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

	const { saveEntityRecord } = useDispatch( coreStore );
	const actions = useMemo(
		() => [
			trashSubmissionAction,
			{
				id: 'view-submission',
				label: __( 'View Submission', 'formello' ),
				isPrimary: true,
				icon: seen,
				callback( posts ) {
					const post = posts[ 0 ];
					history.push( {
						page: 'formello',
						section: 'submission',
						submission_id: post.id,
					} );
				},
			},
			{
				id: 'mark-as-starred',
				label: __( 'Toggle favorite' ),
				isPrimary: false,
				isBulk: true,
				isEligible: () => true,
				icon: starFilled,
				callback: ( posts ) => {
					const post = posts[ 0 ];
					saveEntityRecord( 'formello/v1', 'submissions', {
						id: post.id,
						details: {
							starred: ! parseInt( post.details.starred ),
						},
					} );
				},
			},
			{
				id: 'mark-as-new',
				label: __( 'Toggle new' ),
				isPrimary: false,
				isBulk: true,
				icon: heading,
				callback: ( posts ) => {
					const post = posts[ 0 ];
					saveEntityRecord( 'formello/v1', 'submissions', {
						id: post.id,
						details: { is_new: ! parseInt( post.details.is_new ) },
					} );
				},
			},
		],
		[ history, saveEntityRecord ]
	);

	// TODO: we need to handle properly `data={ data || EMPTY_ARRAY }` for when `isLoading`.
	return (
		<Fragment>
			<Header
				title={ __( 'Submissions', 'formello' ) }
				className="full-width"
			>
				<Button
					variant="primary"
					size="small"
					icon={ 'arrow-left' }
					onClick={ () =>
						history.push( {
							page: 'formello',
						} )
					}
				>
					{ __( 'Go back', 'formello' ) }
				</Button>
			</Header>
			<div className="formello-content">
				<Card>
					<DataViews
						paginationInfo={ paginationInfo }
						fields={ fields }
						actions={ actions }
						data={ submissions.records || EMPTY_ARRAY }
						isLoading={ submissions.isResolving }
						view={ view }
						onChangeView={ onChangeView }
						supportedLayouts={ [ 'table' ] }
					/>
				</Card>
			</div>
		</Fragment>
	);
};
