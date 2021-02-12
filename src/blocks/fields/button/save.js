/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( { attributes, className } ) {

	className = classnames( attributes.alignment, attributes.fontSize )

	return (
		<div className="formello">
			<button 
				type="submit" 
				className={ className } 
				//data-sitekey={ formello.settings.recaptcha.site_key }
				//data-callback="onloadCallback"
				>
				<span>{ attributes.txt }</span>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="30" height="30" stroke="currentColor" preserveAspectRatio="xMidYMin"><g transform="translate(1 1)" strokeWidth="5" fill="none" fillRule="evenodd"><circle stroke-opacity=".4" cx="24" cy="24" r="22.2"/><path d="M46.2 24c0-12.2-9.9-22.2-22.2-22.2"><animateTransform accumulate="none" additive="replace" attributeName="transform" calcMode="linear" dur="1s" fill="remove" from="0 24 24" repeatCount="indefinite" restart="always" to="360 24 24" type="rotate"/></path></g></svg>
			</button>
		</div>
	);
}
