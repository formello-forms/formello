<?php
/**
 * Retrieve Submission.
 *
 * @package Formello
 */

namespace Formello\Rest;

/**
 * REST_API Handler
 */
class Columns extends Base {
	/**
	 * {inheritDoc}
	 *
	 * @var string
	 */
	protected $rest_base = 'columns';

	/**
	 * {inheritDoc}
	 */
	public function endpoints() {
		return array(
			'/(?P<id>[\d]+)' => array(
				'methods' => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_submission_columns' ),
				'permission_callback' => array( $this, 'update_settings_permissions' ),
			),
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
