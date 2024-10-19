<?php
/**
 * Retrieve Submission.
 *
 * @package Formello
 */

namespace Formello\Rest\Controllers;

/**
 * REST_API Handler
 */
class Columns extends Base {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = 'columns';
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
					'callback'            => array( $this, 'get_submission_columns' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => array(),
				),
			)
		);
	}

	/**
	 * Get all registered columns.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return Array
	 */
	public function get_submission_columns( $request ) {
		$form_id = $request->get_param( 'id' );
		$results = array();

		global $wpdb;
		$results = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT DISTINCT field_name from {$wpdb->prefix}formello_submissions_meta where form_id = %d;",
				array( 'form_id' => $form_id )
			)
		);

		$columns['columns'] = $results;
		$columns['columns'][] = 'submitted_at';
		$columns['id'] = $form_id;

		return $columns;
	}
}
