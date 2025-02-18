<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://www.francescopepe.com
 * @since      1.0.0
 *
 * @package    Formello
 * @subpackage Formello/includes
 */

namespace Formello;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Formello
 * @subpackage Formello/includes
 * @author     Francesco Pepe <sgozzapolli@gmail.com>
 */
class Plugin {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Formello_Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version     The current version of the plugin.
	 */
	protected $version;

	/**
	 * The main plugin file.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $entry_point The entry point of the plugin.
	 */
	protected $entry_point;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 * @param string $entry_point The entry point of this plugin.
	 */
	public function __construct( $entry_point ) {
		$this->version = get_file_data( $entry_point, array( 'Version' ) )[0];
		$this->entry_point = $entry_point;
		$this->plugin_name = 'formello';
		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Formello_Loader. Orchestrates the hooks of the plugin.
	 * - Formello_i18n. Defines internationalization functionality.
	 * - Formello_Admin. Defines all hooks for the admin area.
	 * - Formello_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {
		/**
		 * The helper files.
		 */
		require_once plugin_dir_path( __DIR__ ) . 'includes/Utils/functions.php';
		require_once plugin_dir_path( __DIR__ ) . 'includes/Utils/templates.php';
		require_once plugin_dir_path( __DIR__ ) . 'includes/Utils/register-cpt.php';
		require_once plugin_dir_path( __DIR__ ) . 'includes/Utils/register-settings.php';

		$this->loader = new Loader();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Formello_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new I18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Admin( $this->plugin_name, $this->version, $this->entry_point );

		$this->loader->add_action( 'admin_menu', $plugin_admin, 'admin_menu' );
		$this->loader->add_action( 'enqueue_block_editor_assets', $plugin_admin, 'enqueue_editor_scripts' );
		$this->loader->add_action( 'admin_bar_menu', $plugin_admin, 'admin_bar_item', 1000 );

		$activator = new Activator( $this->plugin_name, $this->version, $this->entry_point );
		$this->loader->add_action( 'upgrader_process_complete', $activator, 'update_completed', 10, 2 );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {
		$blocks = new Blocks( $this->plugin_name, $this->version, $this->entry_point );

		$this->loader->add_action( 'init', $blocks, 'register_blocks' );
		$this->loader->add_action( 'init', $blocks, 'register_block_pattern_category' );
		$this->loader->add_action( 'block_categories_all', $blocks, 'register_block_category' );
		$this->loader->add_shortcode( 'formello', $blocks, 'do_reusable_block' );

		$frontend = new Frontend( $this->plugin_name, $this->version );

		$this->loader->add_action( 'wp_ajax_formello', $frontend, 'listen_for_submit' );
		$this->loader->add_action( 'wp_ajax_nopriv_formello', $frontend, 'listen_for_submit' );

		// REST handlers.
		$addons = new Rest\Addons( $this->entry_point );
		$this->loader->add_action( 'rest_api_init', $addons, 'register_routes' );
		$submissions = new Rest\Submissions( $this->entry_point );
		$this->loader->add_action( 'rest_api_init', $submissions, 'register_routes' );
		$columns = new Rest\Columns( $this->entry_point );
		$this->loader->add_action( 'rest_api_init', $columns, 'register_routes' );
		$license = new Rest\License( $this->entry_point );
		$this->loader->add_action( 'rest_api_init', $license, 'register_routes' );
		$importer = new Rest\Importer( $this->entry_point );
		$this->loader->add_action( 'rest_api_init', $importer, 'register_routes' );
		$settings = new Rest\Settings( $this->entry_point );
		$this->loader->add_action( 'rest_api_init', $settings, 'register_routes' );

		// Cron Tasks.
		$cron = new Cron( $this->plugin_name, $this->version );
		$cron->cron();

		$this->loader->add_action( 'formello_retrieve_news', $cron, 'get_news' );
		$this->loader->add_action( 'formello_delete_logs', $cron, 'delete_logs' );
		$this->loader->add_action( 'formello_delete_tmp', $cron, 'delete_tmp' );

		// Actions.
		$email = new Actions\Email();
		$email->hook();
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Formello_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}
}
