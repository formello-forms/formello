<?php
/**
 * Create submissions Table.
 *
 * @package Formello
 */

namespace Formello\Admin\Tables;

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

	/**
	 * Columns.
	 *
	 * @var $columns
	 */
	protected $columns;

	/**
	 * Columns.
	 *
	 * @var $news
	 */
	protected $news = 0;

	/**
	 * Columns.
	 *
	 * @var $favorites
	 */
	protected $favorites = 0;

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
	 * @param int     $id customer ID.
	 * @param string  $column column name.
	 * @param boolean $value Yes or no.
	 */
	public static function mark_submission( $id, $column, $value = 0 ) {
		global $wpdb;

		$table = $wpdb->prefix . 'formello_submissions';

		$wpdb->query(
			$wpdb->prepare(
				"UPDATE `{$table}` SET `{$column}` = %d WHERE id = %d;",
				$value,
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

		$sql = "SELECT COUNT(*) FROM {$wpdb->prefix}formello_submissions WHERE form_id = %d";

		if ( ! empty( $_REQUEST['new'] ) ) {
			$sql .= ' AND is_new = ' . esc_sql( $_REQUEST['new'] );
		}

		if ( ! empty( $_REQUEST['starred'] ) ) {
			$sql .= ' AND starred = ' . esc_sql( $_REQUEST['starred'] );
		}

		return $wpdb->get_var(
			$wpdb->prepare( $sql, array( $form_id ) )
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
			'mark-as-unread' => 'Mark as Unread',
			'mark-as-starred' => 'Star',
			'mark-as-unstarred' => 'Unstar',
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
		$view_link = sprintf(
			'<a href="?post_type=formello_form&page=%s&form=%s&submission=%s&paged=%s">%s</a>',
			'formello-submission',
			sanitize_text_field( $_REQUEST['form'] ),
			absint( $item['id'] ),
			isset( $_REQUEST['paged'] ) ? sanitize_text_field( $_REQUEST['paged'] ) : '',
			__( 'View' )
		);
		$delete_link = sprintf(
			'<a href="%s" onclick="return confirm(\'%s\')">%s</a>',
			esc_attr(
				add_query_arg(
					array(
						'action'     => 'delete',
						'submission' => $item['id'],
						'_wpnonce'   => wp_create_nonce( 'sp_delete_submission' ),
					)
				)
			),
			__( 'Do you want delete this record?', 'formello' ),
			__( 'Delete' )
		);
		return $view_link . ' | ' . $delete_link;
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

			if ( ! wp_verify_nonce( esc_attr( $_REQUEST['_wpnonce'] ), 'sp_delete_submission' ) ) {
				echo '<div class="notice notice-error is-dismissible"><p>' . __( 'Go get a life script kiddies.', 'formello' ) . '</p></div>';
				wp_die();
			} else {
				self::delete_submission( absint( $_GET['submission'] ) );
				$this->refresh_table( __( 'Entry successfully deleted.', 'formello' ) );
			}
			// reset data.
			$this->data = array();
		}

		// If the delete bulk action is triggered.
		if ( ( isset( $_POST['action'] ) && 'mark-as-read' === $_POST['action'] )
			|| ( isset( $_POST['action2'] ) && 'mark-as-read' === $_POST['action2'] )
		) {

			$marked_ids = esc_sql( $_POST['bulk-delete'] );

			// loop over the array of record IDs and delete them.
			foreach ( $marked_ids as $id ) {
				self::mark_submission( absint( $id ), 'is_new', 0 );

			}

			// refresh table.
			$this->refresh_table( __( 'Submission(s) marked as read.', 'formello' ) );

		}

		// If the delete bulk action is triggered.
		if ( ( isset( $_POST['action'] ) && 'mark-as-starred' === $_POST['action'] )
			|| ( isset( $_POST['action2'] ) && 'mark-as-starred' === $_POST['action2'] )
		) {

			$marked_ids = esc_sql( $_POST['bulk-delete'] );

			// loop over the array of record IDs and delete them.
			foreach ( $marked_ids as $id ) {
				self::mark_submission( $id, 'starred', 1 );

			}

			// refresh table.
			$this->refresh_table( __( 'Submission(s) marked as starred.', 'formello' ) );

		}

		// If the delete bulk action is triggered.
		if ( ( isset( $_POST['action'] ) && 'mark-as-unread' === $_POST['action'] )
			|| ( isset( $_POST['action2'] ) && 'mark-as-unread' === $_POST['action2'] )
		) {

			$marked_ids = esc_sql( $_POST['bulk-delete'] );

			// loop over the array of record IDs and delete them.
			foreach ( $marked_ids as $id ) {
				self::mark_submission( $id, 'is_new', 1 );

			}

			// refresh table.
			$this->refresh_table( __( 'Submission(s) marked as starred.', 'formello' ) );

		}

		// If the delete bulk action is triggered.
		if ( ( isset( $_POST['action'] ) && 'mark-as-unstarred' === $_POST['action'] )
			|| ( isset( $_POST['action2'] ) && 'mark-as-unstarred' === $_POST['action2'] )
		) {

			$marked_ids = esc_sql( $_POST['bulk-delete'] );

			// loop over the array of record IDs and delete them.
			foreach ( $marked_ids as $id ) {
				self::mark_submission( $id, 'starred', 0 );

			}

			// refresh table.
			$this->refresh_table( __( 'Submission(s) marked as starred.', 'formello' ) );

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
			$this->refresh_table( __( 'Submission(s) deleted.', 'formello' ) );

		}
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return $this->get_submission_columns();
	}

	/**
	 * Define which columns are hidden
	 *
	 * @return Array
	 */
	public function get_hidden_columns() {
		return array( 'id' );
	}

	/**
	 * Define the sortable columns
	 *
	 * @return Array
	 */
	public function get_sortable_columns() {
		return array(
			'formello_date' => array(
				'submitted_at',
				false,
			),
			'id' => array(
				'id',
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

		$sql = "SELECT id, is_new, starred, data, submitted_at, 
				(select COUNT(*) from {$wpdb->prefix}formello_submissions WHERE is_new = 1 AND form_id = {$this->form_id}) as news,
				(select COUNT(*) from {$wpdb->prefix}formello_submissions WHERE starred = 1 AND form_id = {$this->form_id}) as favorites
				FROM {$wpdb->prefix}formello_submissions 
				WHERE form_id = {$this->form_id}";

		if ( ! empty( $_REQUEST['s'] ) ) {
			$sql .= ' AND data LIKE "%' . esc_sql( $_REQUEST['s'] ) . '%"';
		}

		if ( ! empty( $_REQUEST['new'] ) ) {
			$sql .= ' AND is_new = ' . esc_sql( $_REQUEST['new'] );
		}

		if ( ! empty( $_REQUEST['starred'] ) ) {
			$sql .= ' AND starred = ' . esc_sql( $_REQUEST['starred'] );
		}

		$order_by = ' ORDER BY ' . empty( $_REQUEST['orderby'] ) ? 'id' : esc_sql( $_REQUEST['orderby'] );
		$order = empty( $_REQUEST['order'] ) ? 'DESC' : esc_sql( $_REQUEST['order'] );

		$sql .= ' ORDER BY ' . $order_by . ' ' . $order;

		$sql .= ' LIMIT ' . $per_page;
		$sql .= ' OFFSET ' . ( $page_number - 1 ) * $per_page;

		$results = $wpdb->get_results( $sql, ARRAY_A );

		$submissions = array();

		if ( count( $results ) ) {
			$this->news = $results[0]['news'];
			$this->favorites = $results[0]['favorites'];
		}

		foreach ( $results as $key => $s ) {
			$data                 = empty( $s['data'] ) ? array() : (array) json_decode( $s['data'], true );
			$data['id']           = (int) $s['id'];
			$data['submitted_at'] = $s['submitted_at'];
			$data['is_new']       = $s['is_new'];
			$data['starred']      = $s['starred'];
			$submissions[]        = $data;
		}

		return $submissions;

	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @return Array
	 */
	private function get_submission_columns() {
		$columns                   = array();
		$columns['cb']             = '<input type="checkbox" />';
		$columns['id']             = 'ID';
		$columns['formello_icons'] = '';

		$settings = get_post_meta( $this->form_id, '_formello_settings', true );

		if ( isset( $settings['fields'] ) ) {
			foreach ( array_keys( $settings['fields'] ) as $col ) {

				$columns[ $col ] = esc_html( ucfirst( trim( strtolower( str_replace( '_', ' ', $col ) ) ) ) );

			}
		}

		$columns['formello_date'] = __( 'Submitted At' );
		$columns['actions']       = __( 'Actions' );
		$this->columns = array_keys( $columns );
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
			case 'formello_date':
				return $item['submitted_at'];
			case 'formello_icons':
				$is_new = $item['is_new'] ? '<span class="dashicons dashicons-marker formello-new" title="new"> </span>' : '';
				$starred = $item['starred'] ? '<span class="dashicons dashicons-star-filled formello-star" title="starred"> </span>' : '';
				return $starred . $is_new;
			default:
				$item = ! empty( $item[ $column_name ] ) ? $item[ $column_name ] : '';
				if ( 'on' === $item ) {
					return __( 'Yes' );
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

	/**
	 * Render the news property
	 *
	 * @return int
	 */
	public function get_news() {
		return $this->news;
	}

	/**
	 * Render the favorites property
	 *
	 * @return int
	 */
	public function get_favorites() {
		return $this->favorites;
	}

	/**
	 * Refresh table after changes
	 *
	 * @param string $message The message to show.
	 */
	public function refresh_table( $message ) {
		// refresh table.
		$per_page     = $this->get_items_per_page( 'submissions_per_page', 10 );
		$current_page = $this->get_pagenum();
		$this->data   = $this->table_data( $per_page, $current_page );

		$message_box = sprintf(
			'<div class="notice notice-success is-dismissible"><p>%s</p></div>',
			$message
		);
		echo $message_box;
	}

}
