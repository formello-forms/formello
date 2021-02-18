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

use Formello\Form;
use Formello\Data;

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
	 * Hooks
	 */
	public function hook() {
		add_filter( 'formello_available_form_actions', array( $this, 'register' ) );
		add_action( 'formello_process_form_action_' . $this->type, array( $this, 'process' ), 10, 3 );
	}

	/**
	 * Process action.
	 *
	 * @param array $settings Array of settings.
	 * @param Data  $submission Data object.
	 * @param Form  $form The form.
	 */
	abstract public function process( array $settings, Data $submission, Form $form );

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
}
