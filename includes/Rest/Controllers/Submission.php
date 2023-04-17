<?php
/**
 * Retrieve Submission.
 *
 * @package Formello
 */

namespace Formello\Rest\Controllers;

use \Formello\Submission as Data;

/**
 * REST_API Handler
 */
class Submission extends Base {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = 'submission';
	}

	/**
	 * Register the routes
	 *
	 * @return void
	 */
	public function register_routes() {

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => array( $this->get_collection_params() ),
				),
			)
		);

	}

	/**
	 * Get one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_item( $request ) {
		$id = $request->get_param( 'id' );

		$item = new Data( $id );

		// Mark as viewed.
		$item->viewed();

		// Refresh news badge.
		$item->get_news();

		$response = $item->get();

		if ( is_wp_error( $response ) ) {
			return $this->error( $response->get_error_code(), $response->get_error_message() );
		}

		$response = rest_ensure_response( $response );

		return $response;
	}

}
