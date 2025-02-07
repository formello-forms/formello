<?php
/**
 * Block handler.
 *
 * @link       https://www.francescopepe.com
 * @since      1.0.0
 *
 * @package    Formello
 * @subpackage Formello/includes
 */

namespace Formello;

use function Formello\Utils\formello_dir;

/**
 * Block Handler
 *
 * @since 1.0.0
 */
class Cron {
	/**
	 * The ID of this plugin.
	 *
	 * @since    2.6.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    2.6.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 2.6.0
	 * @param string $plugin_name The name of this plugin.
	 * @param string $version     The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Schedule every 5 min.
	 *
	 * @since 1.2.0
	 */
	public function cron() {
		if ( ! wp_next_scheduled( 'formello_retrieve_news' ) ) {
			wp_schedule_event( time(), '5min', 'formello_retrieve_news' );
		}
		if ( ! wp_next_scheduled( 'formello_delete_logs' ) ) {
			wp_schedule_event( time(), 'daily', 'formello_delete_logs' );
		}
		if ( ! wp_next_scheduled( 'formello_delete_tmp' ) ) {
			wp_schedule_event( time(), 'daily', 'formello_delete_tmp' );
		}
	}

	/**
	 * Retrieve newly submitted entries.
	 *
	 * @since 1.2.0
	 */
	public function get_news() {
		global $wpdb;
		$table_submissions  = "{$wpdb->prefix}formello_submissions";
		$table_posts  = "{$wpdb->prefix}posts";

		$result = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT count(*) as total FROM %i s 
				WHERE s.is_new = 1 AND 
				EXISTS( SELECT * FROM %i f 
					WHERE f.id = s.form_id 
					AND f.post_type = %s 
					AND ( f.post_status = %s OR f.post_status = %s )  
				);',
				array(
					'table_submissions' => $table_submissions,
					'table_posts' => $table_posts,
					'post_type' => 'formello_form',
					'post_status' => 'publish',
					'post_status_private' => 'formello-private',
				)
			)
		);

		set_transient( 'formello_news', $result->total, DAY_IN_SECONDS );
	}

	/**
	 * Delete all logs.
	 *
	 * @since 1.2.0
	 */
	public function delete_logs() {
		$log_folder = formello_dir() . '/logs';
		array_map( 'unlink', array_filter( (array) glob( $log_folder . '/*' ) ) );
	}

	/**
	 * Delete tmp folder.
	 *
	 * @since 1.2.0
	 */
	public function delete_tmp() {
		$tmp_folder = formello_dir() . '/tmp';
		array_map( 'unlink', array_filter( (array) glob( $tmp_folder . '/*' ) ) );
	}
}
