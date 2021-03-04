<?php
/**
 * Manage Settings API.
 *
 * @package Formello
 */

namespace Formello\Api;

use WP_REST_Controller;
use Formello\Encryption;

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
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_settings' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
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
					'version'    => 'sanitize_text_field',
				),
			)
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
		$current_settings = get_option( 'formello', formello_get_option_defaults() );
		$new_settings     = $request->get_param( 'settings' );

		$sanitized = $this->recursive_sanitize_text_field( $new_settings );

		if ( empty( $new_settings ) ) {
			return $this->success( __( 'No changes found.', 'formello' ) );
		}

		if ( is_array( $sanitized ) ) {

			$crypto    = new \Formello\Encryption();
			$recaptcha = $crypto->encrypt( serialize( $sanitized['recaptcha'] ) );

			// remove the secret from frontend options.
			unset( $sanitized['recaptcha']['secret_key'] );

			update_option( 'formello', array_merge( $current_settings, $sanitized ) );
			update_option( 'formello_recaptcha', $recaptcha );

			do_action( 'formello_settings_update', $sanitized );
		}

		return rest_ensure_response(
			array(
				'success'  => true,
				'response' => __( 'Settings saved.', 'formello' ),
			)
		);
	}

	/**
	 * Get Settings.
	 *
	 * @param \WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_settings( \WP_REST_Request $request ) {
		$settings             = array();
		$frontend_settings    = get_option( 'formello', formello_get_option_defaults() );

		$settings['messages'] = $frontend_settings['messages'];

		$settings['recaptcha'] = get_option(
			'formello_recaptcha',
			array(
				'version'    => 3,
				'site_key'   => '',
				'secret_key' => '',
				'threshold'  => 0.4,
			)
		);

		$settings['integrations'] = array();

		// filter to add integrations options
		$settings = apply_filters( 'formello_settings', $settings );

		return rest_ensure_response(
			array(
				'success'  => true,
				'response' => $settings,
			)
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
