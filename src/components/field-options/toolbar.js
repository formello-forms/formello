/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { SVG, Rect, ToolbarButton } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { Asterisk } from '../../icons/icons';

export default function Toolbar( props ) {
	const { attributes, setAttributes } = props;
	const { required, showHelp, hideLabel, type } = attributes;

	const toggleLabel = (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Rect
				x="4.75"
				y="17.25"
				width="5.5"
				height="14.5"
				transform="rotate(-90 4.75 17.25)"
				stroke="currentColor"
				fill="none"
				strokeWidth="1.5"
			/>
			<Rect x="4" y="7" width="10" height="2" fill="currentColor" />
		</SVG>
	);

	return (
		<Fragment>
			<ToolbarButton
				label={ __( 'Required', 'formello' ) }
				icon={ Asterisk }
				isPressed={ required }
				onClick={ () => {
					setAttributes( { required: ! required } );
				} }
			/>
			{ ( 'checkbox' || 'radio' ) !== type && (
				<ToolbarButton
					label={ __( 'Toggle label visibility', 'formello' ) }
					icon={ toggleLabel }
					isPressed={ ! hideLabel }
					onClick={ () => {
						setAttributes( { hideLabel: ! hideLabel } );
					} }
				/>
			) }
			<ToolbarButton
				label={ __( 'Show help message', 'formello' ) }
				icon={ 'editor-help' }
				isPressed={ showHelp }
				onClick={ () => {
					setAttributes( { showHelp: ! showHelp } );
				} }
			/>
		</Fragment>
	);
}
