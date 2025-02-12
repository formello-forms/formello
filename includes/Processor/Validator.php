<?php
/**
 * Sanitize and validate form submission. Returns an array with errors and sanitized POST array.
 *
 * @package formello
 */

namespace Formello\Processor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Rakit\Validation\Validator as SDK;
use Formello\TagReplacers\Replacer;

/**
 * Get defaults for our general options.
 *
 * @since 1.0.0
 */
class Validator {

	/**
	 * The Form id
	 *
	 * @var int
	 */
	protected $id;

	/**
	 * The POST array
	 *
	 * @var array
	 */
	protected $params = array();

	/**
	 * The Form settings
	 *
	 * @var array
	 */
	protected $settings = array();

	/**
	 * The form fields sanitized
	 *
	 * @var array
	 */
	protected $fields = array();

	/**
	 * The form errors
	 *
	 * @var array
	 */
	protected $errors = array();

	/**
	 * The constructor.
	 *
	 * @param int   $id The form id.
	 * @param array $settings The form settings.
	 */
	public function __construct( $id, $settings ) {
		$this->id       = $id;
		$this->settings = $settings;
	}

	/**
	 * Validate data
	 */
	public function validate() {
		if ( ! $this->is_spam() ) {
			$this->sanitize();
			$this->validate_fields();
		}
	}

	/**
	 * Set form fields value.
	 *
	 * @param string $name The field name.
	 * @param string $value The field name.
	 */
	public function set_field( $name, $value ) {
		if ( ! empty( $this->settings['fields'][ $name ] ) ) {
			$this->fields[ $name ] = $this->sanitize_field( $name, $value );
		}
	}

	/**
	 * Validate data
	 */
	public function get_data() {
		return array(
			'errors' => $this->errors,
			'fields' => $this->fields,
			'params' => $this->params,
			'settings' => $this->settings,
		);
	}

	/**
	 * Get settings
	 */
	public function get_settings() {
		return $this->settings;
	}

	/**
	 * Check if is spam request
	 *
	 * @return boolean
	 */
	private function is_spam() {

		// First check if form is loaded.
		if ( empty( $this->id ) ) {
			$this->add_error( __( 'Probably a spam request.', 'formello' ) );
			return true;
		}

		if ( ! check_ajax_referer( '_formello', '_formello', false ) ) {
			$this->add_error( __( 'Invalid ajax referer.', 'formello' ) );
			return true;
		}

		$this->params = wp_unslash( $_POST );

		// validate honeypot field.
		$honeypot_key = sprintf( '_formello_h%d', $this->id );

		if ( ! isset( $this->params[ $honeypot_key ] ) || '' !== $this->params[ $honeypot_key ] ) {
			$this->add_error( __( 'Probably a spam request.', 'formello' ) );
			return true;
		}

		// validate recaptcha.
		if ( $this->settings['captchaEnabled'] && 'reCaptcha' === $this->settings['captchaType'] ) {
			return ! $this->validate_recaptcha();
		}

		// validate recaptcha.
		if ( $this->settings['captchaEnabled'] && 'hCaptcha' === $this->settings['capcthaType'] ) {
			return ! $this->validate_hcaptcha();
		}

		// all good: no errors!
		return false;
	}

	/**
	 * Sanitize data
	 */
	private function sanitize() {
		// clean up post request.
		$posted_values = array_intersect_key( $this->params, $this->settings['fields'] );

		// filter out ignored field names and sanitize.
		foreach ( $posted_values as $key => $value ) {
			$this->fields[ $key ] = $this->sanitize_field( $key, $value );
		}

		/**
		 * This filter allows you to add fields to request that needs to be validated.
		 *
		 * @param array $fields
		 * @param array $settings
		 */
		$this->fields = apply_filters( 'formello_data_fields', $this->fields, $this->settings['fields'] );
	}

	/**
	 * Sanitize array with values before saving. Can be called recursively.
	 *
	 * @param string $key the field array key.
	 * @param mixed  $value the value to sanitize.
	 * @return mixed
	 */
	private function sanitize_field( $key, $value ) {
		$fields = $this->settings['fields'];

		// Skip file.
		if ( 'file' === $fields[ $key ] ) {
			return $value;
		}

		// Skip password. We do not store password.
		if ( 'password' === $fields[ $key ] ) {
			return sanitize_text_field( $value );
		}

		if ( 'checkbox' === $fields[ $key ] ) {
			$value = sanitize_text_field( $value );
			return $value ? $value : __( 'yes', 'formello' );
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
	 * Validate fields.
	 *
	 * @return boolean
	 */
	private function validate_fields() {
		$errors = array();

		if ( ! empty( $this->settings['fields'] ) ) {
			// perform validation.
			$validator = new SDK( $this->get_validation_messages() );
			$validator->addValidator( 'maxlength', new \Formello\Validators\MaxLengthRule() );
			$validator->addValidator( 'minlength', new \Formello\Validators\MinLengthRule() );

			$validation = $validator->validate( $this->fields, $this->settings['constraints'] );

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
		$errors = apply_filters( 'formello_validate_form_' . $this->id, $errors, $this->fields, $this );

		/**
		 * This filter allows you to perform your own form validation.
		 *
		 * Return a non-empty string if you want to raise an error.
		 * Error codes with a specific error message are: "required_field_missing", "invalid_email", and "error"
		 *
		 * @param string $errors
		 * @param Formello\Validator $this
		 */
		$errors = apply_filters( 'formello_validate_form', $errors, $this->fields, $this );

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
	private function get_validation_messages() {
		$settings = get_option( 'formello' );
		return array(
			'required'  => 'Field :attribute: ' . $settings['messages']['missingValue']['default'],
			'color'     => 'Field :attribute: ' . $settings['messages']['patternMismatch']['color'],
			'date'      => 'Field :attribute: ' . $settings['messages']['patternMismatch']['date'],
			'email'     => 'Field :attribute: ' . $settings['messages']['patternMismatch']['email'],
			'regex'     => 'Field :attribute: ' . $settings['messages']['patternMismatch']['default'],
			'month'     => 'Field :attribute: ' . $settings['messages']['patternMismatch']['month'],
			'numeric'   => 'Field :attribute: ' . $settings['messages']['patternMismatch']['number'],
			'time'      => 'Field :attribute: ' . $settings['messages']['patternMismatch']['time'],
			'url'       => 'Field :attribute: ' . $settings['messages']['patternMismatch']['url'],
			'minlength' => str_replace(
				array( '{minLength}', '{length}' ),
				array( ':minlength', ':attribute' ),
				$settings['messages']['wrongLength']['under']
			),
			'maxlength' => str_replace(
				array( '{maxLength}', '{length}' ),
				array( ':maxlength', ':attribute' ),
				$settings['messages']['wrongLength']['over']
			),
			'min'       => 'Field :attribute: ' . str_replace( '{min}', ':min', $settings['messages']['outOfRange']['under'] ),
			'max'       => 'Field :attribute: ' . str_replace( '{max}', ':max', $settings['messages']['outOfRange']['over'] ),
		);
	}

	/**
	 * ReCaptcha validation
	 *
	 * @return boolean
	 */
	private function validate_recaptcha() {
		$settings = get_option( 'formello' );

		if ( empty( $this->params['g-recaptcha-response'] ) ) {
			$this->add_error( __( 'Invalid reCaptcha.', 'formello' ) );
			return false;
		}

		$captcha = http_build_query(
			array(
				'secret'   => $settings['reCaptcha']['secret_key'],
				'response' => $this->params['g-recaptcha-response'],
				'remoteip' => isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '',
			)
		);

		$response = wp_remote_get( 'https://www.google.com/recaptcha/api/siteverify?' . $captcha );
		$response = json_decode( $response['body'], true );

		if ( $response['score'] && $response['score'] < $settings['reCaptcha']['threshold'] ) {
			$this->add_error( __( 'Invalid reCaptcha.', 'formello' ) );
			return $response['score'] < $settings['reCaptcha']['threshold'];
		}

		return $response['success'];
	}

	/**
	 * The hCaptcha validation
	 *
	 * @return boolean
	 */
	private function validate_hcaptcha() {
		$settings = get_option( 'formello' );

		if ( empty( $this->params['h-captcha-response'] ) ) {
			$this->add_error( __( 'Invalid captcha.', 'formello' ) );
			return false;
		}

		$captcha = http_build_query(
			array(
				'secret'   => $settings['hCaptcha']['secret_key'],
				'response' => $this->params['h-captcha-response'],
				'remoteip' => isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '',
			)
		);

		$response = wp_remote_get( 'https://api.hcaptcha.com/siteverify?' . $captcha );
		$response = json_decode( $response['body'], true );

		if ( $response['score'] && $response['score'] >= $settings['hCaptcha']['threshold'] ) {
			$this->add_error( __( 'Invalid captcha.', 'formello' ) );
			return $response['score'] >= $settings['hCaptcha']['threshold'];
		}

		return $response;
	}

	/**
	 * Replace tags if any.
	 *
	 * @param mixed $template String template.
	 */
	private function replace_tags( $template ) {
		$replacer = new Replacer( $this->params );
		$result   = $replacer->parse( $template );

		return $result;
	}

	/**
	 * Set error.
	 *
	 * @param string $error The action name.
	 */
	public function add_error( $error ) {
		$this->errors[] = $error;
	}
}
