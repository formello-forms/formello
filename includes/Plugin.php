<?php
/**
 * Setup Formello
 *
 * @package formello
 * @since   1.0.0
 */

namespace Formello;

defined( 'ABSPATH' ) || exit;

/**
 * Main Block Visibility Class.
 *
 * @since 1.0.0
 */
final class Plugin {

	/**
	 * Return singleton instance of the Block Visibility plugin.
	 *
	 * @since 1.0.0
	 * @return Formello
	 */
	public static function instance() {
		static $instance = false;

		if ( ! $instance ) {
			$instance = new self();
		}
		return $instance;
	}

	/**
	 * Initialise the plugin.
	 */
	private function __construct() {
		$this->define_constants();
		$this->includes();
		$this->actions();
		$this->updater();
	}

	/**
	 * Load required actions.
	 *
	 * @since 1.0.0
	 */
	public function actions() {
		$email_action = new \Formello\Actions\Email();
		$email_action->hook();
		add_action( 'init', array( $this, 'load_textdomain' ) );
	}

	/**
	 * Include required files.
	 *
	 * @since 1.0.0
	 */
	public function includes() {

		// Needs to be included at all times due to show_in_rest.
		require_once FORMELLO_ABSPATH . 'includes/Utils/Encryption.php';
		require_once FORMELLO_ABSPATH . 'includes/Utils/functions.php';
		require_once FORMELLO_ABSPATH . 'includes/Utils/templates.php';
		require_once FORMELLO_ABSPATH . 'includes/register-settings.php';
		require_once FORMELLO_ABSPATH . 'includes/register-cpt.php';
		require_once FORMELLO_ABSPATH . 'includes/Rest/register-routes.php';
		require_once FORMELLO_ABSPATH . 'includes/Rest/Controllers/Forms.php';
		require_once FORMELLO_ABSPATH . 'includes/Assets.php';
		require_once FORMELLO_ABSPATH . 'includes/Blocks.php';
		require_once FORMELLO_ABSPATH . 'includes/Frontend.php';
		require_once FORMELLO_ABSPATH . 'includes/Form.php';
		require_once FORMELLO_ABSPATH . 'includes/Updater.php';
		require_once FORMELLO_ABSPATH . 'includes/Actions/Action.php';
		require_once FORMELLO_ABSPATH . 'includes/Actions/Email.php';
		require_once FORMELLO_ABSPATH . 'includes/TagReplacers/Replacer.php';
		require_once FORMELLO_ABSPATH . 'includes/Log.php';
		require_once FORMELLO_ABSPATH . 'includes/Cron.php';
		require_once FORMELLO_ABSPATH . 'includes/Admin/Admin.php';
		//require_once FORMELLO_ABSPATH . 'includes/Form/Controller.php';
		//require_once FORMELLO_ABSPATH . 'includes/Form/Request.php';
		//require_once FORMELLO_ABSPATH . 'includes/Form/Response.php';

		do_action( 'formello_loaded' );
	}

	/**
	 * Define the contants for the Block Visibility plugin.
	 *
	 * @since 1.4.0
	 */
	private function define_constants() {
		$this->define( 'FORMELLO_ABSPATH', dirname( FORMELLO_PLUGIN_FILE ) . '/' );
        $this->define( 'FORMELLO_VERSION', get_file_data( FORMELLO_PLUGIN_FILE, [ 'Version' ] )[0]); // phpcs:ignore
		$this->define( 'FORMELLO_PLUGIN_URL', plugin_dir_url( FORMELLO_PLUGIN_FILE ) );
		$this->define( 'FORMELLO_ASSETS', FORMELLO_PLUGIN_URL . 'build' );
		$this->define( 'FORMELLO_PLUGIN_BASENAME', plugin_basename( FORMELLO_PLUGIN_FILE ) );
		$this->define( 'FORMELLO_SUPPORT_URL', 'https://wordpress.org/support/plugin/formello/' );
		$this->define( 'FORMELLO_SETTINGS_URL', admin_url( 'options-general.php?page=formello-settings' ) );
		// this is the URL our updater / license checker pings. This should be the URL of the site with EDD installed.
		$this->define( 'FORMELLO_STORE_URL', 'https://formello.net' );
	}

	/**
	 * Define constant if not already set.
	 *
	 * @since 1.4.0
	 *
	 * @param string      $name  Constant name.
	 * @param string|bool $value Constant value.
	 */
	private function define( $name, $value ) {
		if ( ! defined( $name ) ) {
            // phpcs:ignore
            define( $name, $value );
		}
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @since 1.0.0
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'formello',
			false,
			dirname( FORMELLO_PLUGIN_BASENAME ) . '/languages/'
		);
	}

	/**
	 * Load plugin updater.
	 *
	 * @since 1.0.0
	 */
	private function updater() {
		if ( ! is_admin() ) {
			return;
		}

		$settings = get_option( 'formello' );

		if ( ! $settings ) {
			return;
		};

		$key = $settings['license'];

		// Fire a hook for Addons to register their updater since we know the key is present.
		do_action( 'formello_updater', $key );
	}

	/**
	 * Cloning instances of the class is forbidden.
	 *
	 * @since 1.0.0
	 */
	public function __clone() {
		_doing_it_wrong(
			__FUNCTION__,
			esc_html__( 'Cloning instances of the class is forbidden.', 'formello' ),
			'1.0'
		);
	}

	/**
	 * Unserializing instances of the class is forbidden.
	 *
	 * @since 1.0.0
	 */
	public function __wakeup() {
		_doing_it_wrong(
			__FUNCTION__,
			esc_html__( 'Unserializing instances of the class is forbidden.', 'formello' ),
			'1.0'
		);
	}
}
