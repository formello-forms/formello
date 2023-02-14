<?php
/**
 * Retrieve Addons.
 *
 * @package Formello
 */

namespace Formello\Rest\Controllers;

use WP_REST_Controller;

/**
 * REST_API Handler
 */
class Addons extends Base {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = 'addons';
	}

	/**
	 * Register the routes
	 *
	 * @return void
	 */
	public function register_routes() {

		// Get Templates.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_addons' ),
				'permission_callback' => '__return_true',
			)
		);

	}

	/**
	 * Get templates.
	 *
	 * @return mixed
	 */
	public function get_addons() {
		$lang   = substr( get_bloginfo( 'language' ), 0, 2 );
		$url    = 'https://formello.net/en/edd-api/products?nocache=' . time();
		$addons = get_transient( 'formello_addons', false );

		/*
		 * Get remote addons.
		 */
		if ( ! $addons ) {
			$requested_addons = wp_remote_get( $url );

			if ( ! is_wp_error( $requested_addons ) ) {
				$new_addons = wp_remote_retrieve_body( $requested_addons );
				$new_addons = json_decode( $new_addons, true );

				if ( $new_addons && is_array( $new_addons ) ) {
					$addons = $new_addons;

					set_transient( 'formello_addons', $addons );
				}
			} else {
				$addons = array();
			}
		}

		if ( is_array( $addons ) ) {
			return $this->success( $addons );
		} else {
			return $this->error( 'no_templates', __( 'Templates not found.', 'formello' ) );
		}
	}

}
