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
		$slug       = 'formello';

		$admin_hook = add_menu_page(
			__( 'Forms' ),
			__( 'Forms' ),
			$capability,
			$slug,
			array( $this, 'settings_page' ),
			'dashicons-feedback',
			26
		);
		add_submenu_page(
			'formello',
			__( 'Settings' ),
			__( 'Settings' ),
			$capability,
			$slug . '-settings',
			array( $this, 'settings_page' )
		);
		add_submenu_page(
			'formello',
			__( 'Tools' ),
			__( 'Tools' ),
			$capability,
			$slug . '-tools',
			array( $this, 'settings_page' )
		);
		add_submenu_page(
			'formello',
			__( 'Addons', 'formello' ),
			__( 'Addons', 'formello' ),
			$capability,
			$slug . '-addons',
			array( $this, 'settings_page' )
		);
	}

	/**
	 * Output our Settings HTML.
	 *
	 * @since 0.1
	 */
	public function settings_page() {
		wp_enqueue_style( 'formello-admin' );
		wp_enqueue_script( 'formello-admin' );

		do_action( 'formello_settings_scripts' );
		?>
			<div id="formello-admin"></div>
		<?php
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
				'href'  => admin_url( 'admin.php?page=formello' ),
			)
		);

		$admin_bar->add_menu(
			array(
				'id'    => 'formello-submissions',
				'parent' => 'formello-menu',
				'title' => __( 'Entries', 'formello' ) . $badge,
				'href'  => admin_url( 'admin.php?page=formello' ),
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
}
Admin::get_instance();
