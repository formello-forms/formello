<?php
/**
 * Manage License API.
 *
 * @package Formello
 */

namespace Formello\Rest\Controllers;

use WP_REST_Controller;
use Formello\Encryption;

/**
 * REST_API Handler
 */
class License extends Base {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = 'license';
	}

	/**
	 * Register the routes
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/activate',
			array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'activate_license' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/deactivate',
			array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'deactivate_license' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/validate',
			array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'get_endpoint' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args' => array(
						'endpoint' => array(
							'description' => __( 'Unique identifier for the submission.' ),
							'type'        => 'string',
							'default'     => 'validate',
						),
					),
				),
			)
		);
	}

	/**
	 * Activate license.
	 *
	 * @param \WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function activate_license( \WP_REST_Request $request ) {
		$license = sanitize_text_field( $request->get_param( 'license' ) );

		$api_params = array(
			'license_key'   => $license,
			'instance_name' => home_url(),
		);

		// Call the custom API.
		$response = wp_remote_post(
			'https://api.lemonsqueezy.com/v1/licenses/activate',
			array(
				'timeout' => 15,
				'sslverify' => false,
				'body' => $api_params,
			)
		);

		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
			if ( is_wp_error( $response ) ) {
				$message = $response->get_error_message();
			} else {
				$message = __( 'License key not valid.' );
			}
			return $this->failed( $message );
		}

		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		$option = get_option( 'formello' );

		$option['license'] = $license_data;

		update_option( 'formello', $option );

		return $this->response( $license_data );
	}

	/**
	 * Deactivate license.
	 *
	 * @param \WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function deactivate_license( \WP_REST_Request $request ) {

		$license = sanitize_text_field( $request->get_param( 'license' ) );
		$instance_id = sanitize_text_field( $request->get_param( 'instance_id' ) );

		$api_params = array(
			'license_key' => $license,
			'instance_id' => $instance_id,
		);

		// Call the custom API.
		$response = wp_remote_post(
			'https://api.lemonsqueezy.com/v1/licenses/deactivate',
			array(
				'timeout' => 15,
				'sslverify' => false,
				'body' => $api_params,
			)
		);

		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
			if ( is_wp_error( $response ) ) {
				$message = $response->get_error_message();
			} else {
				$message = __( 'License key not valid.' );
			}
			return $this->failed( $message );
		}

		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		return $this->response( $license_data );
	}
	/**
	 * Deactivate license.
	 *
	 * @param \WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_endpoint( \WP_REST_Request $request ) {

		$license = sanitize_text_field( $request->get_param( 'license' ) );
		$endpoint = $request->get_param( 'endpoint' );

		$api_params = array(
			'license_key'   => $license,
			'instance_name' => home_url(),
		);

		// Call the custom API.
		$response = wp_remote_post(
			'https://api.lemonsqueezy.com/v1/licenses/' . $endpoint,
			array(
				'timeout' => 15,
				'sslverify' => false,
				'body' => $api_params,
			)
		);

		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
			if ( is_wp_error( $response ) ) {
				$message = $response->get_error_message();
			} else {
				$message = __( 'License key not valid.' );
			}
			return $this->failed( $message );
		}

		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		return $this->response( $license_data );
	}
}
