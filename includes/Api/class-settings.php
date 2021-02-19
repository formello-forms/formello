<?php
/**
 * Manage Settings API.
 *
 * @package Formello
 */

namespace Formello\Api;

use WP_REST_Controller;

/**
 * REST_API Handler
 */
class Settings extends WP_REST_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = 'settings';
	}

	/**
	 * Register the routes
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_settings' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
	}

	/**
	 * Sanitize our options.
	 *
	 * @since 1.2.0
	 * @param string $name The setting name.
	 * @param mixed  $value The value to save.
	 */
	public function sanitize_value( $name, $value ) {
		$callbacks = apply_filters(
			'formello_option_sanitize_callbacks',
			array(
				'recaptcha' => array(
					'site_key'   => 'sanitize_text_field',
					'secret_key' => 'sanitize_text_field',
					'message'    => 'sanitize_text_field',
				),
			),
		);

		$callback = $callbacks[ $name ];

		if ( ! is_callable( $callback ) ) {
			return sanitize_text_field( $value );
		}

		return $callback( $value );
	}

	/**
	 * Update Settings.
	 *
	 * @param \WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function update_settings( \WP_REST_Request $request ) {
		$current_settings = get_option( 'formello', array() );
		$new_settings     = $request->get_param( 'settings' );

		$sanitized = $this->recursive_sanitize_text_field( $new_settings );

		if ( empty( $new_settings ) ) {
			return $this->success( __( 'No changes found.', 'formello' ) );
		}

		if ( is_array( $sanitized ) ) {
			update_option( 'formello', array_merge( $current_settings, $sanitized ) );
		}

		return rest_ensure_response(
			array(
				'success'  => true,
				'response' => __( 'Settings saved.', 'formello' ),
			),
		);
	}

	/**
	 * Recursive sanitation for an array
	 *
	 * @param array $array the array of data.
	 *
	 * @return mixed
	 */
	public function recursive_sanitize_text_field( $array ) {
		foreach ( $array as $key => &$value ) {
			if ( is_array( $value ) ) {
				$value = $this->recursive_sanitize_text_field( $value );
			} else {
				$value = sanitize_text_field( $value );
			}
		}
		return $array;
	}

	/**
	 * Checks if a given request has access to read the items.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_settings_permissions( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Retrieves the query params for the items collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		return array();
	}
}
