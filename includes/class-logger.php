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
	private $logger;


	/**
	 * The logger.
	 *
	 * @var boolean $log_active.
	 */
	protected $log_active = false;

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
		$this->logger = new Katzgrau\KLogger\Logger( __DIR__ . '/logs' );
		$settings = get_option( 'formello' );
		if ( $settings && $settings['log'] ) {
			$this->log_active = true;
		}
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

}
Log::get_instance();
