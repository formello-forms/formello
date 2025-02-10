<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 * @link       https://www.francescopepe.com
 * @since      1.0.0
 *
 * @package    Formello
 * @subpackage Formello/includes
 */

$config = wp_interactivity_config( 'formello' );
$state = wp_interactivity_state( 'formello' );

$captcha = '';
if ( ! is_admin() && $state['captcha']['enabled'] ) {
	$captcha = sprintf(
		'<div class="%s" data-sitekey="%s" data-size="%s" data-action="submit"></div>',
		'reCaptcha' === $state['captcha']['type'] ? 'g-recaptcha' : 'h-captcha',
		$config['settings'][ $state['captcha']['type'] ]['site_key'],
		'1' === $config['settings'][ $state['captcha']['type'] ]['version'] ? 'normal' : 'invisible'
	);
}

$debug = '<div class="formello-debug">
	<p>Debug output</p>
	<small>This output is visible only to admin.</small>
	<pre data-wp-text="state.debugData"></pre>
</div>';

$p = new WP_HTML_Tag_Processor( $content );

if ( $p->next_tag( 'div' ) ) {
	$p->set_attribute( 'data-wp-bind--disabled', 'context.isLoading' );
	$p->set_attribute( 'data-wp-class--wp-block-formello-button--loading', 'context.isLoading' );
}

if ( ! is_admin() &&
	$p->next_tag( 'button' ) &&
	$state['captcha']['enabled'] &&
	'invisible' !== $state['captcha']['version']
	) {
	$p->set_attribute( 'data-wp-on--click', 'actions.validateCaptcha' );
}

echo $captcha . $p->get_updated_html();

if ( ! is_admin() && current_user_can( 'manage_options' ) && $state['debug'] ) {
	echo $debug;
}
