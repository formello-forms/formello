<?php
/**
 * Manage Integrations API.
 *
 * @package Formello
 */

namespace Formello\Rest\Controllers;

use WP_REST_Controller;

/**
 * Integrations API Handler
 */
class Integrations extends Base {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = 'integrations';
	}

	/**
	 * Register the routes
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/list',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_lists' ),
				'permission_callback' => array( $this, 'get_lists_permissions_check' ),
				'args'                => array( $this->get_collection_params() ),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/validate',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'validate' ),
				'permission_callback' => array( $this, 'get_lists_permissions_check' ),
				'args'                => array( $this->get_collection_params() ),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/merge-fields',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_merge_fields' ),
				'permission_callback' => array( $this, 'get_lists_permissions_check' ),
				'args'                => array( $this->get_collection_params() ),
			)
		);
	}

	/**
	 * Check validity of api key.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function validate( $request ) {
		return rest_ensure_response( $result );
	}

	/**
	 * Retrieves a collection of actions.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_lists( $request ) {
		return rest_ensure_response( $result );
	}

	/**
	 * Retrieves a collection of actions.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_merge_fields( $request ) {
		return rest_ensure_response( $result );
	}

	/**
	 * Checks if a given request has access to read the items.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_lists_permissions_check( $request ) {
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
