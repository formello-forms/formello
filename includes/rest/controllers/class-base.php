<?php
/**
 * Manage Settings API.
 *
 * @package Formello
 */

namespace Formello\Rest\Controllers;

use WP_REST_Controller;
use function Formello\Utils\formello_dir_url;

/**
 * REST_API Handler
 */
class Base extends WP_REST_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = '';
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
		$new_settings = $request->get_param( 'settings' );

		update_option( 'formello', $new_settings );

		do_action( 'formello_settings_update', $new_settings );

		return rest_ensure_response(
			array(
				'success'  => true,
				'response' => __( 'Settings saved.', 'formello' ),
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
	 * Get Settings.
	 *
	 * @param string $message The message.
	 *
	 * @return mixed
	 */
	public function response( $message ) {
		return rest_ensure_response(
			array(
				'success'  => true,
				'response' => $message,
			)
		);
	}

	/**
	 * Success rest.
	 *
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function success( $response ) {
		return new \WP_REST_Response(
			array(
				'success'  => true,
				'response' => $response,
			),
			200
		);
	}

	/**
	 * Failed rest.
	 *
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function failed( $response ) {
		return new \WP_REST_Response(
			array(
				'success'  => false,
				'response' => $response,
			),
			200
		);
	}

	/**
	 * Error rest.
	 *
	 * @param mixed $code     error code.
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function error( $code, $response ) {
		return new \WP_REST_Response(
			array(
				'error'      => true,
				'success'    => false,
				'error_code' => $code,
				'response'   => $response,
			),
			401
		);
	}

	/**
	 * Checks if a given request has access to read the items.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_settings_permissions( $request ) {
		return current_user_can( 'edit_posts' );
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
