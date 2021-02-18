<?php
/**
 * Set our block attribute defaults.
 *
 * @package Formello
 */

namespace Formello;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Get defaults for our general options.
 *
 * @since 1.0.0
 */
class Form {

	public $ID          = 0;
	public $name        = '';
	public $constraints = array();
	public $settings    = array();
	public $messages    = array();

	/**
	 * Form constructor.
	 *
	 * @param int $id The form id.
	 */
	public function __construct( $id ) {

		$this->ID = $id;
		if ( ! empty( $id ) ) {
			$form = $this->populate( $id );
		}
		$this->ID   = $form->id;
		$this->name = $form->name;

		$settings          = maybe_unserialize( $form->settings );
		$this->settings    = $settings;
		$this->constraints = $settings['constraints'];
		$this->messages    = array(
			'success' => isset( $settings['successMessage'] ) ? $settings['successMessage'] : __( 'Success', 'formello' ),
			'error'   => isset( $settings['errorMessage'] ) ? $settings['errorMessage'] : __( 'Error', 'formello' ),
		);
	}

	/**
	 * Insert form in DB
	 *
	 * @param int $id The form ID.
	 * @return Form
	 */
	public function populate( $id ) {

		global $wpdb;
		$table = $wpdb->prefix . 'formello_forms';
		$form  = $wpdb->get_row(
			$wpdb->prepare( 'SELECT * from %1s WHERE id=%d;', array( $table, $id ) )
		);

		return $form;
	}

	/**
	 * Get form message
	 *
	 * @param string $code The code response.
	 * @return string
	 */
	public function get_message( $code ) {
		$form    = $this;
		$message = isset( $this->messages[ $code ] ) ? $this->messages[ $code ] : '';

		$message = apply_filters( 'formello_form_message_' . $code, $message, $form );
		return $message;
	}

}
