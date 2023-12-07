/**
 * External dependencies
 */
import {
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	useReactTable,
	flexRender,
} from '@tanstack/react-table';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	chevronDown,
	chevronUp,
	check,
	arrowUp,
	arrowDown,
} from '@wordpress/icons';
import {
	Button,
	Icon,
	VisuallyHidden,
	Dropdown,
	MenuGroup,
	MenuItem,
	Spinner,
	CheckboxControl,
} from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import BulkActions from './bulk-actions';

/**
 * Internal dependencies
 */
import ItemActions from './item-actions';

const EMPTY_OBJECT = {};
const sortingItemsInfo = {
	asc: { icon: arrowUp, label: __( 'Sort ascending' ) },
	desc: { icon: arrowDown, label: __( 'Sort descending' ) },
};
const sortIcons = { asc: chevronUp, desc: chevronDown };
function HeaderMenu( { dataView, header } ) {
	if ( header.isPlaceholder ) {
		return null;
	}
	const text = flexRender(
		header.column.columnDef.header,
		header.getContext()
	);
	const isSortable = !! header.column.getCanSort();
	const isHidable = !! header.column.getCanHide();
	if ( ! isSortable && ! isHidable ) {
		return text;
	}
	const sortedDirection = header.column.getIsSorted();
	if ( ! isSortable ) {
		return (
			<Button
				icon={ sortIcons[ header.column.getIsSorted() ] }
				iconPosition="right"
				text={ text }
				style={ { padding: 0 } }
			/>
		);
	}
	return (
		<Dropdown
			className="my-container-class-name"
			contentClassName="my-popover-content-classname"
			popoverProps={ { placement: 'bottom-start' } }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					icon={ sortIcons[ header.column.getIsSorted() ] }
					iconPosition="right"
					text={ text }
					style={ { padding: 0 } }
					onClick={ onToggle }
					aria-expanded={ isOpen }
				/>
			) }
			renderContent={ () => (
				<MenuGroup>
					{ Object.entries( sortingItemsInfo ).map(
						( [ direction, info ] ) => (
							<MenuItem
								key={ direction }
								prefix={ <Icon icon={ info.icon } /> }
								suffix={
									sortedDirection === direction && (
										<Icon icon={ check } />
									)
								}
								onClick={ ( event ) => {
									event.preventDefault();
									if ( sortedDirection === direction ) {
										dataView.resetSorting();
									} else {
										dataView.setSorting( [
											{
												id: header.column.id,
												desc: direction === 'desc',
											},
										] );
									}
								} }
							>
								{ info.label }
							</MenuItem>
						)
					) }
				</MenuGroup>
			) }
		/>
	);
}

function ViewList( {
	view,
	onChangeView,
	fields,
	actions,
	data,
	isLoading = false,
	paginationInfo,
} ) {
	const columns = useMemo( () => {
		const _columns = fields.map( ( field ) => {
			const { render, getValue, ...column } = field;
			column.cell = ( props ) =>
				render( { item: props.row.original, view, row: props.row } );
			if ( getValue ) {
				column.accessorFn = ( item ) => getValue( { item } );
			}

			return column;
		} );
		if ( true ) {
			_columns.unshift( {
				header: ( props ) => {
					return (
						<CheckboxControl
							__nextHasNoMarginBottom
							checked={ props.table.getIsAllRowsSelected() }
							indeterminate={ props.table.getIsSomeRowsSelected() }
							onChange={ () =>
								props.table.toggleAllRowsSelected()
							}
						/>
					);
				},
				id: 'selection',
				cell: ( props ) => {
					return (
						<CheckboxControl
							__nextHasNoMarginBottom
							checked={ props.row.getIsSelected() }
							onChange={ props.row.getToggleSelectedHandler() }
						/>
					);
				},
				enableHiding: false,
				width: 40,
			} );
		}
		if ( actions?.length ) {
			_columns.push( {
				header: <VisuallyHidden>{ __( 'Actions' ) }</VisuallyHidden>,
				id: 'actions',
				cell: ( props ) => {
					return (
						<ItemActions
							item={ props.row.original }
							actions={ actions }
						/>
					);
				},
				enableHiding: false,
			} );
		}

		return _columns;
	}, [ fields, actions, view ] );

	const columnVisibility = useMemo( () => {
		if ( ! view.hiddenFields?.length ) {
			return;
		}
		return view.hiddenFields.reduce(
			( accumulator, fieldId ) => ( {
				...accumulator,
				[ fieldId ]: false,
			} ),
			{}
		);
	}, [ view.hiddenFields ] );

	const [ rowSelection, setRowSelection ] = useState( {} );

	const dataView = useReactTable( {
		data,
		columns,
		manualSorting: true,
		manualFiltering: true,
		manualPagination: true,
		enableRowSelection: true,
		state: {
			sorting: view.sort
				? [
						{
							id: view.sort.field,
							desc: view.sort.direction === 'desc',
						},
				  ]
				: [],
			globalFilter: view.search,
			pagination: {
				pageIndex: view.page,
				pageSize: view.perPage,
			},
			columnVisibility: columnVisibility ?? EMPTY_OBJECT,
			rowSelection,
		},
		onSortingChange: ( sortingUpdater ) => {
			onChangeView( ( currentView ) => {
				const sort =
					typeof sortingUpdater === 'function'
						? sortingUpdater(
								currentView.sort
									? [
											{
												id: currentView.sort.field,
												desc:
													currentView.sort
														.direction === 'desc',
											},
									  ]
									: []
						  )
						: sortingUpdater;
				if ( ! sort.length ) {
					return {
						...currentView,
						sort: {},
					};
				}
				const [ { id, desc } ] = sort;
				return {
					...currentView,
					sort: { field: id, direction: desc ? 'desc' : 'asc' },
				};
			} );
		},
		onColumnVisibilityChange: ( columnVisibilityUpdater ) => {
			onChangeView( ( currentView ) => {
				const hiddenFields = Object.entries(
					columnVisibilityUpdater()
				).reduce(
					( accumulator, [ fieldId, value ] ) => {
						if ( value ) {
							return accumulator.filter(
								( id ) => id !== fieldId
							);
						}
						return [ ...accumulator, fieldId ];
					},
					[ ...( currentView.hiddenFields || [] ) ]
				);
				return {
					...currentView,
					hiddenFields,
				};
			} );
		},
		onGlobalFilterChange: ( value ) => {
			onChangeView( { ...view, search: value, page: 0 } );
		},
		onPaginationChange: ( paginationUpdater ) => {
			onChangeView( ( currentView ) => {
				const { pageIndex, pageSize } = paginationUpdater( {
					pageIndex: currentView.page,
					pageSize: currentView.perPage,
				} );
				return { ...view, page: pageIndex, perPage: pageSize };
			} );
		},
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		pageCount: paginationInfo.totalPages,
	} );

	const selection = dataView
		.getSelectedRowModel()
		.rows.map( ( { original } ) => original.id );

	const { rows } = dataView.getRowModel();
	const hasRows = !! rows?.length;

	if ( isLoading ) {
		// TODO:Add spinner or progress bar..
		return <Spinner />;
	}
	return (
		<div className="dataviews-list-view-wrapper">
			{ hasRows && (
				<table className="dataviews-list-view">
					<thead>
						{ dataView.getHeaderGroups().map( ( headerGroup ) => (
							<tr key={ headerGroup.id }>
								{ headerGroup.headers.map( ( header ) => (
									<th
										key={ header.id }
										colSpan={ header.colSpan }
										style={ {
											width:
												header.column.columnDef.width ||
												undefined,
											maxWidth:
												header.column.columnDef
													.maxWidth || undefined,
										} }
									>
										<HeaderMenu
											dataView={ dataView }
											header={ header }
										/>
									</th>
								) ) }
							</tr>
						) ) }
					</thead>
					<tbody>
						{ rows.map( ( row ) => (
							<tr key={ row.id }>
								{ row.getVisibleCells().map( ( cell ) => (
									<td
										key={ cell.id }
										style={ {
											width:
												cell.column.columnDef.width ||
												undefined,
											maxWidth:
												cell.column.columnDef
													.maxWidth || undefined,
										} }
									>
										{ flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										) }
									</td>
								) ) }
							</tr>
						) ) }
					</tbody>
				</table>
			) }
			<BulkActions
				data={ data }
				selection={ selection }
				setSelection={ setRowSelection }
				actions={ actions }
			/>
			{ ! hasRows && <p>{ __( 'no results' ) }</p> }
		</div>
	);
}

export default ViewList;
