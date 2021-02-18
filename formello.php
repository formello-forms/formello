<?php
/**
 * Plugin Name: Formello
 * Plugin URI: https://example.com/
 * Description: Lightweight Gutenberg contact form builder, blazingly fast with minnimal external dependencies and ReCaptcha support.
 * Version: 1.0.0
 * Author: Tropicalista
 * Author URI: https://www.francescopepe.com/
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: formello
 * Domain Path: /languages
 *
 * @package Formello
 */

// don't call the file directly.
defined( 'ABSPATH' ) || exit;

/**
 * Formello class
 *
 * @class FORMELLO The class that holds the entire Formello plugin
 */
final class Formello {

	/**
	 * Plugin version
	 *
	 * @var string
	 */
	public $version = '1.0.0';

	/**
	 * Holds various class instances
	 *
	 * @var array
	 */
	private $container = array();

	/**
	 * Constructor for the Formello class
	 *
	 * Sets up all the appropriate hooks and actions
	 * within our plugin.
	 */
	public function __construct() {

		$this->define_constants();

		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );

		add_action( 'plugins_loaded', array( $this, 'init_plugin' ) );
	}

	/**
	 * Initializes the Formello() class
	 *
	 * Checks for an existing Formello() instance
	 * and if it doesn't find one, creates it.
	 */
	public static function init() {
		static $instance = false;

		if ( ! $instance ) {
			$instance = new Formello();
		}

		return $instance;
	}

	/**
	 * Define the constants
	 *
	 * @return void
	 */
	public function define_constants() {
		define( 'FORMELLO_VERSION', $this->version );
		define( 'FORMELLO_FILE', __FILE__ );
		define( 'FORMELLO_PATH', dirname( FORMELLO_FILE ) );
		define( 'FORMELLO_INCLUDES', FORMELLO_PATH . '/includes' );
		define( 'FORMELLO_URL', plugins_url( '', FORMELLO_FILE ) );
		define( 'FORMELLO_ASSETS', FORMELLO_URL . '/build' );
	}

	/**
	 * Load the plugin after all plugis are loaded
	 *
	 * @return void
	 */
	public function init_plugin() {
		$this->includes();
		$this->init_hooks();
	}

	/**
	 * Placeholder for activation function
	 *
	 * Nothing being called here yet.
	 */
	public function activate() {

		$installed = get_option( 'formello_installed' );

		if ( ! $installed ) {
			update_option( 'formello_installed', time() );

			global $wpdb;

			// create table for storing submissions.
			$wpdb->query(
				"CREATE TABLE IF NOT EXISTS {$wpdb->prefix}formello_submissions (
				`id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
				`form_id` VARCHAR(255) NOT NULL,
				`data` TEXT NOT NULL,
				`user_agent` TEXT NULL,
				`ip_address` VARCHAR(255) NULL,
				`referer_url` VARCHAR(255) NULL,
				`submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
				) ENGINE=INNODB CHARACTER SET={$wpdb->charset};"
			);

			// create table for storing forms.
			$wpdb->query(
				"CREATE TABLE IF NOT EXISTS {$wpdb->prefix}formello_forms (
				`id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
				`name` VARCHAR(255),
				`settings` TEXT NOT NULL,
				`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
				) ENGINE=INNODB CHARACTER SET={$wpdb->charset};"
			);

		}

		update_option( 'formello_version', FORMELLO_VERSION );
	}

	/**
	 * Placeholder for deactivation function
	 *
	 * Nothing being called here yet.
	 */
	public function deactivate() {

	}

	/**
	 * Include the required files
	 *
	 * @return void
	 */
	public function includes() {

		// Require once the Composer Autoload.
		if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
			require_once dirname( __FILE__ ) . '/vendor/autoload.php';
		}

	}

	/**
	 * Initialize the hooks
	 *
	 * @return void
	 */
	public function init_hooks() {

		$this->container['frontend'] = new Formello\Block();
		add_action( 'init', array( $this, 'init_classes' ) );
		add_action( 'rest_init', array( $this, 'init_classes' ) );

		// Localize our plugin.
		add_action( 'init', array( $this, 'localization_setup' ) );
	}

	/**
	 * Instantiate the required classes
	 *
	 * @return void
	 */
	public function init_classes() {

		if ( $this->is_request( 'frontend' ) ) {
			$this->container['frontend'] = new Formello\Frontend();
		}

		if ( $this->is_request( 'admin' ) ) {
			$this->container['admin'] = new Formello\Admin();
		}

		$this->container['api']    = new Formello\Api();
		$this->container['assets'] = new Formello\Assets();

		// hook actions.

		$email_action = new Formello\Actions\Email();
		$email_action->hook();

		$mailchimp_action = new Formello\Actions\MailChimp();
		$mailchimp_action->hook();

	}

	/**
	 * Initialize plugin for localization
	 *
	 * @uses load_plugin_textdomain()
	 */
	public function localization_setup() {
		load_plugin_textdomain( 'formello', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * What type of request is this?
	 *
	 * @param  string $type admin, ajax, cron or frontend.
	 *
	 * @return bool
	 */
	private function is_request( $type ) {
		switch ( $type ) {
			case 'admin':
				return is_admin() && ! defined( 'DOING_AJAX' );

			case 'ajax':
				return defined( 'DOING_AJAX' );

			case 'rest':
				return defined( 'REST_REQUEST' );

			case 'cron':
				return defined( 'DOING_CRON' );

			case 'frontend':
				return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' );
		}
	}

} // FORMELLO

$formello = Formello::init();
