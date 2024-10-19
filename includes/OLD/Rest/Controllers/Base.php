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
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/reset',
			array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'reset_settings' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
	}

	/**
	 * Update Settings.
	 *
	 * @param \WP_REST_Request $request  request object.
	 *
	 * @return \WP_REST_Response|\WP_Error
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
	 * Update Settings.
	 *
	 * @param \WP_REST_Request $request  request object.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function reset_settings( \WP_REST_Request $request ) {

		delete_option( 'formello' );

		return rest_ensure_response(
			array(
				'success'  => true,
				'response' => __( 'Reset settings completed.', 'formello' ),
			)
		);
	}

	/**
	 * Recursive sanitation for an array
	 *
	 * @param array $my_array the array of data.
	 *
	 * @return array
	 */
	public function recursive_sanitize_text_field( $my_array ) {
		foreach ( $my_array as $key => &$value ) {
			if ( is_array( $value ) ) {
				$value = $this->recursive_sanitize_text_field( $value );
			} else {
				$value = sanitize_text_field( $value );
			}
		}
		return $my_array;
	}

	/**
	 * Get Settings.
	 *
	 * @param string $message The message.
	 *
	 * @return \WP_REST_Response|\WP_Error
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
	 * @return \WP_REST_Response
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
	 * @return \WP_REST_Response
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
	 * @return \WP_REST_Response
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
