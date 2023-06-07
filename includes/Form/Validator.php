<?php
/**
 * Sanitize and validate form submission.
 *
 * @package Formello
 */

namespace Formello\Form;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use \Rakit\Validation\Validator as SDK;
use Formello\TagReplacers\Replacer;

/**
 * Get defaults for our general options.
 *
 * @since 1.0.0
 */
class Validator {
	use RequestTrait;

	/**
	 * The constructor.
	 *
	 * @param int $id The form id.
	 */
	public function __construct( $data, $config = array() ) {
		$this->data = $data;
		$this->config = $config;
	}

	/**
	 * Validate data
	 */
	public function validate() {
		if( ! $this->is_spam() ){
			$this->sanitize();
			$this->validate_fields();
		}
	}

	/**
	 * Sanitize data
	 */
	private function sanitize() {
		// clean up post request.
		// phpcs:ignore
		$posted_values = array_intersect_key( $_POST, $this->get_fields_definitions() );

		// filter out ignored field names and sanitize.
		foreach ( $posted_values as $key => $value ) {
			$this->set_field( $key, $value );
		}
		/**
		 * This filter allows you to add fields to request that needs to be validated.
		 *
		 * @param array $fields
		 * @param Formello\Form $form
		 */
		$this->data['fields'] = apply_filters( 'formello_data_fields', $this->data['fields'], $this );

	}

	/**
	 * Check if is spam request
	 *
	 * @return boolean
	 */
	private function is_spam() {

		// First check if form is loaded.
		if ( ! $this->is_loaded() ) {
			$this->add_error( __( 'Probably a spam request.', 'formello' ) );
			return true;
		}

		if ( ! wp_verify_nonce( $_POST['_formello'], '_formello' ) ) {
			$this->add_error( __( 'Invalid nonce.', 'formello' ) );
			return true;
		}

		// validate honeypot field.
		$honeypot_key = sprintf( '_formello_h%d', $this->get_id() );

		if ( ! isset( $_POST[ $honeypot_key ] ) || '' !== $_POST[ $honeypot_key ] ) {
			$this->add_error( __( 'Probably a spam request.', 'formello' ) );
			return true;
		}

		$form_settings = $this->get_form_settings();

		// validate recaptcha.
		if ( $form_settings['recaptchaEnabled'] && isset( $_POST['g-recaptcha-response'] ) && empty( $_POST['g-recaptcha-response'] ) ) {
			$this->add_error( __( 'Invalid reCaptcha.', 'formello' ) );
			return true;
		}

		// validate recaptcha.
		if ( isset( $_POST['g-recaptcha-response'] ) && empty( $_POST['g-recaptcha-response'] ) ) {
			$this->add_error( __( 'Invalid reCaptcha.', 'formello' ) );
			return true;
		}

		// validate recaptcha.
		if ( $form_settings['recaptchaEnabled'] ) {
			$captcha_validate = $this->validate_recaptcha();
		}

		if ( isset( $captcha_validate ) && false === $captcha_validate ) {
			$this->add_error( __( 'Invalid reCaptcha.', 'formello' ) );
			return true;
		}

		// all good: no errors!
		return false;
	}

	/**
	 * Validate fields.
	 *
	 * @return boolean
	 */
	private function validate_fields() {
		$errors = array();

		if ( ! empty( $this->data['fields'] ) ) {
			// perform validation.
			$validator = new SDK( $this->get_validation_messages() );
			$validator->addValidator( 'maxlength', new \Formello\Validators\MaxLengthRule() );
			$validator->addValidator( 'minlength', new \Formello\Validators\MinLengthRule() );

			$validation = $validator->make( $this->data['fields'], $this->get_form_setting( 'constraints' ) );

			// then validate.
			$validation->validate();

			if ( $validation->fails() ) {
				// handling errors.
				$errors = $validation->errors()->all( ':message' );
			}
		}

		/**
		 * This filter allows you to perform your own form validation. The dynamic portion of the hook refers to the form slug.
		 *
		 * Return a non-empty string if you want to raise an error.
		 * Error codes with a specific error message are: "required_field_missing", "invalid_email", and "error"
		 *
		 * @param string $errors
		 * @param Form $form
		 * @param array $data
		 */
		$errors = apply_filters( 'formello_validate_form_' . $this->get_id(), $errors, $this );

		/**
		 * This filter allows you to perform your own form validation.
		 *
		 * Return a non-empty string if you want to raise an error.
		 * Error codes with a specific error message are: "required_field_missing", "invalid_email", and "error"
		 *
		 * @param string $errors
		 * @param Formello\Form $form
		 */
		$errors = apply_filters( 'formello_validate_form', $errors, $this );

		if ( ! empty( $errors ) ) {
			$this->data['errors'] = array_merge( $this->data['errors'], $errors );
			return false;
		}

		// all good: no errors!
		return true;
	}

	/**
	 * Get validation messages
	 *
	 * @return array The validation messages.
	 */
	public function get_validation_messages() {
		$settings = $this->get_setting( 'messages' );
		return array(
			'required' => ':attribute ' . $settings['missingValue']['default'],
			'color' => ':value ' . $settings['patternMismatch']['color'],
			'date' => ':value ' . $settings['patternMismatch']['date'],
			'email' => ':attribute ' . $settings['patternMismatch']['email'],
			'regex' => ':value ' . $settings['patternMismatch']['default'],
			'month' => ':value ' . $settings['patternMismatch']['month'],
			'numeric' => ':value ' . $settings['patternMismatch']['number'],
			'time' => ':value ' . $settings['patternMismatch']['time'],
			'url' => ':value ' . $settings['patternMismatch']['url'],
			'minlength' => str_replace(
				array( '{minLength}', '{length}' ),
				array( ':minlength', ':value' ),
				$settings['wrongLength']['under']
			),
			'maxlength' => str_replace(
				array( '{maxLength}', '{length}' ),
				array( ':maxlength', ':value' ),
				$settings['wrongLength']['over']
			),
			'min' => ':value ' . str_replace( '{min}', ':min', $settings['outOfRange']['under'] ),
			'max' => ':value ' . str_replace( '{max}', ':max', $settings['outOfRange']['over'] ),
		);
	}

	/**
	 * ReCaptcha validation
	 *
	 * @return string
	 */
	private function validate_recaptcha() {
		$recaptcha = $this->get_setting( 'reCaptcha' );

		$captcha_postdata = http_build_query(
			array(
				'secret'   => $recaptcha['secret_key'],
				'response' => $_POST['g-recaptcha-response'], // phpcs:ignore
				'remoteip' => isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '',
			)
		);

		$response = wp_remote_get( 'https://www.google.com/recaptcha/api/siteverify?' . $captcha_postdata );
		$response = json_decode( $response['body'], true );

		return $response;
	}

	/**
	 * Get the response
	 *
	 * @param boolean $as_html Check for Html response.
	 * @return array
	 */
	public function get_response( $as_html = false ) {
		$response = new Response( $this->ID, $this->settings, $this->data, $this->errors );

		return $response;
	}

}
