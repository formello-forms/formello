<?php
/**
 * Sanitize and validate form submission and return a Response.
 *
 * @package Formello
 */

namespace Formello\Form;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use \Rakit\Validation\Validator;
use Formello\Log;
use Formello\TagReplacers\Replacer;

/**
 * Get defaults for our general options.
 *
 * @since 1.0.0
 */
class Request {

	/**
	 * The form ID
	 *
	 * @var Int
	 */
	protected $ID = 0;

	/**
	 * The data submitted
	 *
	 * @var array
	 */
	protected $data = array();

	/**
	 * The global Formello settings
	 *
	 * @var array
	 */
	protected $formello_settings = array();

	/**
	 * The form settings
	 *
	 * @var array
	 */
	protected $settings = array();

	/**
	 * The form errors
	 *
	 * @var array
	 */
	protected $errors = array();

	/**
	 * The form debug
	 *
	 * @var array
	 */
	protected $debug = array();

	/**
	 * The actions array
	 *
	 * @var array
	 */
	protected $actions = array();

	/**
	 * The constructor.
	 *
	 * @param int $id The form id.
	 */
	public function __construct( $id ) {

		if ( ! empty( $id ) ) {
			$this->formello_settings = get_option( 'formello' );
			$this->ID      = $id;
			$settings      = get_post_meta( $id, '_formello_settings', true );

			// parse default settings.
			$this->settings = $this->parse_settings( $settings );
			$this->actions = get_post_meta( $id, '_formello_actions', true );
		}

	}

	/**
	 * Is form loaded?
	 */
	public function is_loaded() {
		return '' !== $this->settings;
	}

	/**
	 * Get ID of form
	 *
	 * @return number
	 */
	public function get_id() {
		return $this->ID;
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
	 * Get form settings
	 *
	 * @return array
	 */
	public function get_settings() {
		return $this->settings;
	}

	/**
	 * Get form setting by name
	 *
	 * @param array $setting The setting to load.
	 * @return array
	 */
	public function get_setting( $setting ) {
		return $this->settings[ $setting ];
	}

	/**
	 * Get form fields description.
	 *
	 * @return array
	 */
	public function get_fields() {
		return $this->settings['fields'];
	}

	/**
	 * Get form fields value.
	 *
	 * @param string $name The field name.
	 * @return array
	 */
	public function get_field( $name ) {
		if ( ! empty( $this->data['fields'][ $name ] ) ) {
			return $this->data['fields'][ $name ];
		}
	}

	/**
	 * Set sanitized form fields value.
	 *
	 * @param string $name The field name.
	 * @param string $value The field name.
	 */
	public function set_field( $name, $value ) {
		if ( ! empty( $this->settings['fields'][ $name ] ) ) {
			$sanitized = $this->sanitize_field( $name, $value );
			$this->data['fields'][ $name ] = $sanitized;
			// We store sanitized value also in $_POST
			// so action can access to already sanitized values.
			$_POST[ $name ] = $sanitized;
		}
	}

	/**
	 * Set errors.
	 *
	 * @param string $error The action name.
	 */
	public function add_error( $error ) {
		$this->errors[] = $error;
	}

	/**
	 * Get form settings
	 *
	 * @param array $settings The form settings.
	 *
	 * @return array
	 */
	private function parse_settings( $settings ) {
		$defaults = array(
			'storeSubmissions' => true,
			'recaptchaEnabled' => false,
			'hide' => false,
			'debug' => false,
			'messages' => array(
				'success' => __( 'Thanks for submitting this form.', 'formello' ),
				'error' => __( 'Ops. An error occurred.', 'formello' ),
			),
		);
		if ( '' === $settings['messages']['success'] ) {
			$settings['messages']['success'] = $this->formello_settings['messages']['form']['success'];
		}
		if ( '' === $settings['messages']['error'] ) {
			$settings['messages']['error'] = $this->formello_settings['messages']['form']['error'];
		}
		return wp_parse_args( $settings, $defaults );
	}

	/**
	 * Process data
	 *
	 * @return Formello\Form\Response
	 */
	public function submit() {

		$this->data['fields'] = array();
		$this->data['actions'] = array();

		// First check if is a spam request.
		if ( $this->is_spam() ) {
			return $this->get_response();
		}
		// Sanitize.
		$this->sanitize();

		// Not spam and sanitized, we can validate.
		if ( ! $this->is_valid() ) {
			return $this->get_response();
		}

		// Populate actions with cleaned up data.
		$this->populate_actions();

		return $this->get_response();

	}

	/**
	 * Sanitize data
	 */
	public function sanitize() {

		// clean up post request.
		// phpcs:ignore
		$posted_values = array_intersect_key( $_POST, $this->get_fields() );

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
	 * Populate actions
	 */
	public function populate_actions() {

		$form_actions = $this->actions;

		if ( isset( $form_actions ) ) {
			foreach ( $form_actions as $action_settings ) {
				$this->data['actions'][] = $this->recursive_actions( $action_settings );
			}
		}

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

		// validate honeypot field.
		$honeypot_key = sprintf( '_formello_h%d', $this->get_id() );

		if ( ! wp_verify_nonce( $_POST['_formello'], '_formello' ) ) {
			$this->add_error( __( 'Invalid nonce.', 'formello' ) );
			return true;
		}

		if ( ! isset( $_POST[ $honeypot_key ] ) || '' !== $_POST[ $honeypot_key ] ) {
			$this->add_error( __( 'Invalid honeypot.', 'formello' ) );
			return true;
		}

		// validate recaptcha.
		if ( $this->get_setting( 'recaptchaEnabled' ) && isset( $_POST['g-recaptcha-response'] ) && empty( $_POST['g-recaptcha-response'] ) ) {
			$this->add_error( __( 'Invalid reCaptcha.', 'formello' ) );
			return true;
		}

		// validate recaptcha.
		if ( isset( $_POST['g-recaptcha-response'] ) && empty( $_POST['g-recaptcha-response'] ) ) {
			$this->add_error( __( 'Invalid reCaptcha.', 'formello' ) );
			return true;
		}

		// validate recaptcha.
		if ( $this->get_setting( 'recaptchaEnabled' ) ) {
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
	 * Sanitize field with values before saving. Can be called recursively.
	 *
	 * @param string $key the field array key.
	 * @param mixed  $value the value to sanitize.
	 * @return mixed
	 */
	private function sanitize_field( $key, $value ) {
		$fields = $this->get_fields();

		// Skip file.
		if ( 'file' === $fields[ $key ] ) {
			return sanitize_text_field( $value );
		}

		// Skip password. We do not store password.
		if ( 'password' === $fields[ $key ] ) {
			return sanitize_text_field( $value );
		}

		if ( is_array( $value ) ) {
			$field = array_map( array( $this, 'replace_tags' ), $value );
			return array_map( 'sanitize_text_field', $field );
		}

		if ( 'richtext' === $fields[ $key ] ) {
			$allowed_tags = wp_kses_allowed_html( 'post' );
			return wp_kses( stripslashes_deep( $this->replace_tags( $value ) ), $allowed_tags );
		}

		if ( 'textarea' === $fields[ $key ] ) {
			return sanitize_textarea_field( $this->replace_tags( $value ) );
		}

		return sanitize_text_field( $this->replace_tags( $value ) );
	}

	/**
	 * Form validation
	 *
	 * @return boolean
	 */
	private function is_valid() {
		$errors = array();

		if ( ! empty( $this->data['fields'] ) ) {
			// perform validation.
			$validator = new Validator( $this->get_validation_messages() );
			$validator->addValidator( 'maxlength', new \Formello\Validators\MaxLengthRule() );
			$validator->addValidator( 'minlength', new \Formello\Validators\MinLengthRule() );

			$validation = $validator->make( $this->data['fields'], $this->get_setting( 'constraints' ) );

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
			$this->errors = array_merge( $this->errors, $errors );
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
		return array(
			'required' => ':attribute ' . $this->formello_settings['messages']['missingValue']['default'],
			'color' => ':value ' . $this->formello_settings['messages']['patternMismatch']['color'],
			'date' => ':value ' . $this->formello_settings['messages']['patternMismatch']['date'],
			'email' => ':value ' . $this->formello_settings['messages']['patternMismatch']['email'],
			'regex' => ':value ' . $this->formello_settings['messages']['patternMismatch']['default'],
			'month' => ':value ' . $this->formello_settings['messages']['patternMismatch']['month'],
			'numeric' => ':value ' . $this->formello_settings['messages']['patternMismatch']['number'],
			'time' => ':value ' . $this->formello_settings['messages']['patternMismatch']['time'],
			'url' => ':value ' . $this->formello_settings['messages']['patternMismatch']['url'],
			'minlength' => str_replace(
				array( '{minLength}', '{length}' ),
				array( ':minlength', ':value' ),
				$this->formello_settings['messages']['wrongLength']['under']
			),
			'maxlength' => str_replace(
				array( '{maxLength}', '{length}' ),
				array( ':maxlength', ':value' ),
				$this->formello_settings['messages']['wrongLength']['over']
			),
			'min' => ':value ' . str_replace( '{min}', ':min', $this->formello_settings['messages']['outOfRange']['under'] ),
			'max' => ':value ' . str_replace( '{max}', ':max', $this->formello_settings['messages']['outOfRange']['over'] ),
		);
	}

	/**
	 * Recursive sanitation for an array
	 *
	 * @param array $actions The actions to sanitize.
	 *
	 * @return mixed
	 */
	private function recursive_actions( $actions ) {

		foreach ( $actions as $key => &$value ) {
			if ( is_array( $value ) ) {

				$value = $this->recursive_actions( $value );

			} elseif ( is_string( $value ) ) {

				$value = $this->replace_tags( $value );

			}
		}

		return $actions;
	}

	/**
	 * Replace tags if any.
	 *
	 * @param mixed $template String template.
	 */
	private function replace_tags( $template ) {
		$replacer = new Replacer();
		$result   = $replacer->parse( $template );

		return $result;
	}

	/**
	 * ReCaptcha validation
	 *
	 * @return string
	 */
	private function validate_recaptcha() {
		$captcha_postdata = http_build_query(
			array(
				'secret'   => $this->formello_settings['reCaptcha']['secret_key'],
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
