<?php
/**
 * Functions available globally
 *
 * @package Formello
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Get defaults for our general otions.
 *
 * @since 1.0.0
 */
function formello_get_option_defaults() {
	return apply_filters(
		'formello_option_defaults',
		array(
			'messages' => array(
				'missingValue'    => array(
					'default'         => __( 'Please fill out this field.', 'formello' ),
					'checkbox'        => __( 'This field is required.', 'formello' ),
					'radio'           => __( 'Please select a value.', 'formello' ),
					'select'          => __( 'Please select a value.', 'formello' ),
					'select-multiple' => __( 'Please select at least one value.', 'formello' ),
				),
				'patternMismatch' => array(
					'email'   => __( 'Please enter a valid email address.', 'formello' ),
					'url'     => __( 'Please enter a URL.', 'formello' ),
					'number'  => __( 'Please enter a number', 'formello' ),
					'color'   => __( 'Please match the following format: #rrggbb', 'formello' ),
					'date'    => __( 'Please use the YYYY-MM-DD format', 'formello' ),
					'time'    => __( 'Please use the 24-hour time format. Ex. 23:00', 'formello' ),
					'month'   => __( 'Please use the YYYY-MM format', 'formello' ),
					'default' => __( 'Please match the requested format.', 'formello' ),
				),
				'outOfRange'      => array(
					'over'  => __( 'Please select a value that is no more than {max}.', 'formello' ),
					'under' => __( 'Please select a value that is no less than {min}.', 'formello' ),
				),
				'wrongLength'     => array(
					'over'  => __( 'Please shorten this text to no more than {maxLength} characters. You are currently using {length} characters.', 'formello' ),
					'under' => __( 'Please lengthen this text to {minLength} characters or more. You are currently using {length} characters.', 'formello' ),
				),
			),
			'recaptcha' => array(
				'version'    => '',
				'site_key'   => '',
				'secret_key' => '',
				'threshold'  => '',
			),
		)
	);
}

add_filter( 'option_formello_recaptcha', 'formello_recaptcha_option' );

/**
 * Filter to retrieve unencrypted reCaptcha
 *
 * @param mixed $settings The general settings.
 */
function formello_recaptcha_option( $settings ) {
	$crypto = new Formello\Encryption();

	$settings = $crypto->decrypt( $settings );
	return unserialize( $settings );
}

function formello_enable_gutenberg_post_type($can_edit, $post) {
	
	if (empty($post->ID)) return $can_edit;
	
	if ('formello_form' === $post_type) return true;
	
	return $can_edit;
	
}

// Enable Gutenberg for WP < 5.0 beta
add_filter('gutenberg_can_edit_post_type', 'formello_enable_gutenberg_post_type', 10, 2);

// Enable Gutenberg for WordPress >= 5.0
add_filter('use_block_editor_for_post_type', 'formello_enable_gutenberg_post_type', 10, 2);