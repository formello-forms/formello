import { addFilter } from '@wordpress/hooks';
import './email';

function withComponentAppended( FilteredComponent ) {
	return ( props ) => {
		const { settings } = props;
		if ( 'email' === settings.type ) {
			return null;
		}
		return (
			<>
				<FilteredComponent { ...props } />
			</>
		);
	};
}

addFilter(
	'formello.modal.test',
	'formello/actions-email-promo',
	withComponentAppended
);
