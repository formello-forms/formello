<?php
/**
 * Create forms Table.
 *
 * @package Formello
 */

namespace Formello\Admin\Tables;

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/screen.php';
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Forms Table
 */
class Forms extends \WP_List_Table {

	/**
	 * The date formate var.
	 *
	 * @var $date_format
	 */
	protected $date_format;

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct(
			array(
				'singular' => __( 'Form', 'formello' ), // singular name of the listed records.
				'plural'   => __( 'Forms', 'formello' ), // plural name of the listed records.
				'ajax'     => false, // does this table support ajax?
			)
		);
		$this->date_format = get_option( 'date_format' );
	}

	/**
	 * Returns the count of records in the database.
	 *
	 * @return null|string
	 */
	public static function record_count() {
		global $wpdb;

		$table_forms  = "{$wpdb->prefix}posts";
		$table_submissions  = "{$wpdb->prefix}formello_submissions";

		$sql = "SELECT COUNT(*) FROM {$table_forms} f WHERE f.post_type = %s AND f.post_status = %s";

		$result = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'posts f WHERE f.post_type = %s AND f.post_status = %s OR f.post_status = %s',
				array(
					'post_type' => 'formello_form',
					'post_status' => 'publish',
					'post_status_private' => 'formello-private',
				)
			)
		);

		return $result;
	}

	/** Text displayed when no form data is available */
	public function no_items() {
		esc_html_e( 'No forms available.', 'formello' );
	}

	/**
	 * Method for name column
	 *
	 * @param array $item an array of DB data.
	 *
	 * @return string
	 */
	public function column_name( $item ) {
		$badge = '';
		$title = sprintf(
			'<a href="%s">%s</a>',
			esc_attr(
				add_query_arg(
					array(
						'page'     => 'formello-submissions',
						'form_id'  => $item['id'],
						'paged'    => false,
						'order'    => false,
						'orderby'  => false,
					)
				)
			),
			! empty( $item['form_name'] ) ? $item['form_name'] : __( '(No title)' )
		);
		if ( ! empty( $item['news'] ) ) {
			$badge = sprintf(
				'<span class="formello-badge">%s</span>',
				$item['news']
			);
		}

		return $title . $badge;
	}

	/**
	 * Handles data query and filter, sorting, and pagination.
	 */
	public function prepare_items() {
		$columns  = $this->get_columns();
		$hidden   = $this->get_hidden_columns();
		$sortable = $this->get_sortable_columns();

		/** Process bulk action */
		$this->process_bulk_action();

		$per_page     = $this->get_items_per_page( 'forms_per_page', 10 );
		$current_page = $this->get_pagenum();
		$total_items  = self::record_count();

		$this->set_pagination_args(
			array(
				'total_items' => $total_items,
				'per_page'    => $per_page,
			)
		);

		$this->_column_headers = array( $columns, $hidden, $sortable );
		$this->items           = $this->table_data( $per_page, $current_page );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		$columns = array(
			'name' => 'Name',
			'date' => 'Created',
		);
		return $columns;
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
			'name' => array(
				'form_name',
				false,
			),
			'date' => array(
				'created_at',
				false,
			),
		);
	}

	/**
	 * Get the table data
	 *
	 * @param int $per_page Number of record per page.
	 * @param int $page_number Page number.
	 * @return Array
	 */
	private function table_data( $per_page = 5, $page_number = 1 ) {
		global $wpdb;
		$params = array();
		$params['post_type'] = 'formello_form';
		$table_forms  = "{$wpdb->prefix}posts";
		$table_submissions  = "{$wpdb->prefix}formello_submissions";

		$sql = "SELECT id, post_title as form_name, post_date as created_at, (SELECT count(*) FROM {$table_submissions} s WHERE s.form_id = f.id AND s.is_new = 1 ) as news FROM {$table_forms} f WHERE ( f.post_type = %s ) AND f.post_status = 'publish' OR f.post_status = 'formello-private'";

		if ( ! empty( $_REQUEST['orderby'] ) ) {
			$order              = sanitize_text_field( $_REQUEST['order'] );
			$params['order_by'] = sanitize_text_field( $_REQUEST['orderby'] );
			$params['order']    = ! empty( $order ) ? strtoupper( $order ) : 'ASC';
			$sql               .= ' ORDER BY %1s %1s';
		}

		if ( ! empty( $_REQUEST['s'] ) ) {
			$params['search'] = '%' . sanitize_text_field( $_REQUEST['s'] ) . '%';
			$sql .= ' AND f.post_title LIKE %s';
		}

		$params['per_page'] = $per_page;
		$params['offset']   = ( $page_number - 1 ) * $per_page;

		$sql .= ' LIMIT %d';
		$sql .= ' OFFSET %d';

		$result = $wpdb->get_results(
			// phpcs:ignore
			$wpdb->prepare( $sql, $params ),
			ARRAY_A
		);

		return $result;
	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param  Array  $item Data of column.
	 * @param  String $column_name - Current column name.
	 *
	 * @return Mixed
	 */
	public function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'name':
				return esc_html( $item['name'] );
			case 'date':
				return wp_date( $this->date_format, strtotime( $item['created_at'] ) );
			default:
				return esc_html( $item[ $column_name ] );
		}
	}
}