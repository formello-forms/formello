<?php
/**
 * Plugin Name: Formello
 * Plugin URI:  https://formello.net/
 * Description: Lightweight Gutenberg contact form builder, blazingly fast with no external dependencies and ReCaptcha support.
 * Version:     2.5.4
 * Author:      Formello
 * Author URI:  https://formello.net
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: formello
 * Domain Path: /languages
 *
 * @package     Formello
 */

// don't call the file directly.
defined( 'ABSPATH' ) || exit;

if ( ! defined( 'FORMELLO_PLUGIN_FILE' ) ) {
	define( 'FORMELLO_PLUGIN_FILE', __FILE__ );
	define( 'FORMELLO_PLUGIN_DIR', __DIR__ );
}

// Require once the Composer Autoload.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';
}

if ( ! class_exists( 'Formello' ) ) {
	require_once __DIR__ . '/includes/Plugin.php';
}

/**
 * The main function that returns the Plugin class
 *
 * @since 1.0.0
 * @return object|Formello
 */
function formello_load_plugin() {
	return Formello\Plugin::instance();
}

// Get the plugin running.
add_action( 'plugins_loaded', 'formello_load_plugin' );

/**
 * Activation hook
 */
function formello_activate() {
	global $wpdb;

	// create table for storing submissions.
	$wpdb->query(
		"CREATE TABLE IF NOT EXISTS {$wpdb->prefix}formello_submissions (
		`id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		`form_id` INT UNSIGNED NOT NULL,
		`data` TEXT NOT NULL,
		`is_new` BOOLEAN DEFAULT true,
		`starred` BOOLEAN DEFAULT false,
		`user_agent` TEXT NULL,
		`ip_address` VARCHAR(255) NULL,
		`referer_url` VARCHAR(255) NULL,
		`submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`log` TEXT NULL
		) ENGINE=InnoDB CHARACTER SET={$wpdb->charset};"
	);

	// create table for storing submissions meta.
	$wpdb->query(
		"CREATE TABLE IF NOT EXISTS {$wpdb->prefix}formello_submissions_meta (
		`id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		`form_id` INT UNSIGNED NOT NULL,
		`submission_id` INT UNSIGNED NOT NULL,
		`field_name` VARCHAR(255) NOT NULL,
		`field_value` TEXT NULL,
		FOREIGN KEY (submission_id) REFERENCES {$wpdb->prefix}formello_submissions(id) ON DELETE CASCADE
		) ENGINE=InnoDB CHARACTER SET={$wpdb->charset};"
	);

	$wpdb->query( "UPDATE {$wpdb->prefix}posts SET post_type = 'formello' WHERE post_type = 'formello_form';" );

	$upload_dir   = wp_upload_dir();
	$formello_dir = $upload_dir['basedir'] . '/formello';
	if ( ! is_dir( $formello_dir ) ) {
		wp_mkdir_p( $formello_dir );
	}

	global $wp_filesystem;
	// Initialize the WP filesystem, no more using 'file-put-contents' function.
	if ( empty( $wp_filesystem ) ) {
		require_once ABSPATH . '/wp-admin/includes/file.php';
		WP_Filesystem();
	}
	// Add a white index.
	$wp_filesystem->put_contents( trailingslashit( $formello_dir ) . 'index.html', '', 0644 );

	// refresh all addons.
	delete_transient( 'formello_addons' );
	delete_transient( 'formello_patterns' );

	// remove useless meta.
	delete_metadata( 'post', 0, '_formello_parent', false, true );

	update_option( 'formello_version', get_file_data( __FILE__, array( 'Version' ) )[0] );
	update_option( 'formello_installed', time() );
}

register_activation_hook( __FILE__, 'formello_activate' );

/**
 * Initialize the plugin tracker
 *
 * @return void
 */
function formello_appsero_init_tracker() {

	$client = new Appsero\Client( '2dafee7d-6e70-4948-8115-816bc5e6e979', 'Contact form builder for Gutenberg &#8211; Formello', __FILE__ );

	// Active insights.
	$client->insights()->init();
}

formello_appsero_init_tracker();
