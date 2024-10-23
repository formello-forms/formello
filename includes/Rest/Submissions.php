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
class Submissions extends Base {

	/**
	 * {inheritDoc}
	 */
	public function __construct() {
		$this->rest_base = 'submissions';
	}

	/**
	 * {inheritDoc}
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_submissions' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => array(
						'id' => array(
							'description' => __( 'Unique identifier for the submission.' ),
							'type'        => 'integer',
							'required'    => true,
						),
					),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			array(
				'args' => array(
					'id' => array(
						'description' => __( 'Unique identifier for the submission.' ),
						'type'        => 'integer',
					),
				),
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_submission' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => array(),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'edit_submission' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => array(),
				),
				array(
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_submission' ),
					'permission_callback' => array( $this, 'update_settings_permissions' ),
					'args'                => array(),
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
	public function get_submissions( $request ) {

		$form_id  = $request->get_param( 'id' );
		$per_page = $request->get_param( 'per_page' );
		$page     = $request->get_param( 'page' );
		$order    = $request->get_param( 'order' );
		$orderby  = $request->get_param( 'orderby' );
		$search   = $request->get_param( 'search' );
		$filter   = $request->get_param( 'filter' );
		$status   = $request->get_param( 'status' );

		$columns = $this->get_columns( $form_id );

		$submission_data = '';
		foreach ( $columns as $column ) {
			$submission_data .= ", JSON_UNQUOTE( JSON_EXTRACT( data, '$." . $column . "' ) ) AS `$column`";
			// $submission_data .= ", JSON_VALUE( data->'$." . $column . "' ) AS $column"; ONLY FROM MYSQL 8.0.2.1
		}

		global $wpdb;
		$sql = 'SELECT id, is_new, starred ' . $submission_data . ', submitted_at, user_agent, ip_address, referer_url, form_id 
				FROM %i 
				WHERE form_id = %d';

		$params = array(
			'column'   => $wpdb->prefix . 'formello_submissions',
			'form_id'  => $form_id,
			'search'   => '',
			'order_by' => 'id',
			'order'    => 'DESC',
			'limit'    => (int) $per_page,
			'offset'   => ( $page - 1 ) * $per_page,
		);

		if ( ! empty( $status ) ) {
			if ( in_array( 'is_new', $status ) ) {
				$sql .= ' AND is_new = 1';
			}

			if ( in_array( 'starred', $status ) ) {
				$sql .= ' AND starred = 1';
			}
		}

		if ( ! empty( $search ) ) {
			$params['search'] = '%' . sanitize_text_field( $search ) . '%';
			$sql             .= ' AND data LIKE %s';
		} else {
			unset( $params['search'] );
		}

		if ( ! empty( $orderby ) ) {
			$order              = sanitize_text_field( $order );
			$params['order_by'] = sanitize_text_field( $orderby );
			$params['order']    = ! empty( $order ) ? strtoupper( $order ) : 'ASC';
			$sql               .= ' ORDER BY %1s %2s';
		}

		$sql .= ' LIMIT %d';
		$sql .= ' OFFSET %d';

		$results = $wpdb->get_results(
			// phpcs:ignore
			$wpdb->prepare( $sql, $params ),
			ARRAY_A
		);

		if ( is_wp_error( $results ) ) {
			return $this->error( $results->get_error_code(), $results->get_error_message() );
		}

		$submissions = array();

		foreach ( $results as $data ) {
			$submissions[] = $this->get_object( $data );
		}

		$pag_info = $this->get_pagination_info( $request->get_params() );

		$result = array(
			'records' => $submissions,
			'total' => $pag_info['total'],
			'totalPages' => $pag_info['totalPages'],
		);

		return $this->response( $result );
	}

	/**
	 * {inheritDoc}
	 */
	protected function response( $data ) {
		$response = new \WP_REST_Response();
		$response->set_data( $data['records'] );
		$response->header( 'X-WP-Total', $data['total'] );
		$response->header( 'X-WP-Totalpages', $data['totalPages'] );
		return $response;
	}

	/**
	 * Get one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_submission( $request ) {
		$id = $request->get_param( 'id' );

		$data = $this->get_from_db( $id );
		if ( ! $data ) {
			return new \WP_REST_Response(
				'Not found',
				404
			);
		}
		$submission = $this->get_object( $data );

		return $submission;
	}

	/**
	 * Mark as viewed.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function edit_submission( $request ) {
		$id      = $request->get_param( 'id' );
		$details = $request->get_param( 'details' );
		$fields  = $request->get_param( 'fields' );

		global $wpdb;
		$submission_table = $wpdb->prefix . 'formello_submissions';

		$wpdb->update( $submission_table, $details, array( 'id' => $id ) );

		$submission = $this->get_from_db( $id );
		$submission = $this->get_object( $submission );

		return $submission;
	}

	/**
	 * Delete submission
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function delete_submission( $request ) {
		$id = $request->get_param( 'id' );

		global $wpdb;
		$results = $wpdb->get_col(
			$wpdb->prepare(
				"DELETE from {$wpdb->prefix}formello_submissions where id = %d;",
				array( 'id' => $id )
			)
		);

		return $results;
	}

	/**
	 * Get pagination info
	 *
	 * @param array $req_params Req params.
	 * @return array
	 */
	private function get_pagination_info( $req_params ) {
		global $wpdb;
		$sql = 'SELECT COUNT(*) as total FROM %i WHERE form_id = %d';
		$params = array(
			'column'   => $wpdb->prefix . 'formello_submissions',
			'form_id'  => $req_params['id'],
			'search'   => '',
			'order_by' => 'id',
			'order'    => 'DESC',
		);

		if ( ! empty( $req_params['status'] ) ) {
			if ( in_array( 'is_new', $req_params['status'] ) ) {
				$sql .= ' AND is_new = 1';
			}

			if ( in_array( 'starred', $req_params['status'] ) ) {
				$sql .= ' AND starred = 1';
			}
		}

		if ( ! empty( $req_params['search'] ) ) {
			$params['search'] = '%' . sanitize_text_field( $req_params['search'] ) . '%';
			$sql             .= ' AND data LIKE %s';
		} else {
			unset( $params['search'] );
		}

		$results = $wpdb->get_row(
			// phpcs:ignore
			$wpdb->prepare( $sql, $params ),
		);

		return array(
			'total' => (int) $results->total,
			'totalPages' => (int) ceil( $results->total / $req_params['per_page'] ),
		);
	}

	/**
	 * Get columns.
	 *
	 * @param string $form_id The form_id.
	 * @return array
	 */
	private function get_columns( $form_id ) {
		global $wpdb;
		$results = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT DISTINCT field_name from {$wpdb->prefix}formello_submissions_meta where form_id = %d;",
				array( 'form_id' => $form_id )
			)
		);
		return $results;
	}

	/**
	 * Get one item from the collection
	 *
	 * @param int $id The submission ID.
	 * @return WP_Error|WP_REST_Response
	 */
	private function get_from_db( $id ) {
		global $wpdb;
		$submission = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}formello_submissions s WHERE s.id = %d;",
				array( $id )
			),
			ARRAY_A
		);
		return $submission;
	}

	/**
	 * Get one item from the collection
	 *
	 * @param array $data The submission ID.
	 * @return WP_Error|WP_REST_Response
	 */
	private function get_object( $data ) {

		if ( empty( $data ) ) {
			return array();
		}

		$result = array();

		$details = array(
			'id',
			'is_new',
			'starred',
			'form_id',
			'ip_address',
			'referer_url',
			'user_agent',
			'submitted_at',
		);

		$details_data = array_intersect_key( $data, array_flip( $details ) );
		$fields_data  = array_diff( $data, $details_data );

		$result['id']      = (int) $data['id'];
		$result['details'] = $details_data;
		$result['fields']  = isset( $data['data'] ) ? json_decode( $data['data'] ) : $fields_data;

		return $result;
	}
}
