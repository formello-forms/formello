<?php
/**
 * Register the plugin settings
 *
 * @package formello
 * @since   1.0.0
 */

namespace Formello;

use function Formello\Utils\recursive_sanitize_text_field;
use function Formello\Utils\formello_dir_url;

defined( 'ABSPATH' ) || exit;

/**
 * Register plugin settings.
 *
 * @since 1.0.0
 */
function register_settings() {
	$settings = array(
		'log' => array(
			'type' => 'boolean',
		),
		'log_file' => array(
			'type' => 'string',
		),
		'license' => array(
			'type' => 'string',
		),
		'license_status' => array(
			'type' => 'string',
		),
		'messages' => array(
			'type' => 'object',
			'properties' => array(
				'form'         => array(
					'type'       => 'object',
					'properties' => array(
						'success' => array(
							'type' => 'string',
						),
						'error' => array(
							'type' => 'string',
						),
					),
				),
				'missingValue'         => array(
					'type'       => 'object',
					'properties' => array(
						'default' => array(
							'type' => 'string',
						),
						'checkbox' => array(
							'type' => 'string',
						),
						'radio' => array(
							'type' => 'string',
						),
						'select' => array(
							'type' => 'string',
						),
						'select-multiple' => array(
							'type' => 'string',
						),
					),
				),
				'patternMismatch'         => array(
					'type'       => 'object',
					'properties' => array(
						'email' => array(
							'type' => 'string',
						),
						'url' => array(
							'type' => 'string',
						),
						'number' => array(
							'type' => 'string',
						),
						'color' => array(
							'type' => 'string',
						),
						'date' => array(
							'type' => 'string',
						),
						'time' => array(
							'type' => 'string',
						),
						'month' => array(
							'type' => 'string',
						),
						'default' => array(
							'type' => 'string',
						),
					),
				),
				'outOfRange'         => array(
					'type'       => 'object',
					'properties' => array(
						'over' => array(
							'type' => 'string',
						),
						'under' => array(
							'type' => 'string',
						),
					),
				),
				'wrongLength'         => array(
					'type'       => 'object',
					'properties' => array(
						'over' => array(
							'type' => 'string',
						),
						'under' => array(
							'type' => 'string',
						),
					),
				),
			),
		),
		'reCaptcha' => array(
			'type'       => 'object',
			'properties' => array(
				'version' => array(
					'type' => 'string',
				),
				'site_key' => array(
					'type' => 'string',
				),
				'secret_key' => array(
					'type' => 'string',
				),
				'threshold' => array(
					'type' => 'number',
				),
			),
		),

	);

	$settings = apply_filters( 'formello_settings', $settings );

	$defaults = array(
		'log' => false,
		'log_file' => 'formello_' . time() . '.txt',
		'license' => '',
		'license_status' => 'invalid',
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

	$defaults = apply_filters( 'formello_settings_defaults', $defaults );

	register_setting(
		'formello',
		'formello',
		array(
			'description'  => __(
				'Settings for the Formello Block plugin.',
				'formello'
			),
			'type'         => 'object',
			'show_in_rest' => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => $settings,
				),
			),
			'sanitize_callback' => 'Formello\Utils\recursive_sanitize_text_field',
			'default'      => $defaults,
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_settings' );
add_action( 'admin_init', __NAMESPACE__ . '\register_settings' );
