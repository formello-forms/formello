/**
 * WordPress dependencies
 */
import {
	Button,
	Icon,
	Dropdown,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
import { check, chevronDown } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

function FieldsVisibilityMenu( { view, onChangeView, fields } ) {
	const hidableFields = fields.filter(
		( field ) => field.enableHiding !== false
	);
	if ( ! hidableFields?.length ) {
		return null;
	}
	return hidableFields?.map( ( field ) => {
		return (
			<MenuItem
				key={ field.id }
				suffix={
					! view.hiddenFields?.includes( field.id ) && (
						<Icon icon={ check } />
					)
				}
				onClick={ ( event ) => {
					event.preventDefault();
					onChangeView( {
						...view,
						hiddenFields: view.hiddenFields?.includes( field.id )
							? view.hiddenFields.filter(
									( id ) => id !== field.id
							  )
							: [ ...view.hiddenFields, field.id ],
					} );
				} }
			>
				{ field.header }
			</MenuItem>
		);
	} );
}

export default function ViewActions( { fields, view, onChangeView } ) {
	return (
		<Dropdown
			className="my-container-class-name"
			contentClassName="my-popover-content-classname"
			popoverProps={ { placement: 'bottom-start' } }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					iconPosition="right"
					onClick={ onToggle }
					aria-expanded={ isOpen }
				>
					{ __( 'Columns' ) }
					<Icon icon={ chevronDown } />
				</Button>
			) }
			renderContent={ () => (
				<MenuGroup>
					<FieldsVisibilityMenu
						fields={ fields }
						view={ view }
						onChangeView={ onChangeView }
					/>
				</MenuGroup>
			) }
		/>
	);
}
