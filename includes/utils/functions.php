<?php
/**
 * Utility functions
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
	$settings = get_option( 'formello' );

	if ( empty( $settings['integrations'][ $integration ] ) ) {
		return array();
	}
	return $settings['integrations'][ $integration ];
}

/**
 * Function to retrieve unencrypted settings
 */
function formello_frontend_option() {
	$settings = get_option( 'formello' );

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
 * @param mixed $array the array of data.
 *
 * @return mixed
 */
function recursive_sanitize_text_field( $array ) {
	if ( ! is_array( $array ) ) {
		return sanitize_text_field( $array );
	}
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
 * Limit the blocks allowed in Gutenberg.
 * 
 * @param mixed $allowed_blocks Array of allowable blocks for Gutenberg Editor.
 * @param mixed $post Gets current post type.
 * 
 * @return mixed $allowed_blocks Returns the allowed blocks.
 * */ 
function formello_allowed_blocks( $allowed_blocks, $editor_context )
{

	if( !$editor_context->post ){
		return $allowed_blocks;
	}

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
    return $allowed_blocks;
 
}

/**
 * [formello_action_row description]
 * @param  array $actions [description]
 * @param  WP_POST $post    [description]
 * @return string          [description]
 */
function formello_action_row( $actions, $post ){
	add_thickbox();
    //check for your post type
    if ( 'formello_form' === $post->post_type ){
		$view_link = sprintf(
			'<a href="?post_type=formello_form&page=%s&form=%s">%s</a>',
			'formello-submissions',
			absint( $post->ID ),
			__( 'View Entries', 'formello' )
		);

		array_splice( $actions, 2, 0, $view_link ); // splice in at position 3
    }
    return $actions;
}

add_filter( 'option_formello', __NAMESPACE__ . '\formello_decrypt_option' );
add_filter( 'pre_update_option_formello', __NAMESPACE__ . '\formello_encrypt_option' );
add_filter( 'allowed_block_types_all', __NAMESPACE__ . '\formello_allowed_blocks', 10, 2 );
add_filter( 'post_row_actions', __NAMESPACE__ . '\formello_action_row', 10, 2);
