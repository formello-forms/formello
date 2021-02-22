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

	/**
	 * The form ID
	 *
	 * @var Int
	 */
	public $ID = 0;
	/**
	 * The form name
	 *
	 * @var string
	 */
	public $name = '';
	/**
	 * The form settings
	 *
	 * @var array
	 */
	public $settings = array();
	/**
	 * The form messages
	 *
	 * @var array
	 */
	public $messages = array();

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

		$this->settings = maybe_unserialize( $form->settings );
		$this->messages = array(
			'success' => isset( $this->settings['successMessage'] ) ? $this->settings['successMessage'] : __( 'Success', 'formello' ),
			'error'   => isset( $this->settings['errorMessage'] ) ? $this->settings['errorMessage'] : __( 'Error', 'formello' ),
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
	 * Get ID of form
	 *
	 * @return array
	 */
	public function get_id() {
		return $this->ID;
	}

	/**
	 * Get form settings
	 *
	 * @return array
	 */
	public function get_settings() {
		return $this->settings;
	}

	/**
	 * Get form constraints
	 *
	 * @return array
	 */
	public function get_constraints() {
		return $this->settings['constraints'];
	}

	/**
	 * Get form fields
	 *
	 * @return array
	 */
	public function get_fields() {
		return $this->settings['fields'];
	}

	/**
	 * Get form message
	 *
	 * @param string $code The code response.
	 * @return string
	 */
	public function get_message( $code ) {
		$message = isset( $this->messages[ $code ] ) ? $this->messages[ $code ] : '';

		$message = apply_filters( 'formello_form_message_' . $code, $message, $form );
		return $message;
	}

	/**
	 * Get form as array
	 *
	 * @return array
	 */
	public function to_array() {

		$form = array();

		$form['id']       = $this->ID;
		$form['name']     = $this->name;
		$form['settings'] = $this->settings;

		return $form;
	}

}
