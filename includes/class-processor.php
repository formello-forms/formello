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
class Processor {

	/**
	 * Form ID
	 *
	 * @var Int
	 */
	private $form;

	/**
	 * The ignored fields array
	 *
	 * @var array
	 */
	private $ignored_field_names;

	/**
	 * The data array
	 *
	 * @var array
	 */
	private $data = array();

	/**
	 * The actions array
	 *
	 * @var array
	 */
	private $actions = array();

	/**
	 * Debug
	 *
	 * @var Array
	 */
	private $debug = array();

	/**
	 * Details of submission
	 *
	 * @var array
	 */
	private $details = array();

	/**
	 * Date submitted
	 *
	 * @var mixed
	 */
	private $errors = array();

	/**
	 * Constructor
	 *
	 * @param Form  $form The form object.
	 * @param Array $ignored_field_names The fields to ignore.
	 */
	public function __construct( Form $form, $ignored_field_names = array() ) {
		$this->form = $form;
	}

	/**
	 * Process data
	 *
	 * @return array
	 */
	public function process() {

		// First check if is a spam request.
		if ( $this->is_spam() ) {
			$this->add_error( __( 'Probably a spam request.', 'formello' ) );
			return $this->response();
		}

		// Not spam, we can validate.
		if ( ! $this->is_valid() ) {
			return $this->response();
		}

		/**
		* Filters the field names that should be ignored on the Submission object.
		* Fields starting with an underscore (_) are ignored by default.
		*
		* @param array $names
		*/
		$this->ignored_field_names = apply_filters( 'formello_ignored_field_names', array( 'action', 'g-recaptcha-response' ) );

		// filter out ignored field names.
		foreach ( $_POST as $key => $value ) {

			if ( ! in_array( $key, $this->form->get_fields(), true ) ) {
				continue;
			};
			$this->data[ sanitize_key( $key ) ] = $this->sanitize( $value );
		}

		// add details on response.
		$this->details['ip_address']   = ! empty( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$this->details['user_agent']   = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$this->details['referer_url']  = ! empty( $_SERVER['HTTP_REFERER'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '';
		$this->details['submitted_at'] = gmdate( 'Y-m-d H:i:s' );

		$form_actions = $this->form->get_actions();

		if ( isset( $form_actions ) ) {
			foreach ( $form_actions as $action_settings ) {
				$this->actions[] = $this->recursive_actions( $action_settings );
			}
			$this->form->set_actions( $this->actions );
		}

		return $this->response();
	}

	/**
	 * Sanitize array with values before saving. Can be called recursively.
	 *
	 * @param mixed $value the value to sanitize.
	 * @return mixed
	 */
	public function sanitize( $value ) {
		if ( is_string( $value ) ) {
			// do nothing if empty string.
			if ( '' === $value ) {
				return $value;
			}

			// strip slashes.
			$value = stripslashes( $value );

			// strip all whitespace.
			$value = trim( $value );

			// convert &amp; back to &.
			$value = html_entity_decode( $value, ENT_NOQUOTES );
			$value = $this->replace_tags( $value );

		} elseif ( is_array( $value ) || is_object( $value ) ) {
			$new_value = array();
			$vars      = is_array( $value ) ? $value : get_object_vars( $value );

			// do nothing if empty array or object.
			if ( count( $vars ) === 0 ) {
				return $value;
			}

			foreach ( $vars as $key => $sub_value ) {
				// strip all whitespace & HTML from keys (!).
				$key = trim( wp_strip_all_tags( $key ) );

				// sanitize sub value.
				$new_value[ $key ] = $this->sanitize( $sub_value );
				$new_value[ $key ] = $this->replace_tags( $sub_value );
			}

			$value = is_object( $value ) ? (object) $new_value : $new_value;
		}

		return $value;
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
	 * @param Form  $form The form.
	 * @param array $data Form data.
	 * @return string
	 */
	private function validate_recaptcha() {

		$settings = get_option( 'formello', formello_get_option_defaults() );

		$captcha_postdata = http_build_query(
			array(
				'secret'   => $settings['recaptcha']['secret_key'],
				'response' => $_POST['g-recaptcha-response'],
				'remoteip' => isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '',
			)
		);

		$captcha_opts = array(
			'http' => array(
				'method'  => 'POST',
				'header'  => 'Content-type: application/x-www-form-urlencoded',
				'content' => $captcha_postdata,
			),
		);

		$captcha_context  = stream_context_create( $captcha_opts );
		$captcha_response = json_decode( wp_remote_get( 'https://www.google.com/recaptcha/api/siteverify', false, $captcha_context ), true );

		return $captcha_response['success'];
	}


	/**
	 * Form validation
	 *
	 * @param Form  $form The form.
	 * @param array $data Form data.
	 * @return boolean
	 */
	public function is_valid() {

		$errors = array();

		// perform validation.
		$validator = new Validator();
		$validation = $validator->make( $_POST, $this->form->get_constraints() );

		// then validate.
		$validation->validate();

		if ( $validation->fails() ) {
			// handling errors.
			$errors = $validation->errors()->all(':message');

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
		$errors = apply_filters( 'formello_validate_form_' . $this->form->get_id(), $errors, $this->form );

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
		$errors = apply_filters( 'formello_validate_form', $errors, $this->form );

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
	 * @param Int   $id The form ID.
	 * @param array $settings Form data.
	 * @return string
	 */
	public function is_spam() {

		// validate honeypot field.
		$honeypot_key = sprintf( '_formello_h%d', $this->form->get_id() );

		if ( ! isset( $_POST[ $honeypot_key ] ) || '' !== $_POST[ $honeypot_key ] ) {
			return true;
		}

		// validate recaptcha.
		if ( $this->get_settings( 'recaptchaEnabled' ) && isset( $_POST['g-recaptcha-response'] ) && empty( $_POST['g-recaptcha-response'] ) ) {
			return true;
		}

		// validate recaptcha.
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
	 * @return array
	 */
	public function get_data() {
		return $this->data;
	}

	/**
	 * Get a Data array.
	 *
	 * @return array
	 */
	public function get_debug() {
		return $this->debug;
	}

	/**
	 * Get a Data array.
	 *
	 * @param string $type The action name.
	 * @param array  $data The array of data.
	 */
	public function set_debug( $type, $data = array() ) {
		$this->debug[ $type ][] = $data;
	}

	/**
	 * Get a Data array.
	 *
	 * @param string $type The action name.
	 * @param array  $data The array of data.
	 */
	public function get_settings( $setting ) {
		$form_settings = $this->form->get_settings();
		return $form_settings[ $setting ];
	}

	/**
	 * Get a Data array.
	 *
	 * @param string $type The action name.
	 * @param array  $data The array of data.
	 */
	public function add_error( $error ) {
		$this->errors[] = $error;
	}

	/**
	 * Get a Data array.
	 *
	 * @param string $type The action name.
	 * @param array  $data The array of data.
	 */
	public function response() {
		return array(
			'errors'  => $this->errors,
			'data' 	  => $this->data,
			'details' => $this->details,
		);
	}

	/**
	 * Get a clean Data array.
	 */
	public function clean() {

		// filter out ignored field names.
		foreach ( $this->data as $key => $value ) {
			if ( '_' === $key[0] || in_array( $key, $this->ignored_field_names, true ) ) {
				unset( $this->data[ $key ] );
				continue;
			}

			// this detects the WPBruiser token field to ensure it isn't stored
			// CAVEAT: this will detect any non-uppercase string with 2 dashes in the field name and no whitespace in the field value.
			if ( class_exists( 'GoodByeCaptcha' ) && is_string( $key ) && is_string( $value ) && strtoupper( $key ) !== $key && substr_count( $key, '-' ) >= 2 && substr_count( trim( $value ), ' ' ) === 0 ) {
				unset( $this->data[ $key ] );
				continue;
			}
		}

	}

	/**
	 * Recursive sanitation for an array
	 * 
	 * @param $actions
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
