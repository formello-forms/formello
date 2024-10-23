<?php
/**
 * Manage Settings API.
 *
 * @package Formello
 */

namespace Formello\Rest;

use WP_REST_Controller;
use function Formello\Utils\formello_dir_url;

/**
 * REST_API Handler
 */
abstract class Base extends WP_REST_Controller {
	/**
	 * The ID of this plugin.
	 *
	 * @since    2.6.0
	 * @access   protected
	 * @var      string    $namespace    The ID of this plugin.
	 */
	protected $namespace = 'formello/v1';

	/**
	 * The route of this plugin.
	 *
	 * @since    2.6.0
	 * @access   protected
	 * @var      string    $route    The current route of this plugin.
	 */
	protected $rest_base = '';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 2.6.0
	 */
	public function __construct() {
	}

	/**
	 * Register the routes
	 *
	 * @return void
	 */
	public function register_routes() {
		foreach ( $this->endpoints() as $route => $args ) {
			register_rest_route(
				$this->namespace,
				$this->rest_base . $route,
				array_merge(
					array(
						'methods' => 'GET',
						'permission_callback' => '__return_true',
					),
					$args,
					array(
						'callback' => function ( \WP_REST_Request $request ) use ( $args ) {
							$response = $args['callback']( $request );
							if ( is_wp_error( $response ) ) {
								return $this->error(
									$response->get_error_code(),
									$response->get_error_message(),
									$response->get_error_data()
								);
							}
							return $this->response( $response );
						},
					)
				)
			);
		}
	}

	/**
	 * Return rest response.
	 *
	 * @param mixed $data The data.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	protected function response( $data ) {
		return new \WP_REST_Response(
			$data,
			200
		);
	}

	/**
	 * Failed rest.
	 *
	 * @param string $code response code.
	 * @param mixed  $message response message.
	 * @param array  $data response data.
	 * @return \WP_ERROR
	 */
	protected function error( $code, $message, $data = array() ) {
		return new \WP_Error( $code, $message, $data );
	}

	/**
	 * Recursive sanitation for an array
	 *
	 * @param array $my_array the array of data.
	 *
	 * @return array
	 */
	protected function recursive_sanitize_text_field( $my_array ) {
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
	 * Retrieves the endpoints.
	 *
	 * @return array Endpoints array.
	 */
	protected function endpoints() {
		return array();
	}

	/**
	 * Retrieves the endpoint route.
	 *
	 * @return string Endpoint route.
	 */
	protected function get_rest_base() {
		return '';
	}
}
