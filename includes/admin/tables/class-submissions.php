<?php
/**
 * Create submissions Table.
 *
 * @package Formello
 */

namespace Formello\Admin\Tables;

use Formello\Utils\Formatter as Formatter;

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
	 * @var array
	 */
	protected $settings;

	/**
	 * Columns.
	 *
	 * @var array
	 */
	protected $columns;

	/**
	 * News.
	 *
	 * @var int
	 */
	protected $news = 0;

	/**
	 * Starred.
	 *
	 * @var int
	 */
	protected $starred = 0;

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
		$this->form_id         = isset( $_GET['form_id'] ) ? absint( $_GET['form_id'] ) : 0;
		$this->settings        = get_post_meta( $this->form_id, '_formello_settings', true );
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
	 * @param array $ids Submission ids.
	 */
	public static function delete_submissions( $ids = array() ) {
		global $wpdb;

		$ids = implode( ',', array_map( 'absint', $ids ) );
		$wpdb->query(
			$wpdb->prepare(
				'DELETE FROM ' . $wpdb->prefix . 'formello_submissions WHERE id in ( %1s );',
				$ids,
			)
		);
	}

	/**
	 * Mark a submission as starred/new.
	 *
	 * @param string $column column name.
	 * @param string $value column value.
	 * @param array  $ids Yes or no.
	 */
	protected function mark_submissions( $column, $value, $ids = array() ) {
		global $wpdb;

		$table = $wpdb->prefix . 'formello_submissions';

		$ids = implode( ',', array_map( 'absint', $ids ) );

		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . $wpdb->prefix . 'formello_submissions SET %1s = %d WHERE id in ( %1s );',
				$column,
				$value,
				$ids,
			)
		);
		$this->refresh_table( __( 'Submission(s) updated.', 'formello' ) );
	}

	/**
	 * Returns the count of records in the database.
	 *
	 * @param string $filter The filter.
	 * @return null|string
	 */
	public function record_count( $filter = 'total' ) {
		global $wpdb;
		$form_id = isset( $_GET['form_id'] ) ? absint( $_GET['form_id'] ) : 0;

		$results = $wpdb->get_results(
			$wpdb->prepare(
				'select COUNT(*) as total, sum(is_new = 1) as new, sum(starred = 1) as starred FROM ' . $wpdb->prefix . 'formello_submissions WHERE form_id = %d',
				array( $form_id )
			)
		);

		$this->news    = $results[0]->new;
		$this->starred = $results[0]->starred;

		return $results[0]->$filter;
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
			'mark-as-read' => __( 'Mark as Read', 'formello' ),
			'mark-as-unread' => __( 'Mark as Unread', 'formello' ),
			'mark-as-starred' => __( 'Star', 'formello' ),
			'mark-as-unstarred' => __( 'Unstar', 'formello' ),
			'bulk-delete' => __( 'Delete' ),
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
			'<a href="?post_type=formello_form&page=%s&form_id=%s&submission_id=%s&paged=%s">%s</a>',
			'formello-submission',
			sanitize_text_field( $_REQUEST['form_id'] ),
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
						'submission_id' => $item['id'],
						'_wpnonce'   => wp_create_nonce( 'formello' ),
					)
				)
			),
			__( 'Do you want delete this record?', 'formello' ),
			__( 'Delete', 'formello' )
		);
		return $view_link . ' | ' . $delete_link;
	}

	/**
	 * Handles data query and filter, sorting, and pagination.
	 */
	public function prepare_items() {

		$filter = ( isset( $_REQUEST['formello'] ) ? $_REQUEST['formello'] : 'total' );

		$hidden   = $this->get_hidden_columns();
		$sortable = $this->get_sortable_columns();

		/** Process bulk action */
		$this->process_bulk_action();

		$per_page     = $this->get_items_per_page( 'submissions_per_page', 10 );
		$current_page = $this->get_pagenum();
		$total_items  = $this->record_count( $filter );

		$data = $this->get_data( $filter );

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

		$action     = $this->current_action();
		$marked_ids = isset( $_REQUEST['bulk-delete'] ) ? wp_parse_id_list( wp_unslash( $_REQUEST['bulk-delete'] ) ) : array();

		switch ( $action ) {
			case 'delete':
				if ( ! wp_verify_nonce( esc_attr( $_REQUEST['_wpnonce'] ), 'formello' ) ) {
					$message_box = sprintf(
						'<div class="notice notice-warning is-dismissible"><p>%s</p></div>',
						__( 'Entry not deleted. Probably you clicked on expired link', 'formello' )
					);
					echo wp_kses_post( $message_box );
				} else {
					self::delete_submission( absint( $_REQUEST['submission_id'] ) );
					$this->refresh_table( __( 'Entry successfully deleted.', 'formello' ) );
				}
				break;
			case 'bulk-delete':
				if ( ! wp_verify_nonce( esc_attr( $_REQUEST['_wpnonce'] ), 'bulk-' . $this->_args['plural'] ) ) {
					$message_box = sprintf(
						'<div class="notice notice-success is-dismissible"><p>%s</p></div>',
						__( 'Go get a life script kiddies.', 'formello' )
					);
					echo wp_kses_post( $message_box );
					wp_die();
				} else {
					self::delete_submissions( $marked_ids );
					$this->refresh_table( __( 'Entry successfully deleted.', 'formello' ) );
				}
				break;
			case 'mark-as-read':
				self::mark_submissions( 'is_new', 0, $marked_ids );
				break;
			case 'mark-as-unread':
				self::mark_submissions( 'is_new', 1, $marked_ids );
				break;
			case 'mark-as-starred':
				self::mark_submissions( 'starred', 1, $marked_ids );
				break;
			case 'mark-as-unstarred':
				self::mark_submissions( 'starred', 0, $marked_ids );
				break;
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
		return array();
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
	 * @param int    $per_page per page number.
	 * @param int    $page_number page number.
	 * @param string $filter The filter.
	 *
	 * @return Array
	 */
	private function table_data( $per_page = 5, $page_number = 1, $filter = 'total' ) {
		global $wpdb;

		$sql = "SELECT id, is_new, starred, data, submitted_at, 
				(select COUNT(*) from {$wpdb->prefix}formello_submissions WHERE is_new = 1 AND form_id = {$this->form_id}) as news,
				(select COUNT(*) from {$wpdb->prefix}formello_submissions WHERE starred = 1 AND form_id = {$this->form_id}) as favorites
				FROM {$wpdb->prefix}formello_submissions 
				WHERE form_id = {$this->form_id}";

		$params = array(
			'order_by' => 'id',
			'order' => 'DESC',
			'per_page' => $per_page,
			'page_number' => ( $page_number - 1 ) * $per_page,
		);

		if ( 'new' === $filter ) {
			$sql .= ' AND is_new = 1';
		}

		if ( 'starred' === $filter ) {
			$sql .= ' AND starred = 1';
		}

		if ( ! empty( $_REQUEST['s'] ) ) {
			array_unshift( $params, '%' . sanitize_text_field( $_REQUEST['s'] ) . '%' );
			$sql .= ' AND data LIKE %s';
		}

		if ( ! empty( $_REQUEST['orderby'] ) ) {
			$order              = sanitize_text_field( $_REQUEST['order'] );
			$params['order_by'] = sanitize_text_field( $_REQUEST['orderby'] );
			$params['order']    = ! empty( $order ) ? strtoupper( $order ) : 'ASC';
		}

		$sql .= ' ORDER BY %1s %1s';
		$sql .= ' LIMIT %d';
		$sql .= ' OFFSET %d';

		$results = $wpdb->get_results(
			$wpdb->prepare( $sql, $params ),
			ARRAY_A
		);

		$submissions = array();

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

		$settings = get_post_meta( $this->form_id, '_formello_settings', true );

		if ( isset( $this->settings['fields'] ) ) {
			foreach ( array_keys( $settings['fields'] ) as $col ) {
				$columns[ sanitize_key( $col ) ] = esc_html( ucfirst( trim( sanitize_key( $col ) ) ) );
			}
		}

		$columns['formello_date'] = __( 'Submitted At' );
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
			case 'formello_date':
				return $item['submitted_at'];
			default:
				$item = ! empty( $item[ $column_name ] ) ? $item[ $column_name ] : '';
				return Formatter::format( $item, $this->settings['fields'][ $column_name ] );
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
						'submission_id' => $item['id'],
					)
				)
			),
			$item['id']
		);

		$view_url = add_query_arg(
			array(
				'post_type' => 'formello_form',
				'page' => 'formello-submission',
				'form_id' => sanitize_text_field( $_REQUEST['form_id'] ),
				'submission_id' => $item['id'],
				'paged' => isset( $_REQUEST['paged'] ) ? sanitize_text_field( $_REQUEST['paged'] ) : '',
			),
			admin_url( 'edit.php' )
		);
		$view_link = sprintf(
			'<span class="edit"><a href="%s">%s</a></span>',
			$view_url,
			__( 'View' )
		);
		$delete_link = sprintf(
			'<span class="trash"><a href="%s" onclick="return confirm(\'%s\')">%s</a></span>',
			esc_attr(
				add_query_arg(
					array(
						'action'     => 'delete',
						'submission_id' => $item['id'],
						'_wpnonce'   => wp_create_nonce( 'formello' ),
					)
				)
			),
			__( 'Do you want delete this record?', 'formello' ),
			__( 'Delete' )
		);

		$is_new = $item['is_new'] ? 'dashicons dashicons-marker' : '';
		$starred = $item['starred'] ? 'dashicons dashicons-star-filled' : '';

		$icons = sprintf(
			'<div><span class="%s formello-new" title="new"> </span><span class="%s formello-star" title="starred"> </span></div>',
			esc_attr(
				$is_new
			),
			esc_attr(
				$starred
			),
		);

		$output = '<div class="formello-icons-group">' . $title . $icons . '</div><div class="row-actions">' . $view_link . ' | ' . $delete_link . '</div>';

		return $output;
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
	 * @param string $filter The filter.
	 * @return mixed
	 */
	private function get_data( $filter ) {
		if ( empty( $this->data ) ) {
			$per_page     = $this->get_items_per_page( 'submissions_per_page', 10 );
			$current_page = $this->get_pagenum();
			$this->data   = $this->table_data( $per_page, $current_page, $filter );
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
		echo wp_kses_post( $message_box );
	}

	/**
	 * Refresh table after changes
	 */
	protected function get_views() {

		$views = array();

		$current = ( ! empty( $_REQUEST['formello'] ) ? $_REQUEST['formello'] : 'total' );
		$news = $this->get_news();
		$starred = $this->starred;

		$class = ( 'total' === $current ? ' class="current"' : '' );
		$all_url = remove_query_arg( 'formello' );
		$views['all'] = "<a href='{$all_url }' {$class} >" . __( 'All' ) . '</a>';

		$new_url = add_query_arg( 'formello', 'new' );
		$class = ( 'new' === $current ? ' class="current"' : '' );
		$views['new'] = "<a href='{$new_url}' {$class} >" . __( 'Unread', 'formello' ) . " <span class='count'>({$news})</span></a>";

		$starred_url = add_query_arg( 'formello', 'starred' );
		$class = ( 'starred' === $current ? ' class="current"' : '' );
		$views['starred'] = "<a href='{$starred_url}' {$class} >" . __( 'Starred', 'formello' ) . " <span class='count'>({$starred})</span></a>";

		$views = apply_filters( 'formello_submissions_table_link', $views );

		return $views;

	}
}
