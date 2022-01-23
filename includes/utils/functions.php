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
 * Function to retrieve integration option
 *
 * @param string $integration The integration name to retrieve.
 */
function formello_integration_option( $integration ) {
	$settings = get_option( 'formello2' );

	if ( empty( $settings['integrations'][ $integration ] ) ) {
		return array();
	}
	return $settings['integrations'][ $integration ];
}

/**
 * Function to retrieve unencrypted settings
 */
function formello_frontend_option() {
	$settings = get_option( 'formello2' );

	if ( empty( $settings ) ) {
		return array();
	}

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

/**
 * Hook before trash a form
 *
 * @param int $id The id of the form trashed.
 */
function formello_trash_form( $id ) {
	$post = get_post( $id );
	if ( 'formello_form' !== $post->post_type ) {
		return true;
	}
	global $wpdb;
	$submissions_table = $wpdb->prefix . 'formello_submissions';
	$hasSubmissions = $wpdb->query(
		$wpdb->prepare(
			"SELECT COUNT(*) as t FROM {$submissions_table} WHERE form_id = %d;",
			array( $id )
		)
	);
	if ( $hasSubmissions ) {
		wp_safe_redirect( get_home_url() . '/wp-admin/edit.php?post_type=formello_form' );
		die();
	}

}

/**
 * Limit the blocks allowed in Gutenberg.
 * 
 * @param mixed $allowed_blocks Array of allowable blocks for Gutenberg Editor.
 * @param mixed $post Gets current post type.
 * 
 * @return mixed $allowed_blocks Returns the allowed blocks.
 * */ 
function formello_allowed_blocks( $allowed_blocks, $editor_context )
{

    /**
     * 'page' is the stype being filtered. To add additional types:
     * if($editor_context->editor_context_type === 'page' || $editor_context->editor_context_type === 'projects') :
     * where 'projects' is the custom editor_context type or editor_context type.
     */

    if( $editor_context->post->post_type === 'formello_form' ) {
	    $allowed_blocks = array(
	      'formello/form',
	      'formello/button',
	      'formello/input',
	      'formello/select',
	      'formello/fieldset',
	      'core/image',
	      'core/image',
	      'core/paragraph',
	      'core/heading',
	      'core/group',
	      'core/columns',
	      'core/column',
	      'core/list',
	    );
	    return $allowed_blocks;
    }
    return true;
 
}

add_action( 'wp_trash_post', __NAMESPACE__ . '\formello_trash_form' );
add_filter( 'option_formello2', __NAMESPACE__ . '\formello_decrypt_option' );
add_filter( 'pre_update_option_formello2', __NAMESPACE__ . '\formello_encrypt_option' );
add_filter( 'allowed_block_types_all', __NAMESPACE__ . '\formello_allowed_blocks', 10, 2 );
