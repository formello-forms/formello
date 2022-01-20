<?php
/**
 * Register the form CPT
 *
 * @package formello
 * @since   1.0.0
 */

namespace Formello\Utils;

defined( 'ABSPATH' ) || exit;

/**
 * Function to retrieve unencrypted settings
 */
function formello_frontend_option() {
	$settings = get_option( 'formello2' );

	$frontend_settings = array(
		'messages' => $settings['messages'],
		'reCaptcha' => $settings['reCaptcha'],
	);
	// remove the secret from frontend options.
	unset( $frontend_settings['reCaptcha']['secret_key'] );

	return maybe_unserialize( $frontend_settings );
}

/**
 * Function to retrieve unencrypted settings
 *
 * @param mixed $settings The general settings.
 */
function formello_decrypt_option( $settings ) {
	if ( is_array( $settings ) ) {
		return $settings;
	}
	$crypto = new Encryption();

	$settings = $crypto->decrypt( $settings );
	return maybe_unserialize( $settings );
}

/**
 * Function to retrieve unencrypted settings
 *
 * @param mixed $settings The general settings.
 */
function formello_encrypt_option( $settings ) {
	$crypto = new Encryption();

	return $crypto->encrypt( maybe_serialize( $settings ) );
}

/**
 * Recursive sanitation for an array
 *
 * @param array $array the array of data.
 *
 * @return mixed
 */
function recursive_sanitize_text_field( $array ) {
	foreach ( $array as $key => &$value ) {
		if ( is_array( $value ) ) {
			$value = recursive_sanitize_text_field( $value );
		} else {
			$value = sanitize_text_field( $value );
		}
	}
	return $array;
}

add_filter( 'option_formello2', __NAMESPACE__ . '\formello_decrypt_option' );
add_filter( 'pre_update_option_formello2', __NAMESPACE__ . '\formello_encrypt_option' );
