<?php
/**
 * Manage License API.
 *
 * @package Formello
 */

namespace Formello\Api;

use WP_REST_Controller;
use Formello\Encryption;

/**
 * REST_API Handler
 */
class License extends WP_REST_Controller {

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
	 * Activate license.
	 *
	 * @param \WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function activate_license( \WP_REST_Request $request ) {

		$license = sanitize_text_field( $request->get_param( 'license' ) );

		// data to send in our API request
		$api_params = array(
			'edd_action'  => 'check_license',
			'license'     => $license,
			'item_name'   => urlencode( 'Formello' ), // the name of our product in EDD
			'url'         => home_url(),
			'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
		);

		// Call the custom API.
		$response = wp_remote_post( FORMELLO_STORE_URL, array( 'timeout' => 15, 'sslverify' => false, 'body' => $api_params ) );

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
						$message = sprintf( __( 'This appears to be an invalid license key for %s.' ), 'Formello' );
						break;
					case 'no_activations_left':
						$message = __( 'Your license key has reached its activation limit.' );
						break;
						
					default :
						$message = __( 'An error occurred, please try again.' );
						break;
				}

			}

		}

		// Check if anything passed on a message constituting a failure
		if ( ! empty( $message ) ) {
			return rest_ensure_response(
				array(
					'success'  => false,
					'response' => $message,
				)
			);
		}

		// $license_data->license will be either "valid" or "invalid"
		$crypto    = new \Formello\Encryption();
		$license = $crypto->encrypt( serialize($license) );

		update_option( 'formello_license', $license );
		update_option( 'formello_license_status', $license_data->license );

		return rest_ensure_response(
			array(
				'success'  => true,
				'response' => $license_data,
			)
		);
	}

	/**
	 * Deactivate license.
	 *
	 * @param \WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function deactivate_license( \WP_REST_Request $request ) {

		// retrieve the license from the database
		$license = trim( get_option( 'formello_license' ) );

		// data to send in our API request
		$api_params = array(
			'edd_action'  => 'deactivate_license',
			'license'     => $license,
			'item_name'   => urlencode( 'Formello' ), // the name of our product in EDD
			'url'         => home_url(),
			'environment' => function_exists( 'wp_get_environment_type' ) ? wp_get_environment_type() : 'production',
		);

		// Call the custom API.
		$response = wp_remote_post( FORMELLO_STORE_URL, array( 'timeout' => 15, 'sslverify' => false, 'body' => $api_params ) );

		// make sure the response came back okay
		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {

			if ( is_wp_error( $response ) ) {
				$message = $response->get_error_message();
			} else {
				$message = __( 'An error occurred, please try again.' );
			}

			return rest_ensure_response(
				array(
					'success'  => false,
					'response' => $message,
				)
			);
		}

		// decode the license data
		$license_data = json_decode( wp_remote_retrieve_body( $response ) );

		// $license_data->license will be either "deactivated" or "failed"
		if ( 'deactivated' === $license_data->license ) {
			update_option( 'formello_license_status', false );
		}

		return rest_ensure_response(
			array(
				'success'  => true,
				'response' => __( 'License deactivated.', 'formello' ),
			)
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