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
 * Get default options
 *
 * @return array Default options.
 */
function formello_default_options() {
	$defaults = array(
		'log' => false,
		'log_file' => 'formello_' . time() . '.txt',
		'license' => '',
		'license_status' => '',
		'version' => '1.0',
		'messages' => array(
			'form' => array(
				'success' => __( 'Thanks for submitting this form.', 'formello' ),
				'error' => __( 'Ops. An error occurred.', 'formello' ),
			),
			'missingValue' => array(
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
			'outOfRange' => array(
				'over'  => __( 'Please select a value that is no more than {max}.', 'formello' ),
				'under' => __( 'Please select a value that is no less than {min}.', 'formello' ),
			),
			'wrongLength' => array(
				'over'  => __( 'Please shorten this text to no more than {maxLength} characters. You are currently using {length} characters.', 'formello' ),
				'under' => __( 'Please lengthen this text to {minLength} characters or more. You are currently using {length} characters.', 'formello' ),
			),
		),
		'reCaptcha' => array(
			'version'    => '3',
			'site_key'   => '',
			'secret_key' => '',
			'threshold'  => 0.4,
		),
	);
	return $defaults;
}


/**
 * Function to retrieve unencrypted settings
 */
function formello_frontend_option() {
	$settings = get_option( 'formello', formello_default_options() );

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
			if ( ! is_bool( $value ) ) {
				$value = sanitize_text_field( $value );
			};
		}
	}
	return $array;
}

/**
 * Limit the blocks allowed in Gutenberg.
 *
 * @param mixed $allowed_blocks Array of allowable blocks for Gutenberg Editor.
 * @param mixed $editor_context Editor context.
 *
 * @return mixed $allowed_blocks Returns the allowed blocks.
 * */
function formello_allowed_blocks( $allowed_blocks, $editor_context ) {
	if ( ! $editor_context->post ) {
		return $allowed_blocks;
	}

	if ( 'formello_form' === $editor_context->post->post_type ) {
		$allowed_blocks = array(
			'formello/form',
			'formello/button',
			'formello/input',
			'formello/textarea',
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
 *
 * @param  array   $actions Actions.
 * @param  WP_POST $post Post.
 * @return string
 */
function formello_action_row( $actions, $post ) {
	// check for your post type.
	if ( 'formello_form' === $post->post_type ) {
		$view_link = sprintf(
			'<a href="?post_type=formello_form&page=%s&form_id=%s">%s</a>',
			'formello-submissions',
			absint( $post->ID ),
			__( 'View Entries', 'formello' )
		);

		array_splice( $actions, 2, 0, $view_link );
	}
	return $actions;
}

/**
 * Retrieve the formello dir.
 *
 * @since 1.4.0
 */
function formello_dir() {
	$upload_dir = wp_upload_dir();
	$formello_dir = $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'formello';
	if ( ! is_dir( $formello_dir ) ) {
		wp_mkdir_p( $formello_dir );
	}
	return trailingslashit( $formello_dir );
}

/**
 * Retrieve the formello dir.
 *
 * @since 1.4.0
 */
function formello_dir_url() {
	$upload_dir = wp_upload_dir();
	return $upload_dir['baseurl'] . '/formello';
}

/**
 * Add schedule time.
 *
 * @param array $schedules The schedule settings.
 * @since 1.4.0
 */
function formello_cron_schedules( $schedules ) {
	if ( ! isset( $schedules['5min'] ) ) {
		$schedules['5min'] = array(
			'interval' => 5 * 60,
			'display'  => __( 'Once every 5 minutes', 'formello' ),
		);
	}
	if ( ! isset( $schedules['30min'] ) ) {
		$schedules['30min'] = array(
			'interval' => 30 * 60,
			'display' => __( 'Once every 30 minutes', 'formello' ),
		);
	}
	return $schedules;
}


/**
 * Add the custom columns to the book post type.
 *
 * @param array $columns The array of columns.
 *
 * @return array $columns
 */
function formello_columns_table( $columns ) {

	$columns['shortcode'] = __( 'Shortcode', 'formello' );

	unset( $columns['date'] );

	$columns['date'] = __( 'Date' );

	return $columns;
}

/**
 * Add the custom columns to the book post type.
 *
 * @param string $column The name of columns.
 * @param number $post_id The post id.
 */
function formello_columns_display( $column, $post_id ) {
	switch ( $column ) {
		case 'shortcode':
			echo sprintf(
				'<code>[formello id=%d]</code>',
				esc_attr( $post_id ),
			);
			break;
		default:
	}
}

/**
 * Hide shortcode column to the formello forms post type.
 *
 * @param array  $hidden The columns.
 * @param string $screen The screen id.
 */
function formello_hide_shortcode_columns( $hidden, $screen ) {

	if ( isset( $screen->id ) && 'edit-formello_form' === $screen->id ) {
		$hidden[] = 'shortcode';
	}

	return $hidden;

}

/**
 * Allow upload of json for form importing.
 *
 * @param array $mimes The mimes.
 */
function formello_custom_mime_types( $mimes ) {

	// New allowed mime types.
	$mimes['json'] = 'application/json';

	return $mimes;
}

// phpcs:ignore.
add_filter( 'cron_schedules', __NAMESPACE__ . '\formello_cron_schedules' );
add_filter( 'option_formello', __NAMESPACE__ . '\formello_decrypt_option', 5 );
add_filter( 'pre_update_option_formello', __NAMESPACE__ . '\formello_encrypt_option' );
add_filter( 'allowed_block_types_all', __NAMESPACE__ . '\formello_allowed_blocks', 10, 2 );
add_filter( 'post_row_actions', __NAMESPACE__ . '\formello_action_row', 10, 2 );
add_filter( 'manage_formello_form_posts_columns', __NAMESPACE__ . '\formello_columns_table' );
add_action( 'manage_formello_form_posts_custom_column', __NAMESPACE__ . '\formello_columns_display', 10, 2 );
add_filter( 'default_hidden_columns', __NAMESPACE__ . '\formello_hide_shortcode_columns', 10, 2 );
add_filter( 'upload_mimes', __NAMESPACE__ . '\formello_custom_mime_types', 10 );
