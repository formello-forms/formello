<?php

namespace Formello\Tables;

class Forms extends \WP_List_Table {

	/** Class constructor */
	public function __construct() {

		parent::__construct( [
			'singular' => __( 'Form', 'formello' ), //singular name of the listed records
			'plural'   => __( 'Forms', 'formello' ), //plural name of the listed records
			'ajax'     => false //does this table support ajax?
		] );

	}

	/**
	 * Returns the count of records in the database.
	 *
	 * @return null|string
	 */
	public static function record_count() {
		global $wpdb;

		$sql = "SELECT COUNT(*) FROM {$wpdb->prefix}formello_forms";

		return $wpdb->get_var( $sql );
	}

	/** Text displayed when no form data is available */
	public function no_items() {
		_e( 'No forms available.', 'formello' );
	}

	/**
	 * Method for name column
	 *
	 * @param array $item an array of DB data
	 *
	 * @return string
	 */

	function column_name( $item ) {

		$title = sprintf( '<a href="%s">%s</a>', esc_attr( add_query_arg( array( 
			'form'       => $item['id'],
			'form_name'  => $item['name'],
            'paged'      => false
		) ) ), $item['name'] );

		return $title;
	}

	/**
	 * Handles data query and filter, sorting, and pagination.
	 */
	public function prepare_items() {

        $columns = $this->get_columns();
        $hidden = $this->get_hidden_columns();
        $sortable = $this->get_sortable_columns();

		/** Process bulk action */
		$this->process_bulk_action();

        //$perPage = 10;
        $perPage        = $this->get_items_per_page( 'forms_per_page', 5 );
        $currentPage    = $this->get_pagenum();
        $totalItems     = self::record_count();

        $this->set_pagination_args( array(
            'total_items' => $totalItems,
            'per_page'    => $perPage
        ) );
        
        $this->_column_headers = array($columns, $hidden, $sortable);
        $this->items = $this->table_data( $perPage, $currentPage );
	}

    /**
     * Override the parent columns method. Defines the columns to use in your listing table
     *
     * @return Array
     */
    public function get_columns()
    {
        $columns = array(
            'id'          	=> 'ID',
            'name'       	=> 'Name',
            'created_at' 	=> 'Created',
        );

        return $columns;
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
        return array( 'name' => array( 'name', false ) );
    }

    /**
     * Get the table data
     *
     * @return Array
     */
    private function table_data( $per_page = 5, $page_number = 1 )
    {

		global $wpdb;

		$sql = "SELECT * FROM {$wpdb->prefix}formello_forms";

		if ( ! empty( $_REQUEST['orderby'] ) ) {
			$sql .= ' ORDER BY ' . esc_sql( $_REQUEST['orderby'] );
			$sql .= ! empty( $_REQUEST['order'] ) ? ' ' . esc_sql( $_REQUEST['order'] ) : ' ASC';
		}

		$sql .= " LIMIT $per_page";
		$sql .= " OFFSET " . ( $page_number - 1 ) * $per_page;


		$result = $wpdb->get_results( $sql, ARRAY_A );

		return $result;

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
            case 'name':
            case 'created_at':
                return $item[ $column_name ];
            default:
                return print_r( $item, true ) ;
        }
    }
}
