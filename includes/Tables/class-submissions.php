<?php
/**
 * Create submissions Table.
 *
 * @package Formello
 */

namespace Formello\Tables;

/**
 * The submissions Table
 */
class Submissions extends \WP_List_Table {

	/**
	 * The date formate var.
	 *
	 * @var $date_format
	 */
	protected $date_format;

	/**
	 * The datetime formate var.
	 *
	 * @var $datetime_format
	 */
	protected $datetime_format;

	/**
	 * The id of the form.
	 *
	 * @var $form_id
	 */
	protected $form_id;

	/**
	 * Data of submissions.
	 *
	 * @var $data
	 */
	protected $data;


	/** Class constructor */
	public function __construct() {

		parent::__construct(
			array(
				'singular' => __( 'Submission', 'formello' ), // singular name of the listed records.
				'plural'   => __( 'Submissions', 'formello' ), // plural name of the listed records.
				'ajax'     => false, // does this table support ajax?
			)
		);

		$this->date_format     = get_option( 'date_format' );
		$this->datetime_format = sprintf( '%s %s', $this->date_format, get_option( 'time_format' ) );
		$this->form_id         = isset( $_GET['form'] ) ? absint( $_GET['form'] ) : 1;

	}

	/**
	 * Delete a customer record.
	 *
	 * @param int $id customer ID.
	 */
	public static function delete_submission( $id ) {
		global $wpdb;

		$wpdb->delete(
			"{$wpdb->prefix}formello_submissions",
			array( 'id' => absint( $id ) ),
			array( '%d' )
		);
	}

	/**
	 * Delete a customer record.
	 *
	 * @param int $id customer ID.
	 */
	public static function mark_submission( $id ) {
		global $wpdb;

		$table = $wpdb->prefix . 'formello_submissions';

		$wpdb->query(
			$wpdb->prepare(
				"UPDATE {$table} SET is_new = %d WHERE id = %d;",
				0,
				$id
			)
		);

	}

	/**
	 * Returns the count of records in the database.
	 *
	 * @return null|string
	 */
	public static function record_count() {
		global $wpdb;
		$form_id = isset( $_GET['form'] ) ? absint( $_GET['form'] ) : 0;

		return $wpdb->get_var(
			$wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}formello_submissions WHERE form_id = %d;", array( $form_id ) )
		);
	}

	/** Text displayed when no customer data is available */
	public function no_items() {
		esc_html_e( 'No submissions available.', 'formello' );
	}

	/**
	 * Returns an associative array containing the bulk action
	 *
	 * @return array
	 */
	public function get_bulk_actions() {
		$actions = array(
			'mark-as-read' => 'Mark as Read',
			'bulk-delete' => 'Delete',
		);

		return $actions;
	}

	/**
	 * Method for name column
	 *
	 * @param array $item an array of DB data.
	 *
	 * @return string
	 */
	protected function column_submitted_at( $item ) {
		return gmdate( $this->datetime_format, strtotime( $item['submitted_at'] ) );
	}

	/**
	 * Method for name column
	 *
	 * @param array $item an array of DB data.
	 *
	 * @return string
	 */
	protected function column_actions( $item ) {
		$link = sprintf(
			'<a href="?post_type=formello_form&page=%s&form=%s&submission=%s&paged=%s">%s</a>',
			'formello-submission',
			sanitize_text_field( $_REQUEST['form'] ),
			absint( $item['id'] ),
			isset( $_REQUEST['paged'] ) ? sanitize_text_field( $_REQUEST['paged'] ) : '',
			__( 'View' )
		);
		$link2 = sprintf(
			'<a href="%s">%s</a>',
			esc_attr(
				add_query_arg(
					array(
						'action'		=> 'delete',
						'submission' 	=> $item['id'],
						'_wpnonce'		=> wp_create_nonce( 'sp_delete_submission' )
					)
				)
			),
			__( 'Delete' )
		);
		return $link . ' | ' . $link2;
	}

	/**
	 * Handles data query and filter, sorting, and pagination.
	 */
	public function prepare_items() {

		/** Process bulk action */
		$this->process_bulk_action();

		$hidden   = $this->get_hidden_columns();
		$sortable = $this->get_sortable_columns();

		$per_page     = $this->get_items_per_page( 'submissions_per_page', 10 );
		$current_page = $this->get_pagenum();
		$total_items  = self::record_count();

		$data = $this->get_data();

		$columns = $this->get_columns();

		$this->set_pagination_args(
			array(
				'total_items' => $total_items,
				'per_page'    => $per_page,
			)
		);

		$this->_column_headers = array( $columns, $hidden, $sortable );
		$this->items           = $this->data;
	}

	/**
	 * Perform bulk actions.
	 */
	public function process_bulk_action() {

		// Detect when a bulk action is being triggered...
		if ( 'delete' === $this->current_action() ) {

			// In our file that handles the request, verify the nonce.
			$nonce = esc_attr( $_REQUEST['_wpnonce'] );

			if ( ! wp_verify_nonce( $nonce, 'sp_delete_submission' ) ) {
				echo '<div class="notice notice-error is-dismissible"><p>Go get a life script kiddies.</p></div>';
				wp_die();
			} else {
				self::delete_submission( absint( $_GET['submission'] ) );
				echo '<div class="notice notice-success is-dismissible"><p>Entry was successfully deleted.</p></div>';
			}
			// reset data
			$this->data = array();
		}

		// If the delete bulk action is triggered.
		if ( ( isset( $_POST['action'] ) && 'mark-as-read' === $_POST['action'] )
			|| ( isset( $_POST['action2'] ) && 'mark-as-read' === $_POST['action2'] )
		) {

			$marked_ids = esc_sql( $_POST['bulk-delete'] );

			// loop over the array of record IDs and delete them.
			foreach ( $marked_ids as $id ) {
				self::mark_submission( $id );

			}

			// refresh table.
			$per_page     = $this->get_items_per_page( 'submissions_per_page', 10 );
			$current_page = $this->get_pagenum();
			$this->data   = $this->table_data( $per_page, $current_page );

			echo '<div class="notice notice-success is-dismissible"><p>Submission(s) marked as read.</p></div>';

		}

		// If the delete bulk action is triggered.
		if ( ( isset( $_POST['action'] ) && 'bulk-delete' === $_POST['action'] )
			|| ( isset( $_POST['action2'] ) && 'bulk-delete' === $_POST['action2'] )
		) {

			$delete_ids = esc_sql( $_POST['bulk-delete'] );

			// loop over the array of record IDs and delete them.
			foreach ( $delete_ids as $id ) {
				self::delete_submission( $id );

			}
			// refresh table.
			$per_page     = $this->get_items_per_page( 'submissions_per_page', 10 );
			$current_page = $this->get_pagenum();
			$this->data   = $this->table_data( $per_page, $current_page );

			echo '<div class="notice notice-success is-dismissible"><p>Submission(s) Deleted.</p></div>';

		}
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		$data = $this->get_data();
		return $this->get_submission_columns( $data );
	}

	/**
	 * Define which columns are hidden
	 *
	 * @return Array
	 */
	public function get_hidden_columns() {
		return array();
	}

	/**
	 * Define the sortable columns
	 *
	 * @return Array
	 */
	public function get_sortable_columns() {
		return array(
			'submitted_at' => array(
				'submitted_at',
				false,
			),
			'id' => array(
				'id',
				false,
			),
			'is_new' => array(
				'is_new',
				false,
			),
		);
	}

	/**
	 * Get the table data
	 *
	 * @param int $per_page per page number.
	 * @param int $page_number page number.
	 *
	 * @return Array
	 */
	private function table_data( $per_page = 5, $page_number = 1 ) {

		global $wpdb;

		$sql = "SELECT id, is_new, data, submitted_at FROM {$wpdb->prefix}formello_submissions WHERE form_id = {$this->form_id}";

		if ( ! empty( $_REQUEST['new'] ) ) {
			$sql .= ' AND is_new = ' . esc_sql( $_REQUEST['new'] );
		}

		if ( ! empty( $_REQUEST['orderby'] ) ) {
			$sql .= ' ORDER BY ' . esc_sql( $_REQUEST['orderby'] );
			$sql .= ! empty( $_REQUEST['order'] ) ? ' ' . esc_sql( $_REQUEST['order'] ) : ' ASC';
		}

		$sql .= ' LIMIT ' . $per_page;
		$sql .= ' OFFSET ' . ( $page_number - 1 ) * $per_page;
		
		$results = $wpdb->get_results( $sql, OBJECT_K );

		$submissions = array();

		foreach ( $results as $key => $s ) {
			$data                 = empty( $s->data ) ? array() : (array) json_decode( $s->data, true );
			$data['id']           = (int) $s->id;
			$data['submitted_at'] = $s->submitted_at;
			$data['is_new'] 	  = $s->is_new;
			$submissions[]        = $data;
		}
		return $submissions;

	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param  Array $submissions The data.
	 *
	 * @return Array
	 */
	private function get_submission_columns( array $submissions ) {
		$columns                 = array();
		$columns['cb']           = '<input type="checkbox" />';
		$columns['id']           = 'ID';
		$columns['is_new']       = 'New';

		foreach ( $submissions as $s ) {

			foreach ( $s as $field => $value ) {
				if ( ! isset( $columns[ $field ] ) ) {
					$columns[ $field ] = esc_html( ucfirst( strtolower( str_replace( '_', ' ', $field ) ) ) );
				}
			}
		}
		$columns['submitted_at'] = 'Submitted At';
		$columns['actions'] 	 = 'Actions';
		return $columns;
	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param  Array  $item Data The data.
	 * @param  String $column_name Current column name.
	 *
	 * @return Mixed
	 */
	public function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'id':
			case 'submitted_at':
				return $item[ $column_name ];
			case 'is_new':
				return $item[ $column_name ] ? '<span class="badge"> </span>' : '';
			default:
				$item = ! empty( $item[ $column_name ] ) ? $item[ $column_name ] : '';
				if ( 'on' === $item ) {
					return 'Yes';
				}
				if ( is_array( $item ) ) {
					$item = implode( ',', $item );
				}
				return esc_html( $item );
		}
	}

	/**
	 * Method for name column
	 *
	 * @param array $item An array of DB data.
	 *
	 * @return string
	 */
	protected function column_id( $item ) {

		$title = sprintf(
			'<a href="%s">%s</a>',
			esc_attr(
				add_query_arg(
					array(
						'page'       => 'formello-submission',
						'submission' => $item['id'],
					)
				)
			),
			$item['id']
		);

		return $title;

	}

	/**
	 * Render the bulk edit checkbox
	 *
	 * @param int $item The item ID.
	 *
	 * @return string
	 */
	protected function column_cb( $item ) {
		return sprintf(
			'<input type="checkbox" name="bulk-delete[]" value="%s" />',
			$item['id']
		);
	}

	/**
	 * Render the table
	 *
	 * @return mixed
	 */
	private function get_data() {
		if ( empty( $this->data ) ) {
			$per_page     = $this->get_items_per_page( 'submissions_per_page', 10 );
			$current_page = $this->get_pagenum();
			$this->data   = $this->table_data( $per_page, $current_page );
		}

		return $this->data;
	}

}
