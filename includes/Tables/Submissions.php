<?php
namespace Formello\Tables;

class Submissions extends \WP_List_Table {

	protected $date_format;
	protected $datetime_format;
	protected $form_id;
	protected $data;


	/** Class constructor */
	public function __construct() {

		parent::__construct( [
			'singular' => __( 'Submission', 'formello' ), //singular name of the listed records
			'plural'   => __( 'Submissions', 'formello' ), //plural name of the listed records
			'ajax'     => false //does this table support ajax?
		] );

		$this->date_format = get_option( 'date_format' );
		$this->datetime_format = sprintf('%s %s', $this->date_format, get_option( 'time_format' ) );
		$this->form_id = isset( $_GET['form'] ) ? $_GET['form'] : 1;

	}

	/**
	 * Delete a customer record.
	 *
	 * @param int $id customer ID
	 */
	public static function delete_submission( $id ) {
		global $wpdb;

		$wpdb->delete(
			"{$wpdb->prefix}formello_submissions",
			[ 'id' => absint( $id ) ],
			[ '%d' ]
		);
	}


	/**
	 * Returns the count of records in the database.
	 *
	 * @return null|string
	 */
	public static function record_count() {
		global $wpdb;
		$formId = absint($_GET['form']);
		$sql = "SELECT COUNT(*) FROM {$wpdb->prefix}formello_submissions WHERE form_id = {$formId}";

		return $wpdb->get_var( $sql );
	}

	/** Text displayed when no customer data is available */
	public function no_items() {
		_e( 'No submissions available.', 'formello' );
	}

	/**
	 * Returns an associative array containing the bulk action
	 *
	 * @return array
	 */
	public function get_bulk_actions() {
		$actions = [
			'bulk-delete' => 'Delete'
		];

		return $actions;
	}

	/**
	 * Method for name column
	 *
	 * @param array $item an array of DB data
	 *
	 * @return string
	 */
	function column_submitted_at( $item ) {
		return date( $this->datetime_format, strtotime( $item['submitted_at'] ) );
	}

	/**
	 * Handles data query and filter, sorting, and pagination.
	 */
	public function prepare_items() {

		/** Process bulk action */
		$this->process_bulk_action();


        $hidden = $this->get_hidden_columns();
        $sortable = $this->get_sortable_columns();

        //$perPage = 10;
        $perPage        = $this->get_items_per_page( 'forms_per_page', 5 );
        $currentPage = $this->get_pagenum();
        $totalItems = self::record_count();

		$data = $this->get_data();

        $columns = $this->get_columns();

        $this->set_pagination_args( array(
            'total_items' => $totalItems,
            'per_page'    => $perPage
        ) );

        $this->_column_headers = array($columns, $hidden, $sortable);
        $this->items = $this->data;
	}

	public function process_bulk_action() {

		//Detect when a bulk action is being triggered...
		if ( 'delete' === $this->current_action() ) {

			// In our file that handles the request, verify the nonce.
			$nonce = esc_attr( $_REQUEST['_wpnonce'] );

			if ( ! wp_verify_nonce( $nonce, 'sp_delete_submission' ) ) {
				die( 'Go get a life script kiddies' );
			}
			else {
				self::delete_submission( absint( $_GET['customer'] ) );

       			echo '<div class="notice notice-success is-dismissible"><p>Bulk Deleted..</p></div>';

			}

		}

		// If the delete bulk action is triggered
		if ( ( isset( $_POST['action'] ) && $_POST['action'] == 'bulk-delete' )
		     || ( isset( $_POST['action2'] ) && $_POST['action2'] == 'bulk-delete' )
		) {

			$delete_ids = esc_sql( $_POST['bulk-delete'] );

			// loop over the array of record IDs and delete them
			foreach ( $delete_ids as $id ) {
				self::delete_submission( $id );

			}
			// refresh table
        	$perPage        = $this->get_items_per_page( 'forms_per_page', 5 );
	        $currentPage 	= $this->get_pagenum();
			$this->data 	= $this->table_data( $perPage, $currentPage );

   			echo '<div class="notice notice-success is-dismissible"><p>Submission(s) Deleted.</p></div>';

		}
	}

    /**
     * Override the parent columns method. Defines the columns to use in your listing table
     *
     * @return Array
     */
    public function get_columns()
    {

        $data = $this->get_data();
		return $this->get_submission_columns( $data );

    }

    /**
     * Define which columns are hidden
     *
     * @return Array
     */
    public function get_hidden_columns()
    {
        return array();
    }

    /**
     * Define the sortable columns
     *
     * @return Array
     */
    public function get_sortable_columns()
    {
        return array('submitted_at' => array('submitted_at', false));
    }

    /**
     * Get the table data
     *
     * @return Array
     */
    private function table_data( $per_page = 5, $page_number = 1 )
    {

		global $wpdb;

		$sql = "SELECT id, data, submitted_at FROM {$wpdb->prefix}formello_submissions WHERE form_id = {$this->form_id}";

		if ( ! empty( $_REQUEST['orderby'] ) ) {
			$sql .= ' ORDER BY ' . esc_sql( $_REQUEST['orderby'] );
			$sql .= ! empty( $_REQUEST['order'] ) ? ' ' . esc_sql( $_REQUEST['order'] ) : ' ASC';
		}

		$sql .= " LIMIT $per_page";
		$sql .= " OFFSET " . ( $page_number - 1 ) * $per_page;

		$results = $wpdb->get_results( $sql, OBJECT_K );

        $submissions = array();

        foreach ( $results as $key => $s ) {
			$data = empty( $s->data ) ? array() : (array) json_decode( $s->data, true );
			$data['id'] = (int) $s->id;
			$data['submitted_at'] = $s->submitted_at;
            $submissions[] = $data;
        }
        return $submissions;

    }

    private function get_submission_columns( array $submissions ) {
        $columns = array();
		$columns['cb'] = '<input type="checkbox" />';
        $columns['id'] = 'ID';
        $columns['submitted_at'] = 'Submitted At';

        foreach ( $submissions as $s ) {

            foreach ( $s as $field => $value ) {

                if ( ! isset( $columns[ $field ] ) ) {
                    $columns[ $field ] = esc_html( ucfirst( strtolower( str_replace( '_', ' ', $field ) ) ) );
                }
            }
        }
        return $columns;
    }

    /**
     * Define what data to show on each column of the table
     *
     * @param  Array $item        Data
     * @param  String $column_name - Current column name
     *
     * @return Mixed
     */
    public function column_default( $item, $column_name )
    {
        switch( $column_name ) {
            case 'id':
            case 'submitted_at':
                return $item[$column_name];
            default:
            	$item = !empty($item[$column_name]) ? $item[$column_name] : '';
            	if( $item === 'on' ) {
            		return 'Yes';
            	}
                return esc_html($item);
        }
    }

	/**
	 * Method for name column
	 *
	 * @param array $item an array of DB data
	 *
	 * @return string
	 */

	function column_id( $item ) {

		$title = sprintf( '<a href="%s">%s</a>', esc_attr( add_query_arg( array( 
			'submission' => $item['id'],
		) ) ), $item['id'] );

		$actions = [
			'edit' => sprintf( '<a href="?page=%s&action=%s&submission=%s">View</a>', esc_attr( $_REQUEST['page'] ), 'delete', absint( $item['id'] ) )
		];

		return $title . $this->row_actions( $actions );
		//return $title;
	}

	/**
	 * Render the bulk edit checkbox
	 *
	 * @param array $item
	 *
	 * @return string
	 */
	function column_cb( $item ) {
		return sprintf(
			'<input type="checkbox" name="bulk-delete[]" value="%s" />', $item['id']
		);
	}

	private function get_data(){
        if( empty( $this->data ) ){
        	$perPage        = $this->get_items_per_page( 'forms_per_page', 5 );
	        $currentPage 	= $this->get_pagenum();
			$this->data 	= $this->table_data( $perPage, $currentPage );
        }
        return $this->data;
	}

}
