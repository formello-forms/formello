<?php
/**
 * Plugin Name: Formello
 * Plugin URI: https://formello.net/
 * Description: Lightweight Gutenberg contact form builder, blazingly fast with minnimal external dependencies and ReCaptcha support.
 * Version: 1.5.5
 * Author: Formello
 * Author URI: https://formello.net
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: formello
 * Domain Path: /languages
 *
 * @package Formello
 */

if ( ! defined( 'FORMELLO_PLUGIN_FILE' ) ) {
	define( 'FORMELLO_PLUGIN_FILE', __FILE__ );
}

if ( ! class_exists( 'Formello' ) ) {
	include_once dirname( FORMELLO_PLUGIN_FILE ) . '/includes/class-formello.php';
}

/**
 * The main function that returns the Block Visibility class
 *
 * @since 1.0.0
 * @return object|Formello
 */
function formello_load_plugin() {
	return Formello::instance();
}

// Get the plugin running.
add_action( 'plugins_loaded', 'formello_load_plugin' );

/**
 * Activation hook
 */
function formello_activate() {

	global $wpdb;

	delete_option( 'formello' );

	// create table for storing form settings.
	$wpdb->query(
		"CREATE TABLE IF NOT EXISTS {$wpdb->prefix}formello_forms (
		`post_id` BIGINT(20) UNSIGNED PRIMARY KEY,
		`name` VARCHAR(255),
		`settings` TEXT NOT NULL,
		`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (post_id) REFERENCES {$wpdb->prefix}posts(ID) ON DELETE CASCADE
		) ENGINE=INNODB CHARACTER SET={$wpdb->charset};"
	);

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
		) ENGINE=INNODB CHARACTER SET={$wpdb->charset};"
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
		) ENGINE=INNODB CHARACTER SET={$wpdb->charset};"
	);

	$upload_dir = wp_upload_dir();
	$formello_dir = $upload_dir['basedir'] . '/formello';
	if ( ! is_dir( $formello_dir ) ) {
		wp_mkdir_p( $formello_dir );
	}
	file_put_contents( trailingslashit( $formello_dir ) . 'index.html', '' );
}

register_activation_hook( __FILE__, 'formello_activate' );
