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
		'ip_logging'     => false,
		'log'            => false,
		'log_file'       => 'formello_' . time() . '.log',
		'license'        => array(),
		'version'        => get_option( 'formello_version', '1.0.0' ),
		'messages'       => array(
			'form'            => array(
				'success' => __( 'Thanks for submitting this form.', 'formello' ),
				'error'   => __( 'Ops. An error occurred.', 'formello' ),
			),
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
		'captcha'        => false,
		'reCaptcha'      => array(
			'version'    => '3',
			'site_key'   => '',
			'secret_key' => '',
			'threshold'  => 0.5,
		),
		'hCaptcha'      => array(
			'version'    => '3',
			'site_key'   => '',
			'secret_key' => '',
			'threshold'  => 0.5,
		),
		'enabled_addons' => array(),
	);
	return $defaults;
}

/**
 * Function to retrieve unencrypted settings
 */
function formello_frontend_options() {
	$settings = get_option( 'formello', formello_default_options() );

	$frontend_settings = array(
		'messages'  => $settings['messages'],
		'reCaptcha'      => array(
			'version'    => $settings['reCaptcha']['version'],
			'site_key'   => $settings['reCaptcha']['site_key'],
			'threshold'  => $settings['reCaptcha']['threshold'],
		),
		'hCaptcha'      => array(
			'version'    => $settings['hCaptcha']['version'],
			'site_key'   => $settings['hCaptcha']['site_key'],
			'threshold'  => $settings['hCaptcha']['threshold'],
		),
	);

	return maybe_unserialize( $frontend_settings );
}

/**
 * Undocumented function
 *
 * @param int $id The form ID.
 * @return array
 */
function formello_form_context( $id ) {
	$form_context = get_post_meta( $id, '_formello_settings', true );

	unset( $form_context['actions'] );
	unset( $form_context['fields'] );
	unset( $form_context['constraints'] );

	return $form_context;
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

	$settings = apply_filters( 'formello_settings', $settings );

	$settings = maybe_unserialize( $settings );

	if ( $settings['license'] && ! is_array( $settings['license'] ) ) {
		$settings['license'] = array();
	}

	unset( $settings['license_status'] );

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
 * @param mixed $my_array the array of data.
 *
 * @return mixed
 */
function recursive_sanitize_text_field( $my_array ) {
	if ( ! is_array( $my_array ) ) {
		return sanitize_text_field( $my_array );
	}
	foreach ( $my_array as $key => &$value ) {
		if ( is_array( $value ) ) {
			$value = recursive_sanitize_text_field( $value );
		} elseif ( ! is_bool( $value ) ) {
			$value = sanitize_text_field( $value );
		}
	}
	return $my_array;
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
			'formello/output',
			'formello/input',
			'formello/textarea',
			'formello/select',
			'formello/fieldset',
			'formello/multichoices',
			'formello/output',
			'formello/message',
			'core/image',
			'core/spacer',
			'core/separator',
			'core/paragraph',
			'core/heading',
			'core/group',
			'core/columns',
			'core/column',
			'core/list',
		);

		return apply_filters( 'formello_allowed_blocks', $allowed_blocks );
	}
	return $allowed_blocks;
}

/**
 * Retrieve the formello dir.
 *
 * @since 1.4.0
 */
function formello_dir() {
	$upload_dir   = wp_upload_dir();
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
			'display'  => __( 'Once every 30 minutes', 'formello' ),
		);
	}
	return $schedules;
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

/**
 * Allow upload of json for form importing.
 */
function add_submissions_count() {

	$key = 'formello-submissions-count';
	$query = wp_cache_get( $key, 'formello' );
	if ( empty( $query ) ) {

		global $wpdb;

		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT
					form_id,
					count(*) AS total,
					SUM( is_new = 1 ) AS news 
				FROM %i
				GROUP BY form_id',
				array( "{$wpdb->prefix}formello_submissions" )
			),
			ARRAY_A
		);

		wp_cache_set( $key, $results, 'formello', 3600 );
	}

	register_rest_field(
		'formello_form',
		'submissions_count',
		array(
			'get_callback' => function ( $form ) {
				$key = 'formello-submissions-count';
				$query = wp_cache_get( $key, 'formello' );
				$total = array_column( $query, 'total', 'form_id' );
				$news = array_column( $query, 'news', 'form_id' );

				return array(
					'total' => isset( $total[ $form['id'] ] ) ? (int) $total[ $form['id'] ] : 0,
					'news' => isset( $news[ $form['id'] ] ) ? (int) $news[ $form['id'] ] : 0,
				);
			},
			'schema'       => array(
				'description' => 'List number of submissions attached to this form.',
				'type'                 => 'object',
				// In JSON Schema you can specify object properties in the properties attribute.
				'properties'           => array(
					'total' => array(
						'type'         => 'integer',
						'context'      => array( 'view', 'edit', 'embed' ),
						'readonly'     => true,
					),
					'news' => array(
						'type'         => 'integer',
						'context'      => array( 'view', 'edit', 'embed' ),
						'readonly'     => true,
					),
				),
			),
		)
	);
}

/**
 * Redirect CPT page to Popper page
 *
 * @return void
 */
function redirect_post_type() {
	$screen = get_current_screen();
	if ( 'edit-formello_form' === $screen->id ) {
		wp_safe_redirect( 'admin.php?page=formello' );
		exit;
	}
}

// phpcs:ignore.
add_filter( 'cron_schedules', __NAMESPACE__ . '\formello_cron_schedules' );
add_filter( 'option_formello', __NAMESPACE__ . '\formello_decrypt_option', 5 );
add_filter( 'pre_update_option_formello', __NAMESPACE__ . '\formello_encrypt_option' );
add_filter( 'allowed_block_types_all', __NAMESPACE__ . '\formello_allowed_blocks', 10, 2 );
add_filter( 'upload_mimes', __NAMESPACE__ . '\formello_custom_mime_types', 10 );
add_action( 'rest_api_init', __NAMESPACE__ . '\add_submissions_count', 10, 2 );
add_action( 'load-edit.php', __NAMESPACE__ . '\redirect_post_type' );
