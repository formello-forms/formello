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
use function Formello\Utils\formello_default_options;

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
		'version' => array(
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
		'enabled_addons' => array(
			'type' => 'array',
		),
	);

	$settings = apply_filters( 'formello_settings', $settings );

	$defaults = formello_default_options();

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
