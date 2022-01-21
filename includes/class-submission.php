<?php
/**
 * Manage Data submitted performing also validation.
 *
 * @package Formello
 */

namespace Formello;

use Formello\Form;
use Formello\Rakit\Validation\Validator;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Data Handler
 *
 * @since 1.0.0
 */
class Submission extends Form {

	/**
	 * The actions array
	 *
	 * @var array
	 */
	private $actions = array();

	/**
	 * Process data
	 *
	 * @return boolean
	 */
	public function validate() {

		// First check if is a spam request.
		if ( $this->is_spam() ) {
			$this->add_error( __( 'Probably a spam request.', 'formello' ) );
			return false;
		}

		// Not spam, we can validate.
		if ( ! $this->is_valid() ) {
			return false;
		}

		// phpcs:ignore
		$posted_values = array_intersect_key( $_POST, $this->get_fields() );

		// filter out ignored field names.
		foreach ( $posted_values as $key => $value ) {
			$this->data['fields'][ sanitize_key( $key ) ] = $this->sanitize( $key, $value );
		}

		// add details on response.
		$this->data['details']['ip_address']   = ! empty( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$this->data['details']['user_agent']   = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$this->data['details']['referer_url']  = ! empty( $_SERVER['HTTP_REFERER'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '';
		$this->data['details']['submitted_at'] = gmdate( 'Y-m-d H:i:s' );

		$form_actions = $this->get_actions();

		if ( isset( $form_actions ) ) {
			foreach ( $form_actions as $action_settings ) {
				$this->data['actions'][] = $this->recursive_actions( $action_settings );
			}
		}

		return true;
	}

	/**
	 * Get a Data array.
	 *
	 * @return array
	 */
	public function get_data() {
		return $this->data;
	}

	/**
	 * Sanitize array with values before saving. Can be called recursively.
	 *
	 * @param string $key the field array key.
	 * @param mixed  $value the value to sanitize.
	 * @return mixed
	 */
	private function sanitize( $key, $value ) {
		$fields = $this->get_fields();

		if ( is_array( $value ) ) {
			return array_map( 'sanitize_text_field', $this->replace_tags( $value ) );
		}

		if ( 'textarea' === $fields[ $key ] ) {
			return sanitize_textarea_field( $this->replace_tags( $value ) );
		}

		return sanitize_text_field( $this->replace_tags( $value ) );
	}

	/**
	 * Replace tags if any.
	 *
	 * @param string $template String template.
	 */
	private function replace_tags( $template ) {

		$replacer = new TagReplacers\Replacer();
		$result   = $replacer->parse( $template );

		return $result;

	}

	/**
	 * ReCaptcha validation
	 *
	 * @return string
	 */
	private function validate_recaptcha() {

		$settings = get_option( 'formello2' );
		$captcha_postdata = http_build_query(
			array(
				'secret'   => $settings['reCaptcha']['secret_key'],
				'response' => $_POST['g-recaptcha-response'], // phpcs:ignore
				'remoteip' => isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '',
			)
		);

		$response = wp_remote_get( 'https://www.google.com/recaptcha/api/siteverify?' . $captcha_postdata );
		$response = json_decode( $response['body'], true );

		return $response;
	}


	/**
	 * Form validation
	 *
	 * @return boolean
	 */
	private function is_valid() {

		$errors = array();

		// perform validation.
		$validator = new Validator();
		// phpcs:ignore
		$validation = $validator->make( $_POST, $this->get_constraints() );

		// then validate.
		$validation->validate();

		if ( $validation->fails() ) {
			// handling errors.
			$errors = $validation->errors()->all( ':message' );

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
		 * @param Form $form
		 * @param array $data
		 */
		$errors = apply_filters( 'formello_validate_form', $errors, $this );

		if ( ! empty( $errors ) ) {
			$this->errors = array_merge( $this->errors, $errors );
			return false;
		}

		// all good: no errors!
		return true;
	}

	/**
	 * Form validation
	 *
	 * @return boolean
	 */
	private function is_spam() {

		// validate honeypot field.
		$honeypot_key = sprintf( '_formello_h%d', $this->get_id() );

		// phpcs:ignore
		if ( ! isset( $_POST[ $honeypot_key ] ) || '' !== $_POST[ $honeypot_key ] ) {
			return true;
		}

		// validate recaptcha.
		// phpcs:ignore
		if ( $this->get_settings( 'recaptchaEnabled' ) && isset( $_POST['g-recaptcha-response'] ) && empty( $_POST['g-recaptcha-response'] ) ) {
			return true;
		}

		// validate recaptcha.
		// phpcs:ignore
		if ( isset( $_POST['g-recaptcha-response'] ) && empty( $_POST['g-recaptcha-response'] ) ) {
			return true;
		}

		// validate recaptcha.
		if ( $this->get_settings( 'recaptchaEnabled' ) ) {
			$captcha_validate = $this->validate_recaptcha();
		}

		if ( isset( $captcha_validate ) && false === $captcha_validate ) {
			return true;
		}

		// all good: no errors!
		return false;
	}

	/**
	 * Get a Data array.
	 *
	 * @param string $type The action name.
	 * @param array  $data The array of data.
	 */
	private function set_debug( $type, $data = array() ) {
		$this->debug[ $type ][] = $data;
	}

	/**
	 * Get a Data array.
	 *
	 * @param string $error The action name.
	 */
	private function add_error( $error ) {
		$this->errors[] = $error;
	}

	/**
	 * Get a Data array.
	 */
	public function response() {
		return array(
			'errors'  => $this->errors,
			'message' => array(
				'type' => empty( $this->errors ) ? 'success' : 'error',
				'text' => $this->messages['error'],
			),
		);
	}

	/**
	 * Recursive sanitation for an array
	 *
	 * @param array $actions The actions to sanitize.
	 *
	 * @return mixed
	 */
	protected function recursive_actions( $actions ) {
		foreach ( $actions as $key => &$value ) {
			if ( is_array( $value ) ) {
				$value = $this->recursive_actions( $value );
			} else {
				$value = $this->replace_tags( $value );
			}
		}

		return $actions;
	}

}
