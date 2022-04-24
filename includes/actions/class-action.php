<?php
/**
 * Set our block attribute defaults.
 *
 * @package Formello
 */

namespace Formello\Actions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Formello\Log;

/**
 * Action Handler
 *
 * @since 1.0.0
 */
abstract class Action {

	/**
	 * The action label.
	 *
	 * @var string $type Type of action.
	 */
	protected $type = '';

	/**
	 * The action label.
	 *
	 * @var string $label Action label.
	 */
	protected $label = '';

	/**
	 * The action label.
	 *
	 * @var array $settings Array of settings.
	 */
	protected $settings = array();

	/**
	 * The logger.
	 *
	 * @var boolean $log_active.
	 */
	protected $log_active = false;

	/**
	 * The logger.
	 *
	 * @var Formello\Log $logger.
	 */
	protected $logger;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->logger = new Log();
		$settings = get_option( 'formello' );
		if ( $settings['log'] ) {
			$this->log_active = true;
		}

	}

	/**
	 * Hooks
	 */
	public function hook() {
		add_filter( 'formello_available_form_actions', array( $this, 'register' ) );
		add_action( 'formello_process_form_action_' . $this->type, array( $this, 'process' ), 10, 3 );
	}

	/**
	 * Process action.
	 *
	 * @param array $action_settings Te action settings.
	 */
	abstract public function process( $action_settings );

	/**
	 * Register the actions.
	 *
	 * @param array $actions Array of actions.
	 * @return array
	 */
	public function register( array $actions ) {
		$actions[ $this->type ] = array(
			'label'    => $this->label,
			'type'     => $this->type,
			'settings' => $this->settings,
		);
		return $actions;
	}

	/**
	 * Register the actions.
	 *
	 * @param string $level Level of log.
	 * @param string $message Message of log.
	 * @param array  $context Message of log.
	 */
	public function log( $level, $message, $context = array() ) {
		if ( $this->log_active ) {
			$this->logger->log( $level, $message, $context );
		}
	}

}
