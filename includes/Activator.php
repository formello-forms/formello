<?php
/**
 * Fired during plugin activation
 *
 * @link       https://www.francescopepe.com
 * @since      1.0.0
 *
 * @package    Formello
 * @subpackage Formello/includes
 */

namespace Formello;

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Formello2
 * @subpackage Formello2/includes
 * @author     Francesco Pepe <sgozzapolli@gmail.com>
 */
class Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		global $wpdb;

		// create table for storing submissions.
		$wpdb->query(
			"CREATE TABLE IF NOT EXISTS {$wpdb->prefix}formello_submissions (
			`id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
			`form_id` INT UNSIGNED NOT NULL,
			`data` JSON NOT NULL,
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
}
