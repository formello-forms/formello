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
		add_action( 'admin_bar_menu', array( $this, 'admin_bar_item' ), 1000 );
		add_filter( 'set-screen-option', array( $this, 'set_screen' ), 10, 3 );
		add_action( 'admin_notices', array( $this, 'admin_notice__error' ) );
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
			null,
			__( 'Settings', 'formello' ),
			__( 'Settings', 'formello' ),
			$capability,
			'formello-settings',
			array( $this, 'settings_page' )
		);
		$tools_hook = add_submenu_page(
			null,
			__( 'Tools', 'formello' ),
			__( 'Tools', 'formello' ),
			$capability,
			'formello-settings#/tools',
			array( $this, 'settings_page' )
		);
		$addons_hook = add_submenu_page(
			$slug,
			__( 'Addons', 'formello' ),
			__( 'Addons', 'formello' ),
			$capability,
			'formello-addons',
			array( $this, 'settings_page' )
		);

		global $submenu;
		$formello_settings = 'formello-settings';
		if ( current_user_can( $capability ) ) {
			// phpcs:ignore
			$submenu[ $slug ][] = array(
				'Settings',
				$capability,
				'edit.php?post_type=formello_form&page=' . $formello_settings . '#/',
			);
			// phpcs:ignore
			$submenu[ $slug ][] = array(
				__( 'Tools', 'formello' ),
				$capability,
				'edit.php?post_type=formello_form&page=' . $formello_settings . '#/tools',
			);
		}

		add_action( "load-$form_hook", array( $this, 'forms_screen_option' ) );
		add_action( "load-$submissions_hook", array( $this, 'submissions_screen_option' ) );
		add_action( "load-$settings_hook", array( $this, 'settings_hooks' ) );
		add_action( "load-$tools_hook", array( $this, 'settings_hooks' ) );
		add_action( "load-$addons_hook", array( $this, 'addons_hooks' ) );
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
			'label'   => __( 'Number of forms per page', 'formello' ),
			'default' => 10,
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
			'default' => 20,
			'option'  => 'submissions_per_page',
		);

		add_screen_option( $option, $args );

		do_action( 'formello_submissions_table_scripts' );

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
			'label'   => __( 'Number of forms per page', 'formello' ),
			'default' => 10,
			'option'  => 'forms_per_page',
		);

		add_screen_option( $option, $args );
		return $value;
	}

	/**
	 * Output our Settings HTML.
	 *
	 * @since 0.1
	 */
	public function settings_page() {
		?>
			<div id="formello-plugin-settings"></div>
		<?php
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
	public function addons_hooks() {
		wp_enqueue_script( 'formello-addons' );
		wp_enqueue_style( 'formello-settings' );
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
	 * Add settings container.
	 */
	public function submission_page_detail() {
		// Enqueue styling for admin tables.
		wp_enqueue_style( 'formello-settings' );
		wp_enqueue_script( 'formello-submission' );
		?>
			<div id="formello-submission"></div>
		<?php
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

		if ( empty( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'formello' ) ) {
			//$this->invalid_nonce_redirect();
		}

		if ( isset( $_GET['form_id'] ) ) {
			$id = absint( $_GET['form_id'] );
		}
		if ( empty( $id ) ) {
			$message = __( 'No form.', 'formello' );
			$this->notice( $message );
		}
		$form = get_post( $id );

		if ( empty( $form ) || 'formello_form' !== $form->post_type ) {
			$message = __( 'No submissions found for this form.', 'formello' );
			$this->notice( $message );
		}
		if ( $form ) {
			$title = $form->post_title;
		}
		if ( empty( $title ) ) {
			$title = __( '(No title)', 'formello' );
		}
		require dirname( __FILE__ ) . '/views/submissions.php';
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
				'title' => __( 'Entries', 'formello' ) . $badge,
				'href'  => admin_url( 'edit.php?post_type=formello_form&page=formello' ),
			)
		);

		$admin_bar->add_menu(
			array(
				'id' => 'formello-docs',
				'parent' => 'formello-menu',
				'title' => 'Docs',
				'href' => 'https://formello.net/en/documentation/',
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
	 * Add notice.
	 *
	 * @param string $message The message.
	 * @param string $type The message type.
	 */
	public function notice( $message, $type = 'error' ) {
		$this->notice = printf(
			'<div class="notice notice-%s">
				<p>%s</p>
			</div>',
			esc_attr( $type ),
			esc_html( $message ),
		);
	}

	/**
	 * Show admin notice.
	 */
	public function admin_notice__error() {
		return $this->notice;
	}

	/**
	 * Die when the nonce check fails.
	 *
	 * @since    1.0.0
	 *
	 * @return void
	 */
	public function invalid_nonce_redirect() {
		wp_die(
			__( 'Invalid Nonce', 'formello' ),
			__( 'Error', 'formello' ),
			array(
				'response' 	=> 403,
				'back_link' => true,
			)
		);
	}

}
Admin::get_instance();
