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

use \Rakit\Validation\Validator;
use Formello\Log;

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
	protected $ID = 0;

	/**
	 * The form ID
	 *
	 * @var Int
	 */
	protected $submission_id = 0;

	/**
	 * The data submitted
	 *
	 * @var array
	 */
	protected $data = array();

	/**
	 * The submission details
	 *
	 * @var array
	 */
	protected $details = array();

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
	 * The form log
	 *
	 * @var boolean
	 */
	protected $logger;

	/**
	 * The actions array
	 *
	 * @var array
	 */
	protected $actions = array();

	/**
	 * Form constructor.
	 *
	 * @param int $id The form id.
	 */
	public function __construct( $id ) {
		$this->formello_settings = get_option( 'formello' );

		if ( ! empty( $id ) ) {
			$this->ID      = $id;
			$settings      = get_post_meta( $id, '_formello_settings', true );
			$this->actions = get_post_meta( $id, '_formello_actions', true );
			$this->logger  = Log::get_instance();
		}
		// parse default settings.
		$this->settings = $this->parse_settings( $settings );

	}

	/**
	 * Select form from DB
	 *
	 * @param int $id The form ID.
	 * @return Form
	 */
	public function populate( $id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'formello_forms';
		$form  = $wpdb->get_row(
			$wpdb->prepare( 'SELECT * from {$table} WHERE id=%d;', array( $id ) )
		);

		return $form;
	}

	/**
	 * Is form loaded?
	 */
	public function is_loaded() {
		return '' !== $this->settings;
	}

	/**
	 * Insert form in DB
	 *
	 * @param array $data The form sanitized data.
	 */
	public function set_data( $data ) {
		$this->data = $data;
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
	 * Get form settings
	 *
	 * @return array
	 */
	public function get_settings() {
		return $this->settings;
	}

	/**
	 * Get form setting
	 *
	 * @param array $setting The setting to load.
	 * @return array
	 */
	public function get_setting( $setting ) {
		return $this->settings[ $setting ];
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
	 * Get form fields description.
	 *
	 * @return array
	 */
	public function get_fields() {
		$fields = array();
		foreach ( $this->settings['fields'] as $key => $value ) {
			$fields[ $key ] = $value;
		}
		return $fields;
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
	 * Set form fields value.
	 *
	 * @param string $name The field name.
	 * @param string $value The field name.
	 */
	public function set_field( $name, $value ) {
		if ( ! empty( $this->settings['fields'][ $name ] ) ) {
			$this->data['fields'][ $name ] = $this->sanitize( $name, $value );
		}
	}

	/**
	 * Get form actions
	 *
	 * @return array
	 */
	public function get_actions() {
		return $this->data['actions'];
	}

	/**
	 * Set form actions
	 *
	 * @param array $actions The actions response.
	 */
	public function set_actions( $actions ) {
		$this->actions = $actions;
	}

	/**
	 * Get debug
	 *
	 * @return boolean
	 */
	public function is_debug() {
		return $this->settings['debug'] && current_user_can( 'manage_options' ) ? true : false;
	}

	/**
	 * Add debug
	 *
	 * @param string $level The actions response.
	 * @param string $message The actions response.
	 * @param array  $context The actions response.
	 */
	public function log( $level, $message, $context = array() ) {
		$this->logger->log( $level, $message, $context );
	}

	/**
	 * Get form message
	 *
	 * @param string $code The code response.
	 * @return string
	 */
	public function get_message( $code ) {
		$message = isset( $this->settings['messages'][ $code ] ) ? $this->settings['messages'][ $code ] : '';

		$message = apply_filters( 'formello_form_message_' . $code, $message );
		return $message;
	}

	/**
	 * Save form submission in DB.
	 */
	public function save() {
		if ( empty( $this->data['fields'] ) ) {
			return true;
		}

		global $wpdb;

		$values = array();
		$placeholder = array();
		$submissions_table = $wpdb->prefix . 'formello_submissions';
		$submissions_meta_table = $wpdb->prefix . 'formello_submissions_meta';
		$form_id = $this->get_id();
		$data  = array(
			'data'    => wp_json_encode( $this->data['fields'] ),
			'form_id' => $form_id,
		);

		// add details to record.
		$data = array_merge( $data, $this->data['details'] );

		// insert new row.
		$num_rows = $wpdb->insert( $submissions_table, $data );
		if ( $num_rows > 0 ) {
			$this->submission_id = $wpdb->insert_id;
		}

		// insert also in submissions meta.
		foreach ( $this->data['fields'] as $key => $value ) {
			array_push( $values, $form_id, $this->submission_id, $key, maybe_serialize( $value ) );
			$place_holders[] = "('%d', '%d', '%s', '%s')";
		}
		$sql = implode( ',', $values );

		$query = 'INSERT INTO ' . $wpdb->prefix . 'formello_submissions_meta (form_id, submission_id, field_name, field_value ) VALUES ';
		$query .= implode( ', ', $place_holders );

		//phpcs:ignore
		$wpdb->query( $wpdb->prepare( $query, $values ) );

		$formello_result = get_transient( 'formello_news', false );
		set_transient( 'formello_news', $formello_result + 1, DAY_IN_SECONDS );

	}

	/**
	 * Get form as array
	 *
	 * @return array
	 */
	public function to_array() {
		$form = array();

		$form['id']       = $this->ID;
		$form['actions']  = $this->data['actions'];
		$form['errors']   = $this->errors;
		if ( $this->is_debug() ) {
			$form['settings'] = $this->settings;
			$form['fields']   = $this->data['fields'];
			$form['details']  = $this->data['details'];
		}

		return $form;
	}

	/**
	 * Process data
	 *
	 * @return boolean
	 */
	public function validate() {

		// First check if form is loaded.
		if ( ! $this->is_loaded() ) {
			$this->add_error( __( 'Probably a spam request.', 'formello' ) );
			return false;
		}

		// First check if is a spam request.
		if ( $this->is_spam() ) {
			$this->add_error( __( 'Probably a spam request.', 'formello' ) );
			return false;
		}

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

		// Not spam, we can validate.
		if ( ! $this->is_valid() ) {
			return false;
		}

		// add details on response.
		$this->data['details']['ip_address']   = ! empty( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$this->data['details']['user_agent']   = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$this->data['details']['referer_url']  = ! empty( $_SERVER['HTTP_REFERER'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '';
		$this->data['details']['submitted_at'] = wp_date( 'Y-m-d H:i:s' );

		$form_actions = $this->actions;

		$this->data['actions'] = array();
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
	 * Replace tags if any.
	 *
	 * @param mixed $template String template.
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
		$captcha_postdata = http_build_query(
			array(
				'secret'   => $formello_settings['reCaptcha']['secret_key'],
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

		if ( ! empty( $this->data['fields'] ) ) {
			// perform validation.
			$validator = new Validator( $this->get_validation_messages() );
			$validator->addValidator( 'maxlength', new \Formello\Validators\MaxLengthRule() );
			$validator->addValidator( 'minlength', new \Formello\Validators\MinLengthRule() );

			$validation = $validator->make( $this->data['fields'], $this->get_constraints() );

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
	 * Form validation
	 *
	 * @return boolean
	 */
	private function is_spam() {

		// validate honeypot field.
		$honeypot_key = sprintf( '_formello_h%d', $this->get_id() );

		if ( ! wp_verify_nonce( $_POST['_formello'], '_formello' ) ) {
			$this->add_error( __( 'Invalid nonce.', 'formello' ) );
			return true;
		}

		/*if ( ! check_ajax_referer( '_formello', '_formello', false ) ) {
			$this->add_error( __( 'Invalid ajax referer.', 'formello' ) );
			return true;
		}*/

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
	 * Set errors.
	 *
	 * @param string $error The action name.
	 */
	public function add_error( $error ) {
		$this->errors[] = $error;
	}

	/**
	 * Get the response
	 *
	 * @return array
	 */
	public function get_response() {
		$data = $this->to_array();

		$type = empty( $data['errors'] ) ? 'success' : 'error';

		$response = array(
			'hide_form' => (bool) $data['settings']['hide'],
			'errors' => $data['errors'],
			'message' => array(
				'type'   => $type,
				'text'   => $this->get_message( $type ),
			),
		);

		if ( ! empty( $data['settings']['redirect_url'] ) ) {
			$response['redirect_url'] = $data['settings']['redirect_url'];
		}

		if ( current_user_can( 'manage_options' ) && $this->is_debug() ) {
			$response['debug'] = $this->to_array();
		}

		return apply_filters( 'formello_form_response', $response );
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

}
