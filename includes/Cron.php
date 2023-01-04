<?php
/**
 * Block handler.
 *
 * @package Formello
 */

namespace Formello;

use \Katzgrau\KLogger\Logger;
use function Formello\Utils\formello_dir;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Block Handler
 *
 * @since 1.0.0
 */
class Cron {

	/**
	 * Class instance.
	 *
	 * @access private
	 * @var $instance Class instance.
	 */
	private static $instance;

	/**
	 * Class instance.
	 *
	 * @access private
	 * @var $instance Class instance.
	 */
	private $logger;

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
		add_action( 'formello_retrieve_news', array( $this, 'get_news' ) );
		add_action( 'formello_delete_logs', array( $this, 'delete_logs' ) );
		$this->cron();
	}

	/**
	 * Schedule every 5 min.
	 *
	 * @since 1.2.0
	 */
	private function cron() {
		if ( ! wp_next_scheduled( 'formello_retrieve_news' ) ) {
			wp_schedule_event( time(), '5min', 'formello_retrieve_news' );
		}
		if ( ! wp_next_scheduled( 'formello_delete_logs' ) ) {
			wp_schedule_event( time(), 'daily', 'formello_delete_logs' );
		}
		if ( ! wp_next_scheduled( 'formello_delete_tmp' ) ) {
			wp_schedule_event( time(), '5min', 'formello_delete_tmp' );
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

		$sql = "SELECT count(*) as total FROM {$table_submissions} s WHERE s.is_new = 1 AND EXISTS( SELECT * FROM {$table_posts} f WHERE f.id = s.form_id AND f.post_type = 'formello_form' );";
		// phpcs:ignore
		$result = $wpdb->get_row( $sql );

		set_transient( 'formello_news', $result->total, DAY_IN_SECONDS );

	}

	/**
	 * Register our dynamic blocks.
	 *
	 * @since 1.2.0
	 */
	public static function delete_orphaned_entries() {

	}

	/**
	 * Delete all logs and tmp folder.
	 *
	 * @since 1.2.0
	 */
	public static function delete_logs() {
		$log_folder = formello_dir() . '/logs';
		array_map( 'unlink', array_filter( (array) glob( $log_folder . '/*' ) ) );
	}

	/**
	 * Delete all logs and tmp folder.
	 *
	 * @since 1.2.0
	 */
	public static function delete_tmp() {
		$tmp_folder = formello_dir() . '/tmp';
		array_map( 'unlink', array_filter( (array) glob( $tmp_folder . '/*' ) ) );
	}

}
Cron::get_instance();
