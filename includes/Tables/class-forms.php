<?php
/**
 * Create forms Table.
 *
 * @package Formello
 */

namespace Formello\Tables;

/**
 * Forms Table
 */
class Forms extends \WP_List_Table {

	/** Class constructor */
	public function __construct() {
		parent::__construct(
			array(
				'singular' => __( 'Form', 'formello' ), // singular name of the listed records.
				'plural'   => __( 'Forms', 'formello' ), // plural name of the listed records.
				'ajax'     => false, // does this table support ajax?
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

		$table = "{$wpdb->prefix}formello_forms";

		return $wpdb->query( 'SELECT COUNT(*) FROM {$table}' );
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
		$title = sprintf(
			'<a href="%s">%s</a>',
			esc_attr(
				add_query_arg(
					array(
						'form'      => $item['id'],
						'form_name' => $item['name'],
						'paged'     => false,
					)
				)
			),
			$item['name']
		);
		return $title;
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

		$per_page     = $this->get_items_per_page( 'forms_per_page', 5 );
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
			'id'         => 'ID',
			'name'       => 'Name',
			'created_at' => 'Created',
		);
		return $columns;
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
		return array( 'name' => array( 'name', false ) );
	}

	/**
	 * Get the table data
	 *
	 * @return Array
	 */
	private function table_data( $per_page = 5, $page_number = 1 ) {

		global $wpdb;
		$params = array();
		$table  = "{$wpdb->prefix}formello_forms";

		$sql = 'SELECT id, name, created_at FROM ' . $table;

		if ( ! empty( $_REQUEST['orderby'] ) ) {
			$order              = sanitize_text_field( $_REQUEST['order'] );
			$order              = esc_sql( wp_unslash( $order ) );
			$params['order_by'] = esc_sql( wp_unslash( $_REQUEST['orderby'] ) );
			$params['order']    = ! empty( $order ) ? $order : 'ASC';
			$sql               .= ' ORDER BY %s %s';
		}

		$params['per_page'] = $per_page;
		$params['offset']   = ( $page_number - 1 ) * $per_page;

		$sql .= ' LIMIT %d';
		$sql .= ' OFFSET %d';

		$result = $wpdb->get_results(
			$wpdb->prepare( $sql, $params ),
			ARRAY_A
		);

		return $result;

	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param  Array $item Data
	 * @param  String $column_name - Current column name.
	 *
	 * @return Mixed
	 */
	public function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'id':
			case 'name':
			case 'created_at':
				return $item[ $column_name ];
			default:
				return esc_html( $item );
		}
	}
}
