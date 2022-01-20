<?php
/**
 * Manage FORM API.
 *
 * @package Formello
 */

namespace Formello\Api;

use WP_REST_Controller;

/**
 * REST_API Handler
 */
class Form extends WP_REST_Controller {

	/**
	 * [__construct description]
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = 'form';
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
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => array( $this->get_collection_params() ),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/create',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'                => array( $this->get_collection_params() ),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/delete',
			array(
				'methods'             => \WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_item' ),
				'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				'args'                => array( $this->get_collection_params() ),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array( $this->get_collection_params() ),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			array(
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array( $this->get_collection_params() ),
				),
			)
		);

	}

	/**
	 * Retrieves a collection of items.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$args = array(
			'numberposts'    => -1, // -1 is for all
			'post_type'      => 'formello-form', // or post, page.
			'orderby'        => 'date', // or date, rand.
			'order'          => 'ASC', // or DESC.
			'page'           => 1,
			'posts_per_page' => 2,
		);

		$query = new \WP_Query( $args );

		// set max number of pages and total num of posts.
		$posts = $query->posts;

		$max_pages = $query->max_num_pages;
		$total     = $query->found_posts;

		// set headers and return response.
		$response = new \WP_REST_Response( $posts, 200 );
		$response->header( 'X-WP-Total', $total );
		$response->header( 'X-WP-TotalPages', $max_pages );

		$result = rest_ensure_response( $response );

		return $result;
	}

	/**
	 * Get one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_item( $request ) {
		$id = $request->get_param( 'id' );

		$item = get_post( $id );

		if ( empty( $item ) || 'formello-form' !== $item->post_type ) {
			$item = new \WP_Error( 'no_posts', __( 'No form found' ), array( 'status' => 404 ) ); // status can be changed to any number.
		}

		$response = rest_ensure_response( $item );

		return $response;
	}

	/**
	 * Get one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_item( $request ) {
		$id = $request->get_param( 'id' );

		$settings = $request['settings'];

		/*global $wpdb;

		$sql = "INSERT INTO {$wpdb->prefix}formello_forms (post_id,settings) VALUES (%d,%s) ON DUPLICATE KEY UPDATE settings = %s";

		$sql = $wpdb->prepare( $sql, $id, maybe_serialize( $settings ), maybe_serialize( $settings ) );

		$result = $wpdb->query( $sql );*/

		$result = update_post_meta( $id, '_formello_settings', $settings );

		if ( empty( $result ) ) {
			$result = new \WP_Error( 'no_posts', __( 'No form found' ), array( 'status' => 404 ) ); // status can be changed to any number.
		}

		$response = rest_ensure_response( $result );

		return $response;
	}

	/**
	 * Create one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function create_item( $request ) {
		$form_name = $request->get_param( 'name' );

		global $wpdb;
		$table = $wpdb->prefix . 'formello_forms';

		$data = array(
			'name' => $form_name,
		);

		$wpdb->insert(
			$table,
			$data
		);

		$response = rest_ensure_response( array( 'id' => $wpdb->insert_id ) );

		return $response;

	}

	/**
	 * Delete one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Request
	 */
	public function delete_item( $request ) {
		$id = $request->get_param( 'id' );

		global $wpdb;
		$table = $wpdb->prefix . 'formello_forms';

		$data = array(
			'is_trashed' => 1,
		);

		$where = array(
			'id' => $id,
		);

		$wpdb->update(
			$table,
			$data,
			$where
		);

		$response = rest_ensure_response( 'form trashed - ' . $id );

		return $response;

	}

	/**
	 * Checks if a given request has access to read the items.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		return true;
	}

	/**
	 * Check if a given request has access to get a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function get_item_permissions_check( $request ) {
		return $this->get_items_permissions_check( $request );
	}

	/**
	 * Check if a given request has access to create items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function create_item_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Check if a given request has access to update a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function update_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
	}

	/**
	 * Check if a given request has access to delete a specific item
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function delete_item_permissions_check( $request ) {
		return $this->create_item_permissions_check( $request );
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
