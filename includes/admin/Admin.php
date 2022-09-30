<?php
/**
 * Set our block attribute defaults.
 *
 * @package Formello
 */

namespace Formello\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Admin Pages Handler
 *
 * @since 1.0.0
 */
class Admin {

	/**
	 * Form table.
	 *
	 * @var WP_List_Table The form table
	 */
	protected $forms_table;

	/**
	 * Form table.
	 *
	 * @var WP_List_Table The submission table
	 */
	protected $submissions_table;

	/**
	 * The notice.
	 *
	 * @var mixed
	 */
	protected $notice;

	/**
	 * The submission.
	 *
	 * @var stdClass The submission
	 */
	protected $submission;

	/**
	 * The base link to formello.
	 *
	 * @var mixed The submission table
	 */
	protected $baselink;

	/**
	 * The back button.
	 *
	 * @var string
	 */
	protected $back_button;

	/**
	 * Class instance.
	 *
	 * @access private
	 * @var $instance Class instance.
	 */
	private static $instance;

	/**
	 * Initiator
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'admin_bar_menu', array( $this, 'admin_bar_item' ), 500 );
		add_action( 'formello_settings_area', array( $this, 'add_settings_container' ) );
		add_action( 'formello_tools_area', array( $this, 'add_tools_container' ) );
		add_filter( 'set-screen-option', array( $this, 'set_screen' ), 10, 3 );
		$this->baselink = add_query_arg( array( 'post_type' => 'formello_form' ), admin_url( 'edit.php' ) );

	}

	/**
	 * Hooks
	 */
	public function hooks() {
	}

	/**
	 * Register our menu page
	 *
	 * @return void
	 */
	public function admin_menu() {
		global $submenu;

		$capability = 'manage_options';
		$slug       = 'edit.php?post_type=formello_form';

		$form_hook = add_submenu_page(
			$slug,
			__( 'Entries', 'formello' ),
			__( 'Entries', 'formello' ),
			$capability,
			'formello',
			array( $this, 'forms_page' )
		);
		$submissions_hook = add_submenu_page(
			$slug,
			__( 'Entries', 'formello' ),
			__( 'Entries', 'formello' ),
			$capability,
			'formello-submissions',
			array( $this, 'submissions_page' )
		);
		$submission_hook = add_submenu_page(
			$slug,
			__( 'Entry', 'formello' ),
			__( 'Entry', 'formello' ),
			$capability,
			'formello-submission',
			array( $this, 'submission_page_detail' )
		);
		$settings_hook = add_submenu_page(
			$slug,
			__( 'Settings', 'formello' ),
			__( 'Settings', 'formello' ),
			$capability,
			'formello-settings',
			array( $this, 'settings_page' )
		);
		$tools_hook = add_submenu_page(
			$slug,
			__( 'Tools', 'formello' ),
			__( 'Tools', 'formello' ),
			$capability,
			'formello-tools',
			array( $this, 'tools_page' )
		);
		$addons_hook = add_submenu_page(
			$slug,
			__( 'Addons', 'formello' ),
			__( 'Addons', 'formello' ),
			$capability,
			'formello-addons',
			array( $this, 'addons_page' )
		);

		add_action( "load-$form_hook", array( $this, 'forms_screen_option' ) );
		add_action( "load-$submissions_hook", array( $this, 'submissions_screen_option' ) );
		add_action( "load-$settings_hook", array( $this, 'settings_hooks' ) );
		add_action( "load-$tools_hook", array( $this, 'tools_hooks' ) );
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

		$hidden_submenus = apply_filters( 'formello_hidden_submenus', $hidden_submenus );

		// Select another submenu item to highlight (optional).
		if ( $plugin_page && isset( $hidden_submenus[ $plugin_page ] ) ) {
			$submenu_file = 'formello';
		}

		// Hide the submenu.
		foreach ( $hidden_submenus as $submenu => $unused ) {
			remove_submenu_page( 'edit.php?post_type=formello_form', $submenu );
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

		do_action( 'formello_submissions_table_script' );

		$this->submissions_table = new Tables\Submissions();
	}

	/**
	 * Set screen options
	 *
	 * @param string $status Option.
	 * @param string $option Option.
	 * @param string $value  Option.
	 */
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
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_settings_scripts' ) );
	}

	/**
	 * Initialize our hooks for the admin page
	 *
	 * @return void
	 */
	public function tools_hooks() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_tools_scripts' ) );
	}

	/**
	 * Load scripts and styles for the app
	 *
	 * @return void
	 */
	public function enqueue_settings_scripts() {
		wp_enqueue_script( 'formello-settings' );
		wp_enqueue_style( 'formello-settings' );

		// add settings script from addon.
		do_action( 'formello_settings_scripts' );
	}

	/**
	 * Load scripts and styles for the app
	 *
	 * @return void
	 */
	public function enqueue_tools_scripts() {
		wp_enqueue_script( 'formello-tools' );
		wp_enqueue_style( 'formello-settings' );

		// add settings script from addon.
		do_action( 'formello_tools_scripts' );
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
		// Enqueue styling for admin tables.
		wp_enqueue_style( 'formello-settings' );

		if ( empty( absint( $_GET['submission_id'] ) ) ) {
			$message = __( 'No submission ID provided.', 'formello' );
			$this->error_notice( $message );
		}

		$id = sanitize_text_field( absint( $_GET['submission_id'] ) );

		$data = new \Formello\Submission( $id );
		$this->submission = $data->get();

		if ( empty( $this->submission ) ) {
			$message = __( 'No submission found.', 'formello' );
			$this->error_notice( $message );
		}
		$this->back_button = add_query_arg(
			array(
				'page' => 'formello-submissions',
				'form_id' => isset( $this->submission->form_id ) ? $this->submission->form_id : '',
			),
			$this->baselink
		);
		require dirname( __FILE__ ) . '/views/submission.php';
	}

	/**
	 * Output forms table.
	 */
	public function forms_page() {
		// Enqueue styling for admin tables.
		wp_enqueue_style( 'formello-settings' );
		require dirname( __FILE__ ) . '/views/forms.php';
	}

	/**
	 * Output our Dashboard HTML.
	 */
	public function submissions_page() {
		// Enqueue styling for admin tables.
		wp_enqueue_style( 'formello-settings' );
		$this->back_button = add_query_arg( array( 'page' => 'formello' ), $this->baselink );

		if ( isset( $_GET['form_id'] ) ) {
			$id = absint( $_GET['form_id'] );
		}
		if ( empty( $id ) ) {
			$message = __( 'No form.', 'formello' );
			$this->error_notice( $message );
			require dirname( __FILE__ ) . '/views/submissions.php';
			return;
		}
		$form = get_post( $id );
		if ( $form ) {
			$title = $form->post_title;
		}
		if ( empty( $title ) ) {
			$title = __( '(No title)', 'formello' );
		}
		if ( empty( $form ) ) {
			$message = __( 'No submissions found for this form.', 'formello' );
			$this->error_notice( $message );
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
	 * Output tools page.
	 *
	 * @since 0.1
	 */
	public function tools_page() {
		?>
			<div class="formello-dashboard-wrap">
				<div class="formello-tools-area">
					<div id="formello-block-tools"></div>
				</div>
			</div>
		<?php
	}

	/**
	 * Output our Dashboard HTML.
	 *
	 * @since 0.1
	 */
	public function addons_page() {
		wp_enqueue_style( 'formello-settings' );
		require dirname( __FILE__ ) . '/views/addons.php';
	}

	/**
	 * Store Formello action settings in DB.
	 *
	 * @param \WP_Admin_Bar $admin_bar The admin bar.
	 * @since 1.0.0
	 */
	public function admin_bar_item( \WP_Admin_Bar $admin_bar ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$badge = '';
		$result = get_transient( 'formello_news', false );

		if ( $result ) {
			$badge = sprintf(
				'<span style="background-color: #337ab7; padding: 0 5px; margin-left: 10px; color: white; border-radius: 20%%;">%s</span>',
				$result
			);
		}

		$admin_bar->add_menu(
			array(
				'id'    => 'formello-menu',
				'parent' => null,
				'group'  => null,
				'title' => 'Formello ' . $badge,
				'href'  => admin_url( 'edit.php?post_type=formello_form&page=formello' ),
			)
		);

		$admin_bar->add_menu(
			array(
				'id'    => 'formello-submissions',
				'parent' => 'formello-menu',
				'title' => __( 'Submissions', 'formello' ),
				'href'  => admin_url( 'edit.php?post_type=formello_form&page=formello' ),
			)
		);

		$admin_bar->add_menu(
			array(
				'id' => 'formello-docs',
				'parent' => 'formello-menu',
				'title' => 'Docs',
				'href' => 'https://docs.formello.net',
				'meta' => array( 'target' => '_blank' ),
			)
		);

		$admin_bar->add_menu(
			array(
				'id' => 'formello-support',
				'parent' => 'formello-menu',
				'title' => 'Support',
				'href' => 'https://wordpress.org/support/plugin/formello/',
				'meta' => array( 'target' => '_blank' ),
			)
		);
	}

	/**
	 * Add settings container.
	 *
	 * @param array $text The button text.
	 */
	public function create_link( $text = 'Go back' ) {
		$link = add_query_arg(
			array(
				'page' => 'formello',
			),
			$this->baselink
		);
		$output = printf(
			'<a href="%s" class="page-title-action">&lsaquo; %s</a>',
			esc_attr( $link ),
			esc_html( $text )
		);
		return $output;
	}

	/**
	 * Add settings container.
	 *
	 * @param string $message The precision.
	 */
	public function error_notice( $message ) {
		$class = 'notice notice-error is-dismissible';
		$this->notice = printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) );
	}

}
Admin::get_instance();
