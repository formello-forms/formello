<?php
/**
 * Plugin Name: Formello
 * Plugin URI: https://formello.net/
 * Description: Lightweight Gutenberg contact form builder, blazingly fast with minnimal external dependencies and ReCaptcha support.
 * Version: 1.1.7
 * Author: Formello
 * Author URI: https://formello.net
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
	public $version = '1.1.7';

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

		$version = get_option( 'formello_version' );
		global $wpdb;

		update_option( 'formello_installed', time() );

		// create table for storing forms.
		$wpdb->query(
			"CREATE TABLE IF NOT EXISTS {$wpdb->prefix}formello_forms (
			`id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
			`name` VARCHAR(255),
			`settings` TEXT NOT NULL,
			`is_trashed` BOOLEAN DEFAULT false,
			`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
			) ENGINE=INNODB CHARACTER SET={$wpdb->charset};"
		);

		// create table for storing submissions.
		$wpdb->query(
			"CREATE TABLE IF NOT EXISTS {$wpdb->prefix}formello_submissions (
			`id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
        	`form_id` INT UNSIGNED NOT NULL,
			`data` TEXT NOT NULL,
			`is_new` BOOLEAN DEFAULT true,
			`user_agent` TEXT NULL,
			`ip_address` VARCHAR(255) NULL,
			`referer_url` VARCHAR(255) NULL,
			`submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
			) ENGINE=INNODB CHARACTER SET={$wpdb->charset};"
		);

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

		Formello\Block::get_instance();
		add_action( 'init', array( $this, 'init_classes' ) );
		add_action( 'rest_init', array( $this, 'init_classes' ) );

		// Localize our plugin.
		load_plugin_textdomain( 'formello', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * Instantiate the required classes
	 *
	 * @return void
	 */
	public function init_classes() {

		Formello\Frontend::get_instance();
		Formello\Assets::get_instance();
		Formello\Admin::get_instance();
		Formello\Api::get_instance();
		Formello\CPT::get_instance();

		// hook actions.
		$email_action = new Formello\Actions\Email();
		$email_action->hook();

	}

} // FORMELLO

$formello = Formello::init();
