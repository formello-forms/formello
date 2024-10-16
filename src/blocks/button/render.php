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
 * @package formello
 */

$config = wp_interactivity_config( 'formello' );
$state = wp_interactivity_state( 'formello' );

$captcha = '';
if ( ! is_admin() && $state['captcha']['enabled'] ) {
	$captcha = sprintf(
		'<div class="%s" data-sitekey="%s" data-size="%s" data-action="submit"></div>',
		'reCaptcha' === $state['captcha']['type'] ? 'g-recaptcha' : 'hCaptcha',
		$config['settings'][ $state['captcha']['type'] ]['site_key'],
		'1' === $config['settings'][ $state['captcha']['type'] ]['version'] ? 'normal' : 'invisible',
	);
	if ( 'reCaptcha' === $state['captcha']['type'] ) {
		wp_enqueue_script( 'recaptcha' );
	}
	if ( 'hCaptcha' === $state['captcha']['type'] ) {
		wp_enqueue_script( 'hcaptcha' );
	}
}

echo $captcha . $content;
