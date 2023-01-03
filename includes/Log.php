<?php
/**
 * Block handler.
 *
 * @package Formello
 */

namespace Formello;

use \Katzgrau\KLogger\Logger;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Block Handler
 *
 * @since 1.0.0
 */
class Log {

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
	protected $logger;


	/**
	 * The logger.
	 *
	 * @var boolean $log_active.
	 */
	private $log_active = false;

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
		// get option with default.
		$settings = get_option(
			'formello',
			array(
				'log_file' => '',
				'log' => false,
			)
		);
		$this->logger = new \Katzgrau\KLogger\Logger(
			FORMELLO_UPLOAD . '/logs',
			'debug',
			array(
				'filename' => $settings['log_file'],
				'flushFrequency' => 3000,
			)
		);
		if ( $settings && $settings['log'] ) {
			$this->log_active = true;
		}
		add_action( 'wp_error_added', array( $this, 'log_wp_error' ), 10, 4 );
	}

	/**
	 * Register our dynamic blocks.
	 *
	 * @param string $level The level.
	 * @param string $message The message.
	 * @param array  $context The context.
	 *
	 * @since 1.2.0
	 */
	public function log( $level, $message, $context = array() ) {
		if ( $this->log_active ) {
			$this->logger->log( $level, $message, $context );
		}
	}

	/**
	 * Log WP errors.
	 *
	 * @param string $code The level.
	 * @param string $message The message.
	 * @param array  $data The context.
	 * @param array  $wp_error The context.
	 *
	 * @since 1.2.0
	 */
	public function log_wp_error( $code, $message, $data, $wp_error ) {
		if ( $this->log_active ) {
			$this->logger->log( 'error', $wp_error->get_error_message(), $wp_error->get_all_error_data() );
		}
	}
}
Log::get_instance();
