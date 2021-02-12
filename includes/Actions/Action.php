<?php

namespace Formello\Actions;

use Formello\Form;
use Formello\Data;

abstract class Action {

	protected $type  		= '';
	protected $label 		= '';
	protected $settings 	= [];

	public function hook() {
		add_filter( 'formello_available_form_actions', array( $this, 'register' ) );
		add_action( 'formello_process_form_action_' . $this->type, array( $this, 'process' ), 10, 3 );
	}

	abstract function process( array $settings, Data $submission, Form $form );

	/**
	 * @param array $actions
	 * @return array
	 */
	public function register( array $actions ) {
		$actions[ $this->type ] = [
			'label' 		=> $this->label,
			'type'		=> $this->type,
			'settings' 	=> $this->settings,
		];
		return $actions;
	}
}
