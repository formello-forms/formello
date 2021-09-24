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
	 * The form data
	 *
	 * @var array
	 */
	public $data = array();

	/**
	 * The form details
	 *
	 * @var array
	 */
	public $details = array();

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
	 * The form errors
	 *
	 * @var array
	 */
	public $errors = array();

	/**
	 * The form debug
	 *
	 * @var array
	 */
	public $debug = array();

	/**
	 * Form constructor.
	 *
	 * @param int $id The form id.
	 */
	public function __construct( $id ) {

		if ( ! empty( $id ) ) {
			$this->ID = $id;
			$this->settings = get_post_meta( $id, 'formello_settings', true );
		}

		$this->messages = array(
			'success' => isset( $this->settings['successMessage'] ) ? $this->settings['successMessage'] : __( 'Thanks for submitting this form.', 'formello' ),
			'error'   => isset( $this->settings['errorMessage'] ) ? $this->settings['errorMessage'] : __( 'Ops. An error occurred.', 'formello' ),
			'spam'   => __( 'Go away spammer.', 'formello' ),
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
			$wpdb->prepare( 'SELECT * from `%1s` WHERE id=%d;', array( $table, $id ) )
		);

		return $form;
	}

	/**
	 * Insert form in DB
	 *
	 * @param int $id The form ID.
	 * @return Form
	 */
	public function populate_with_data( $data ) {

		$this->data = $data['data'];
		$this->details = $data['details'];
		$this->errors = $data['errors'];

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
		$defaults = array(
			'storeSubmissions' => true,
			'recaptchaEnabled' => false,
			'hide' => false,
			'debug' => false,
		);
		return wp_parse_args( $this->settings, $defaults );
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
	 * Get debug
	 *
	 * @return boolean
	 */
	public function is_debug() {
		return $this->settings['debug'] && current_user_can( 'manage_options' ) ?: false;
	}

	/**
	 * Add debug
	 */
	public function log( $type, $message = '' ) {
		if ( $this->is_debug() ) {
			$this->debug[][ $type ] = $message;
		}
	}

	/**
	 * Get form message
	 *
	 * @param string $code The code response.
	 * @return string
	 */
	public function get_message( $code ) {
		$message = isset( $this->messages[ $code ] ) ? $this->messages[ $code ] : '';

		$message = apply_filters( 'formello_form_message_' . $code, $message );
		return $message;
	}

	/**
	 * Save form submission in DB.
	 */
	public function save() {

		global $wpdb;

		$values = array();
		$submissions_table = $wpdb->prefix . 'formello_submissions';
		$submissions_meta_table = $wpdb->prefix . 'formello_submissions_meta';
		$form_id = $this->get_id();
		$data  = array(
			'data'    => wp_json_encode( $this->data ),
			'form_id' => $form_id,
		);

		// add details to record.
		$data = array_merge( $data, $this->details );

		if ( ! empty( $this->id ) ) {
			$wpdb->update( $submissions_table, $data, array( 'id' => $this->id ) );
			return null;
		}

		// insert new row.
		$num_rows = $wpdb->insert( $submissions_table, $data );
		if ( $num_rows > 0 ) {
			$this->id = $wpdb->insert_id;
		}

		// insert also in submissions meta.
		foreach ( $this->data as $key => $value ) {
			$values[] = '(' . $form_id . ',' . $this->id . ', "' . $key . '" , "' . $value . '")';
		}
		$sql = implode( ',', $values );

		$wpdb->query(
			"INSERT INTO $submissions_meta_table
		    (form_id, submission_id, field_name, field_value)
			VALUES
			$sql"
		);

	}

	/**
	 * Get form as array
	 *
	 * @return array
	 */
	public function to_array() {

		$form = array();

		$form['id']       = $this->ID;
		$form['errors']   = $this->errors;
		$form['messages'] = $this->messages;
		$form['settings'] = $this->settings;
		$form['debug']    = $this->debug;

		return $form;
	}

}
