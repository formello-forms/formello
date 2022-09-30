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
		$item_name = null !== $request->get_param( 'item_name' ) ? sanitize_text_field( $request->get_param( 'item_name' ) ) : rawurlencode( 'Formello' );

		// data to send in our API request.
		$api_params = array(
			'edd_action'  => 'activate_license',
			'license'     => $license,
			'item_name'   => $item_name, // the name of your product in EDD.
			'url'         => home_url(),
			'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
		);

		// Call the custom API.
		$response = wp_remote_post(
			FORMELLO_STORE_URL,
			array(
				'timeout' => 15,
				'sslverify' => false,
				'body' => $api_params,
			)
		);

		// make sure the response came back okay.
		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
			if ( is_wp_error( $response ) ) {
				$message = $response->get_error_message();
			} else {
				$message = __( 'An error occurred, please try again.' );
			}
		} else {
			$license_data = json_decode( wp_remote_retrieve_body( $response ) );

			if ( false === $license_data->success ) {
				switch ( $license_data->error ) {

					case 'expired':
						$message = sprintf(
							/* translators: %s: timestamp */
							__( 'Your license key expired on %s.' ),
							date_i18n( get_option( 'date_format' ), strtotime( $license_data->expires, current_time( 'timestamp' ) ) )
						);
						break;

					case 'disabled':
					case 'revoked':
						$message = __( 'Your license key has been disabled.' );
						break;

					case 'missing':
						$message = __( 'Invalid license.' );
						break;

					case 'invalid':
					case 'site_inactive':
						$message = __( 'Your license is not active for this URL.' );
						break;

					case 'item_name_mismatch':
						$message = __( 'This appears to be an invalid license key for ' ) . $item_name;
						break;
					case 'no_activations_left':
						$message = __( 'Your license key has reached its activation limit.' );
						break;

					default:
						$message = __( 'An error occurred, please try again.' );
						break;
				}
			}
		}

		// Check if anything passed on a message constituting a failure.
		if ( ! empty( $message ) ) {
			return $this->response( $message );
		}

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

		// retrieve the license from the database.
		$license = sanitize_text_field( $request->get_param( 'license' ) );
		$item_name = null !== $request->get_param( 'item_name' ) ? sanitize_text_field( $request->get_param( 'item_name' ) ) : rawurlencode( 'Formello' );

		// data to send in our API request.
		$api_params = array(
			'edd_action'  => 'deactivate_license',
			'license'     => $license,
			'item_name'   => $item_name, // the name of our product in EDD.
			'url'         => home_url(),
			'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
		);

		// Call the custom API.
		$response = wp_remote_post(
			FORMELLO_STORE_URL,
			array(
				'timeout' => 15,
				'sslverify' => false,
				'body' => $api_params,
			)
		);

		// make sure the response came back okay.
		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
			if ( is_wp_error( $response ) ) {
				$message = $response->get_error_message();
			} else {
				$message = __( 'An error occurred, please try again.' );
			}

			return $this->failed( $message );

		}

		// decode the license data.
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		// $license_data->license will be either "deactivated" or "failed".
		if ( 'deactivated' === $license_data->license || 'failed' === $license_data->license ) {
			$license_data->license = 'deactivated';
		}

		return $this->response( $license_data );

	}

}
