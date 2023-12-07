import { Spinner } from '@wordpress/components';

export default function LoadingSpinner( { text } ) {
	return (
		<div className="loading-settings">
			<Spinner />
			<span className="description">{ text }</span>
		</div>
	);
}
