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

use Formello\Rakit\Validation\Validator;
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
	 * The form messages
	 *
	 * @var array
	 */
	protected $messages = array();

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
			$this->ID       = $id;
			$this->settings = get_post_meta( $id, '_formello_settings', true );
			$this->logger   = Log::get_instance();
		}

		$this->messages = array(
			'success' => empty( $this->settings['messages']['success'] ) ? __( 'Thanks for submitting this form.', 'formello' ) : $this->settings['messages']['success'],
			'error'   => empty( $this->settings['messages']['error'] ) ? __( 'Ops. An error occurred.', 'formello' ) : $this->settings['messages']['error'],
			'spam'    => __( 'Go away spammer.', 'formello' ),
		);
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
	 * Insert form in DB
	 *
	 * @param array $data The form sanitized data.
	 */
	public function populate_with_data( $data ) {
		$this->data    = $data['fields'];
		$this->details = $data['details'];
		$this->actions = $data['actions'];
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
	 * Get form settings
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
	 * Get form fields
	 *
	 * @return array
	 */
	public function get_fields() {
		$fields = array();
		foreach ( $this->settings['fields'] as $key => $value ) {
			$fields[ sanitize_key( $key ) ] = $value;
		}
		return $fields;
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
		$this->data['actions'] = $actions;
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
		$message = isset( $this->messages[ $code ] ) ? $this->messages[ $code ] : '';

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

		$query = 'INSERT INTO ' . $wpdb->prefix . 'formello_submissions_meta (form_id, submission_id, field_name, field_value) VALUES ';
		$query .= implode( ', ', $place_holders );

		$wpdb->query( $wpdb->prepare( $query, $values ) );

	}

	/**
	 * Get form as array
	 *
	 * @return array
	 */
	public function to_array() {
		$form = array();

		$form['id']       = $this->ID;
		$form['details']  = $this->data['details'];
		$form['actions']  = $this->data['actions'];
		$form['fields']   = $this->data['fields'];
		$form['errors']   = $this->errors;
		$form['messages'] = $this->messages;
		$form['settings'] = $this->settings;

		return $form;
	}

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
        $posted_values = array_intersect_key($_POST, $this->get_fields());

		// filter out ignored field names.
		foreach ( $posted_values as $key => $value ) {
			$this->data['fields'][ sanitize_key( $key ) ] = $this->sanitize( $key, $value );
		}

		// add details on response.
		$this->data['details']['ip_address']   = ! empty( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$this->data['details']['user_agent']   = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$this->data['details']['referer_url']  = ! empty( $_SERVER['HTTP_REFERER'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '';
		$this->data['details']['submitted_at'] = gmdate( 'Y-m-d H:i:s' );

		$form_actions = $this->get_setting( 'actions' );

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

		// perform validation.
		$validator = new Validator();
        // phpcs:ignore
        $validation = $validator->make($_POST, $this->get_constraints());

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

		if ( ! wp_verify_nonce( $_POST['_formello'], '_formello' ) ) {
			return true;
		}

		if ( ! isset( $_POST[ $honeypot_key ] ) || '' !== $_POST[ $honeypot_key ] ) {
			return true;
		}

		// validate recaptcha.
		if ( $this->get_setting( 'recaptchaEnabled' ) && isset( $_POST['g-recaptcha-response'] ) && empty( $_POST['g-recaptcha-response'] ) ) {
			return true;
		}

		// validate recaptcha.
		if ( isset( $_POST['g-recaptcha-response'] ) && empty( $_POST['g-recaptcha-response'] ) ) {
			return true;
		}

		// validate recaptcha.
		if ( $this->get_setting( 'recaptchaEnabled' ) ) {
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
	 * @param string $error The action name.
	 */
	private function add_error( $error ) {
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

		if ( ! empty( $data['redirect_url'] ) ) {
			$response['redirect_url'] = $data['settings']['redirectUrl'];
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
}
