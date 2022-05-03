<?php
/**
 * Block handler.
 *
 * @package Formello
 */

namespace Formello;

use Formello\Katzgrau\KLogger\Logger;

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
		$this->cron();
	}

	/**
	 * Register our dynamic blocks.
	 *
	 * @since 1.2.0
	 */
	private function cron() {
		if ( ! wp_next_scheduled( 'formello_retrieve_news' ) ) {
			wp_schedule_event( time(), '5min', 'formello_retrieve_news' );
		}
	}

	/**
	 * Register our dynamic blocks.
	 *
	 * @since 1.2.0
	 */
	public function get_news() {

		global $wpdb;
		$table_submissions  = "{$wpdb->prefix}formello_submissions";
		$table_posts  = "{$wpdb->prefix}posts";

		$sql = "SELECT count(*) as total FROM {$table_submissions} s WHERE s.is_new = 1 AND EXISTS( SELECT * FROM {$table_posts} f WHERE f.id = s.form_id );";
		// phpcs:ignore
		$result = $wpdb->get_row( $sql );

		if ( $result->total ) {
			set_transient( 'formello_news', $result->total, DAY_IN_SECONDS );
		}

	}

	/**
	 * Register our dynamic blocks.
	 *
	 * @since 1.2.0
	 */
	public static function delete_orphaned_entries() {

	}

}
Cron::get_instance();
