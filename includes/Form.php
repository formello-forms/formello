<?php

namespace Formello;

class Form {

	public $ID       = 0;
	public $name    = '';
	public $constraints = array();
	public $settings = array();
	public $messages = array();

	/**
	 * Form constructor.
	 *
	 * @param $id
	 */
	public function __construct( $id ) {
		
		$this->ID = $id;
		if( !empty( $id ) ){
			$form = $this->populate( $id );
		}
		$this->ID = $form->id;
		$this->name = $form->name;

		$settings = maybe_unserialize( $form->settings );
		$this->settings = $settings;
		$this->constraints = $settings['constraints'];
		$this->messages = [
			'success' => isset($settings['successMessage']) ? $settings['successMessage'] : __( 'Success', 'formello' ),
			'error' => isset($settings['errorMessage']) ? $settings['errorMessage'] : __( 'Error', 'formello' ),
		];
	}

	/**
	* Magic method for accessing unexisting properties, eg lowercase "id".
	* @param string $property
	* @return mixed
	*/
	public function __get( $property ) {
		if ( $property === 'id' ) {
			return $this->ID;
		}
	}

	/**
	* @param int $id
	* @return Form
	*/
	public function populate( $id ) {

		global $wpdb;
		$table = $wpdb->prefix . 'formello_forms';
        $form = $wpdb->get_row( 
        	$wpdb->prepare( "SELECT * from {$table} WHERE id=%d;", [ $id ] )
    	);

		return $form;
	}

	/**
	* @param string $code
	* @return string
	*/
	public function get_message( $code ) {
		$form    = $this;
		$message = isset( $this->messages[ $code ] ) ? $this->messages[ $code ] : '';

		/**
		* @param string $message
		* @param Form $form
		*/
		$message = apply_filters( 'formello_form_message_' . $code, $message, $form );
		return $message;
	}

}
