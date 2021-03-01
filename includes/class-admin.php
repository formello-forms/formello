<?php
/**
 * Set our block attribute defaults.
 *
 * @package Formello
 */

namespace Formello;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Admin Pages Handler
 *
 * @since 1.0.0
 */
class Admin {

	protected $forms_table;
	protected $submissions_table;

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'formello_settings_area', array( $this, 'add_settings_container' ) );
		add_action( 'pre_post_update', array( $this, 'formello_pre_insert' ), 10, 2 );
		add_filter( 'set-screen-option', array( $this, 'set_screen' ), 10, 3 );
	}

	/**
	 * Hooks
	 */
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

		add_menu_page( __( 'Formello', 'formello' ), __( 'Formello', 'formello' ), $capability, $slug, array( $this, 'forms_page' ), 'dashicons-feedback' );

		$form_hook        = add_submenu_page( $slug, __( 'Forms', 'formello' ), __( 'Submissions', 'formello' ), $capability, 'formello', array( $this, 'forms_page' ) );
		$submissions_hook = add_submenu_page( $slug, __( 'Submissions', 'formello' ), __( 'Submissions', 'formello' ), $capability, 'formello-submissions', array( $this, 'submissions_page' ) );
		$submission_hook  = add_submenu_page( $slug, __( 'Submission', 'formello' ), __( 'Submission', 'formello' ), $capability, 'formello-submission', array( $this, 'submission_page_detail' ) );
		$settings_hook    = add_submenu_page( $slug, __( 'Settings', 'formello' ), __( 'Settings', 'formello' ), $capability, 'formello-settings', array( $this, 'settings_page' ) );

		add_action( "load-$form_hook", array( $this, 'forms_screen_option' ) );
		add_action( "load-$submissions_hook", array( $this, 'submissions_screen_option' ) );
		add_action( "load-$settings_hook", array( $this, 'settings_hooks' ) );
		add_filter( 'submenu_file', array( $this, 'remove_submenu' ) );

	}

	/**
	 * Remove submenu item
	 *
	 * @param string $submenu_file the submenu to hide.
	 */
	public function remove_submenu( $submenu_file ) {

		global $plugin_page;

		$hidden_submenus = array(
			'formello-submissions' => true,
			'formello-submission'  => true,
		);

		// Select another submenu item to highlight (optional).
		if ( $plugin_page && isset( $hidden_submenus[ $plugin_page ] ) ) {
			$submenu_file = 'formello';
		}

		// Hide the submenu.
		foreach ( $hidden_submenus as $submenu => $unused ) {
			remove_submenu_page( 'formello', $submenu );
		}

		return $submenu_file;
	}

	/**
	 * Forms Screen options
	 */
	public function forms_screen_option() {

		$option = 'per_page';
		$args   = array(
			'label'   => 'Forms',
			'default' => 5,
			'option'  => 'forms_per_page',
		);

		add_screen_option( $option, $args );

		$this->forms_table = new Tables\Forms();
	}

	/**
	 * Submissions Screen options
	 */
	public function submissions_screen_option() {

		$option = 'per_page';
		$args   = array(
			'label'   => 'Submissions',
			'default' => 10,
			'option'  => 'submissions_per_page',
		);

		add_screen_option( $option, $args );

		$this->submissions_table = new Tables\Submissions();
	}

	public static function set_screen( $status, $option, $value ) {
		$option = 'per_page';
		$args   = array(
			'label'   => 'Forms',
			'default' => 10,
			'option'  => 'forms_per_page',
		);

		add_screen_option( $option, $args );
		return $value;
	}

	/**
	 * Initialize our hooks for the admin page
	 *
	 * @return void
	 */
	public function settings_hooks() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Load scripts and styles for the app
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( 'formello-settings' );
		wp_enqueue_style( 'formello-settings' );

		// add settings script from addon
		do_action( 'formello_settings_scripts' );

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
	 */
	public function submission_page_detail() {
		if ( isset( $_GET['submission'] ) ) {
			$id = (int) sanitize_text_field( wp_unslash( $_GET['submission'] ) );
		}

		global $wpdb;
		$object = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT s.* FROM {$wpdb->prefix}formello_submissions s WHERE s.id = %d;",
				array( $id )
			),
			OBJECT
		);

		if ( empty( $object ) ) {
			$message = __( 'No submissions found.', 'formello' );
			return $this->error_notice( $message );
		}
		$submission = Data::from_object( $object );

		require dirname( __FILE__ ) . '/views/submission.php';
	}

	/**
	 * Output forms table.
	 */
	public function forms_page() {
		require dirname( __FILE__ ) . '/views/forms.php';
	}

	/**
	 * Output our Dashboard HTML.
	 */
	public function submissions_page() {
		if ( isset( $_GET['form'] ) ) {
			$id = sanitize_text_field( wp_unslash( $_GET['form'] ) );
		}
		global $wpdb;
		$table = $wpdb->prefix . 'formello_forms';
		$form  = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT s.* FROM {$wpdb->prefix}formello_forms s WHERE s.id = %d;",
				array( $id )
			),
			OBJECT
		);
		if ( empty( $form ) ) {
			$message = __( 'No submissions found for this form.', 'formello' );
			return $this->error_notice( $message );
		}
		require dirname( __FILE__ ) . '/views/submissions.php';
	}

	/**
	 * Output our Dashboard HTML.
	 *
	 * @since 0.1
	 */
	public function settings_page() {
		?>
			<div class="formello-dashboard-wrap">
				<div class="formello-settings-area">
					<?php do_action( 'formello_settings_area' ); ?>
				</div>
			</div>
		<?php
	}

	/**
	 * Store Formello form settings in DB.
	 *
	 * @param Int   $id The id of form.
	 * @param mixed $data The data to save.
	 */
	public function formello_pre_insert( $id, $data ) {

		// parse the content.
		$blocks = parse_blocks( $data['post_content'] );

		foreach ( $blocks as $block ) {
			if ( 'formello/form' === $block['blockName'] ) {
				$id = $block['attrs']['id'];
				$this->formello_insert( $id, $block );
			}
		}

	}

	/**
	 * Store Formello form settings in DB.
	 *
	 * @param Int   $id The id of form.
	 * @param mixed $block The block to save.
	 */
	public function formello_insert( $id, $block ) {

		$settings            = $block['attrs'];
		$settings['actions'] = array();

		foreach ( $block['innerBlocks'] as $b ) {
			if ( 'formello/actions' === $b['blockName'] ) {
				$settings['actions'] = $this->formello_get_actions( $b['innerBlocks'] );
			}
		}

		$form_settings = maybe_serialize( $settings );

		$name = $block['attrs']['name'];

		global $wpdb;

		$table = $wpdb->prefix . 'formello_forms';
		$wpdb->update(
			$table,
			array(
				'settings' => $form_settings,
				'name'     => $name,
			),
			array(
				'id' => $id,
			)
		);
	}

	/**
	 * Store Formello action settings in DB.
	 *
	 * @param mixed $blocks The blocks actions.
	 * @since 1.0.0
	 */
	protected function formello_get_actions( $blocks ) {

		$actions = array();

		foreach ( $blocks as $block ) {

			$actions[ $block['attrs']['name'] ] = array(
				'settings' => $block['attrs']['settings'] ? $block['attrs']['settings'] : array(),
				'type'     => $block['attrs']['type'],
			);

		}

		return $actions;
	}

	/**
	 * Returns a formatted & HTML-escaped field value. Detects file-, array- and date-types.
	 *
	 * Caveat: if value is a file, an HTML string is returned (which means email action should use "Content-Type: html" when it includes a file field).
	 *
	 * @param string|array   $value The value of input.
	 * @param int            $limit The limit.
	 * @param Closure|string $escape_function The function for escaping.
	 * @return string
	 * @since 1.0.0
	 */
	protected function formello_field_value( $value, $limit = 0, $escape_function = 'esc_html' ) {
		if ( '' === $value ) {
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

		// join array-values with comma.
		if ( is_array( $value ) ) {
			$value = join( ', ', $value );
		}

		// limit string to certain length.
		if ( $limit > 0 ) {
			$limited = strlen( $value ) > $limit;
			$value   = substr( $value, 0, $limit );

			if ( $limited ) {
				$value .= '...';
			}
		}

		// escape value.
		if ( null !== $escape_function && is_callable( $escape_function ) ) {
			$value = $escape_function( $value );
		}

		return $value;
	}

	/**
	 * Returns true if value is a "file"
	 *
	 * @param mixed $value The file value.
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
	 *
	 * @param mixed $value The date value.
	 * @return bool
	 * @since 1.0.0
	 */
	protected function formello_is_date( $value ) {

		if ( ! is_string( $value )
				|| strlen( $value ) !== 10
				|| (int) preg_match( '/\d{2,4}[-\/]\d{2}[-\/]\d{2,4}/', $value ) === 0 ) {
			return false;
		}

		$timestamp = strtotime( $value );
		return false !== $timestamp;
	}

	/**
	 * Human file size
	 *
	 * @param int $size The size of file.
	 * @param int $precision The precision.
	 * @return string
	 */
	protected function formello_human_filesize( $size, $precision = 2 ) {
		for ( $i = 0; ( $size / 1024 ) > 0.9; $i++, $size /= 1024 ) {
			// nothing, loop logic contains everything.
		}
		$steps = array( 'B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' );
		return round( $size, $precision ) . $steps[ $i ];
	}

	/**
	 * Add settings container.
	 *
	 * @param string $message The precision.
	 */
	public function error_notice( $message ) {
		$class = 'notice notice-error';
		return printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) );
	}
}
