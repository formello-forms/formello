<?php
namespace Formello;

/**
 * Admin Pages Handler
 */
class Admin {

    protected $forms_table;
    protected $submissions_table;

    public function __construct() {
        add_action( 'admin_menu', [ $this, 'admin_menu' ] );
        add_action( 'formello_settings_area', array( $this, 'add_settings_container' ) );
        add_filter( 'pre_post_update', array( $this, 'formello_pre_insert' ), 10, 2 );
        add_action( 'admin_action_formello_bulk_delete_submissions', array( $this, 'process_bulk_delete_submissions' ) );
        add_filter( 'set-screen-option', [ $this, 'set_screen' ], 10, 3 );
    }

    public function hooks() {}

    /**
     * Register our menu page
     *
     * @return void
     */
    public function admin_menu() {

        global $submenu;

        $capability = 'manage_options';
        $slug       = 'formello';

        add_menu_page( __( 'Formello', 'formello' ), __( 'Formello', 'formello' ), $capability, $slug, [ $this, 'forms_page' ], 'dashicons-text' );

        $submission_hook = add_submenu_page( $slug, __( 'Submissions', 'formello' ), __( 'Submissions', 'formello' ), $capability, 'formello', array( $this, 'forms_page' ) );
        $settings_hook = add_submenu_page( $slug, __( 'Settings', 'formello' ), __( 'Settings', 'formello' ), $capability, 'formello-settings', array( $this, 'settings_page' ) );

        add_action( "load-$submission_hook", [ $this, 'screen_option' ] );
        add_action( "load-$settings_hook", [ $this, 'settings_hooks' ] );

    }

    /**
     * Screen options
     */
    public function screen_option() {
 
        $option = 'per_page';
        $args   = [
            'label'   => 'Records',
            'default' => 5,
            'option'  => 'forms_per_page'
        ];

        add_screen_option( $option, $args );

        $this->forms_table = new Tables\Forms();      
        $this->submissions_table = new Tables\Submissions();      

    }

    public static function set_screen( $status, $option, $value ) {
        return $value;
    }

    /**
     * Initialize our hooks for the admin page
     *
     * @return void
     */
    public function settings_hooks() {
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
    }

    /**
     * Load scripts and styles for the app
     *
     * @return void
     */
    public function enqueue_scripts() {
        wp_enqueue_style(
            'formello-dashboard',
            FORMELLO_URL . '/build/dashboard.css',
            array('wp-components'),
            FORMELLO_VERSION
        );

        wp_enqueue_script(
            'formello-settings',
            FORMELLO_URL . '/build/dashboard.js',
            array( 'wp-api', 'wp-i18n', 'wp-components', 'wp-element', 'wp-api-fetch' ),
            FORMELLO_VERSION,
            true
        );

        wp_localize_script(
            'formello-settings',
            'formelloSettings',
            array(
                'settings' => wp_parse_args(
                    get_option( 'formello', array() ),
                    formello_get_option_defaults()
                ),
            )
        );
    }

    /**
     * Add settings container.
     *
     * @since 1.2.0
     */
    public function add_settings_container() {
        echo '<div id="formello-block-default-settings"></div>';
    }

    /**
     * Add settings container.
     *
     * @since 1.2.0
     */
    public function submission_page_detail( $form ) {
        $id = (int) $form;

        global $wpdb;
        $table      = $wpdb->prefix . 'formello_submissions';
        $object     = $wpdb->get_row( $wpdb->prepare( "SELECT s.* FROM {$table} s WHERE s.id = %d;", $id ), OBJECT );
        $submission = Submission::from_object( $object );

        require dirname( __FILE__ ) . '/views/submission.php';
    }

    /**
     * Add settings container.
     *
     * @since 1.2.0
     */
    public function submissions_page( $form ) {
        require dirname( __FILE__ ) . '/views/submissions.php';
    }

    public function get_submission_columns( array $submissions ) {
        $columns = array();
        foreach ( $submissions as $s ) {
            if ( ! is_array( $s->data ) ) {
                continue;
            }

            foreach ( $s->data as $field => $value ) {
                if ( ! isset( $columns[ $field ] ) ) {
                    $columns[ $field ] = esc_html( ucfirst( strtolower( str_replace( '_', ' ', $field ) ) ) );
                }
            }
        }
        return $columns;
    }

    /**
     * Output our Dashboard HTML.
     *
     * @since 0.1
     */
    public function forms_page() {
        if( isset($_GET['submission']) ){
            return $this->submission_page_detail( $_GET['submission'] );
        }
        if( isset($_GET['form']) ){
            return $this->submissions_page( $_GET['form'] );
        }

        require dirname( __FILE__ ) . '/views/forms.php';
    }

    /**
     * Output our Dashboard HTML.
     *
     * @since 0.1
     */
    public function settings_page() {
        ?>
            <div class="wrap formello-dashboard-wrap">
                <h1><?php _e( 'Settings', 'formello' ); ?></h1>

                <div class="formello-settings-area">
                    <?php do_action( 'formello_settings_area' ); ?>
                </div>
            </div>
        <?php
    }

    /**
     * Store Formello form settings in DB.
     *
     * @since 0.1
     */
    public function formello_pre_insert( $id, $data ){

        //at this point, if it's not a new post, $postarr["ID"] should be set
        $blocks = parse_blocks( $data['post_content'] );

        foreach( $blocks as $block ) {
            if( 'formello/form' === $block['blockName'] ) {
                $id = $block['attrs']['id'];
                $this->formello_insert( $id, $block );
            }
        }

        return $data;
    }

    /**
     * Store Formello form settings in DB.
     *
     * @since 0.1
     */
    public function formello_insert( $id, $block ){

        $default_settings = array(
            'recaptchaEnabled'  => false,
            'hide'              => false,
            'storeSubmissions'  => false,
        );
        $db_settings = get_option('formello', formello_get_option_defaults() );

        // remove validation messages, we get this globally
        unset( $db_settings['validation_messages'] );
        //unset( $db_settings['integrations'] );

        $settings = array_merge( $db_settings, $block['attrs'] );
        $settings = array_merge( $default_settings, $settings );

        $settings[ 'constraints' ] = $block[ 'attrs' ][ 'constraints' ];

        $settings[ 'actions' ] = [];

        foreach( $block['innerBlocks'] as $b ) {
            if( 'formello/actions' === $b['blockName'] ) {
                $settings[ 'actions' ] = $this->formello_get_actions($b['innerBlocks']);
            }
        }

        $settings = maybe_serialize( $settings );
        $name = $block['attrs']['name'];
        
        global $wpdb;

        $table = $wpdb->prefix . 'formello_forms';
        $wpdb->prepare(
            $wpdb->update( $table, [
                'settings' => $settings,
                'name' => $name,
            ], [
                'id' => $id
            ])
        );
        
    }

    /**
     * Store Formello action settings in DB.
     *
     * @since 0.1
     */
    protected function formello_get_actions( $blocks ){
        
        $actions = [];

        foreach( $blocks as $block ) {

            $actions[ $block['attrs']['name'] ] = [ 
                'settings' => $block['attrs']['settings'] ?: [],
                'type' => $block['attrs']['type'] // str_replace( 'formello/actions-', '', $block['blockName']
            ];

        }

        return $actions;
    }

    /**
    * Returns a formatted & HTML-escaped field value. Detects file-, array- and date-types.
    *
    * Caveat: if value is a file, an HTML string is returned (which means email action should use "Content-Type: html" when it includes a file field).
    *
    * @param string|array $value
    * @param int $limit
    * @param Closure|string $escape_function
    * @return string
    * @since 1.3.1
    */
    protected function formello_field_value( $value, $limit = 0, $escape_function = 'esc_html' ) {
        if ( $value === '' ) {
            return $value;
        }

        if ( $this->formello_is_file( $value ) ) {
            $file_url = isset( $value['url'] ) ? $value['url'] : '';
            if ( isset( $value['attachment_id'] ) ) {
                $file_url = admin_url( sprintf( 'post.php?action=edit&post=%d', $value['attachment_id'] ) );
            }
            $short_name = substr( $value['name'], 0, 20 );
            $suffix     = strlen( $value['name'] ) > 20 ? '...' : '';
            return sprintf( '<a href="%s">%s%s</a> (%s)', esc_attr( $file_url ), esc_html( $short_name ), esc_html( $suffix ), $this->formello_human_filesize( $value['size'] ) );
        }

        if ( $this->formello_is_date( $value ) ) {
            $date_format = get_option( 'date_format' );
            return gmdate( $date_format, strtotime( $value ) );
        }

        // join array-values with comma
        if ( is_array( $value ) ) {
            $value = join( ', ', $value );
        }

        // limit string to certain length
        if ( $limit > 0 ) {
            $limited = strlen( $value ) > $limit;
            $value   = substr( $value, 0, $limit );

            if ( $limited ) {
                $value .= '...';
            }
        }

        // escape value
        if ( $escape_function !== null && is_callable( $escape_function ) ) {
            $value = $escape_function( $value );
        }

        return $value;
    }

    /**
    * Returns true if value is a "file"
    *
    * @param mixed $value
    * @return bool
    */
    protected function formello_is_file( $value ) {
        return is_array( $value )
            && isset( $value['name'] )
            && isset( $value['size'] )
            && isset( $value['type'] );
    }

    /**
    * Returns true if value looks like a date-string submitted from a <input type="date">
    * @param mixed $value
    * @return bool
    * @since 1.3.1
    */
    protected function formello_is_date( $value ) {

        if ( ! is_string( $value )
                || strlen( $value ) !== 10
                || (int) preg_match( '/\d{2,4}[-\/]\d{2}[-\/]\d{2,4}/', $value ) === 0 ) {
            return false;
        }

        $timestamp = strtotime( $value );
        return $timestamp != false;
    }

    /**
     * @param int $size
     * @param int $precision
     * @return string
    */
    protected function formello_human_filesize( $size, $precision = 2 ) {
        for ( $i = 0; ( $size / 1024 ) > 0.9; $i++, $size /= 1024 ) {
            // nothing, loop logic contains everything
        }
        $steps = array( 'B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' );
        return round( $size, $precision ) . $steps[ $i ];
    }


}
