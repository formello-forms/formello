/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import {
	__experimentalVStack as VStack,
	Button,
	Card,
	Icon,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { useState, useMemo, Fragment, RawHTML } from '@wordpress/element';
import { dateI18n, getDate, getSettings } from '@wordpress/date';
import { heading, seen, starFilled } from '@wordpress/icons';
import { trashSubmissionAction } from '../../actions/trash-submission.js';
import { useDispatch } from '@wordpress/data';
import {
	store as coreStore,
	useEntityRecord,
	useEntityRecords,
} from '@wordpress/core-data';
/**
 * Internal dependencies
 */
import { DataViews } from '@wordpress/dataviews/wp';
import Header from '../../components/masthead.js';
import { useHistory, useLocation } from '../../router';

const EMPTY_ARRAY = [];

const STATUSES = [
	{ value: 'starred', label: __( 'Favorites' ) },
	{ value: 'is_new', label: __( 'Unread' ) },
];

const defaultLayouts = {
	table: {
		layout: {
			primaryField: 'id',
			combinedFields: [
				{
					id: 'title',
					label: 'Title',
					children: [ 'status' ],
					direction: 'vertical',
				},
			],
			styles: {
				id: {
					maxWidth: '40px',
					width: '40px',
				},
				status: {
					maxWidth: '40px',
					width: '40px',
				},
			},
		},
	},
};

const DataView = ( { columns } ) => {
	const history = useHistory();
	const { params } = useLocation();
	const [ view, setView ] = useState( {
		type: 'table',
		filters: [],
		titleField: 'id',
		fields: [ 'status', ...columns ],
		page: 1,
		perPage: 10,
		sort: {
			field: 'submitted_at',
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
			search: view.search || undefined,
			...filters,
		};
	}, [ view, params ] );

	const {
		records: submissions,
		isResolving: isLoadingSubmissions,
		totalItems,
		totalPages,
	} = useEntityRecords( 'formello/v1', 'submissions', queryArgs );

	const paginationInfo = useMemo( () => {
		return {
			totalItems,
			totalPages,
		};
	}, [ totalItems, totalPages ] );

	const fields = useMemo( () => {
		const _fields = [
			{
				header: __( 'Status' ),
				id: 'status',
				render: ( { item } ) => {
					return (
						<VStack spacing={ 1 }>
							{ parseInt( item.details.is_new ) && (
								<div className={ 'formello-new' }>
									<Icon
										icon={ heading }
										title={ __( 'Is new', 'formello' ) }
										fill={ 'currentColor' }
									/>
								</div>
							) }
							{ parseInt( item.details.starred ) && (
								<div className={ 'formello-star' }>
									<Icon
										icon={ starFilled }
										fill={ 'currentColor' }
										title={ __(
											'Is favorite',
											'formello'
										) }
									/>
								</div>
							) }
						</VStack>
					);
				},
				filters: [ 'isAny' ],
				elements: STATUSES,
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
								form_id: params.form_id,
								submission_id: item.id,
							} )
						}
					/>
				),
				enableHiding: false,
				enableSorting: true,
			},
		];
		const _columns = columns?.map( ( key ) => {
			return {
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
						<RawHTML className="field-content">
							{ decodeEntities( item.fields[ key ] ) }
						</RawHTML>
					);
				},
				enableSorting: true,
			};
		} );
		return _fields.concat( _columns );
	}, [ history, columns, params.form_id ] );

	const { saveEntityRecord } = useDispatch( coreStore );

	const actions = useMemo(
		() => [
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
				supportsBulk: true,
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
				supportsBulk: true,
				icon: heading,
				callback: ( posts ) => {
					const post = posts[ 0 ];
					saveEntityRecord( 'formello/v1', 'submissions', {
						id: post.id,
						details: { is_new: ! parseInt( post.details.is_new ) },
					} );
				},
			},
			trashSubmissionAction,
		],
		[ history, saveEntityRecord ]
	);

	return (
		<DataViews
			paginationInfo={ paginationInfo }
			fields={ fields }
			actions={ actions }
			data={ submissions || EMPTY_ARRAY }
			isLoading={ isLoadingSubmissions }
			view={ view }
			onChangeView={ setView }
			defaultLayouts={ defaultLayouts }
		/>
	);
};

export const Submissions = () => {
	const history = useHistory();
	const { params } = useLocation();

	const columns = useEntityRecord( 'formello/v1', 'columns', params.form_id );

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
					{ columns.hasResolved ? (
						<DataView columns={ columns.record.columns } />
					) : (
						<Spinner />
					) }
				</Card>
			</div>
		</Fragment>
	);
};
