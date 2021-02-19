<?php
/**
 * Manage the frontend submissions.
 *
 * @package Formello
 */

namespace Formello;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Formello\Rakit\Validation\Validator;

/**
 * Frontend Pages Handler
 *
 * @since 1.0.0
 */
class Frontend {

	/**
	 * Validator
	 *
	 * @var $validator
	 */
	private $validator;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->validator = new Validator();

		add_action( 'wp_post_formello', array( $this, 'listen_for_submit' ) );
		add_action( 'wp_post_nopriv_formello', array( $this, 'listen_for_submit' ) );
		add_action( 'wp_ajax_formello', array( $this, 'listen_for_submit' ) );
		add_action( 'wp_ajax_nopriv_formello', array( $this, 'listen_for_submit' ) );
	}

	/**
	 * Listen for form submit
	 */
	public function listen_for_submit() {

		// only respond to AJAX requests with _formello_form_id set.
		if ( empty( $_POST['_formello_id'] ) ) {
			return;
		}

		$form_id = (int) $_POST['_formello_id'];
		$form    = new Form( $form_id );

		/**
		* Filters the field names that should be ignored on the Submission object.
		* Fields starting with an underscore (_) are ignored by default.
		*
		* @param array $names
		*/
		$ignored_field_names = apply_filters( 'formello_ignored_field_names', array( 'action' ) );

		// sanitize data: strip tags etc.
		$store = new Data( $form_id, $ignored_field_names );
		$data  = $store->get_data();

		// perform validation on sanitized data.
		$error_code = $this->validate_form( $form, $data );

		if ( empty( $error_code ) ) {

			// save submission object so that other form processor have an insert ID to work with (eg file upload).
			if ( $form->settings['storeSubmissions'] ) {
				$store->save();
			}

			/**
			* General purpose hook that runs before all form actions, so we can still modify the submission object that is passed to actions.
			*/
			do_action( 'formello_process_form', $form, $store );

			// process form actions.
			if ( isset( $form->settings['actions'] ) ) {
				foreach ( $form->settings['actions'] as $action_settings ) {
					/**
					 * Processes the specified form action and passes related data.
					 *
					 * @param array $action_settings
					 * @param Submission $store
					 * @param Form $form
					 */
					do_action( 'formello_process_form_action_' . $action_settings['type'], $action_settings['settings'], $store, $form );
				}
			}

			/**
			 * General purpose hook after all form actions have been processed for this specific form. The dynamic portion of the hook refers to the form slug.
			 *
			 * @param Submission $store
			 * @param Form $form
			 */
			do_action( "formello_form_{$form->slug}_success", $store, $form );

			/**
			 * General purpose hook after all form actions have been processed.
			 *
			 * @param Submission $store
			 * @param Form $form
			 */
			do_action( 'formello_form_success', $store, $form );
		} else {
			/**
			 * General purpose hook for when a form error occurred
			 *
			 * @param string $error_code
			 * @param Form $form
			 * @param array $data
			 */
			do_action( 'formello_form_error', $error_code, $form, $data );
		}

		$response = $this->get_response_for_error_code( $error_code, $form, $data );

		wp_send_json( $response, 200 );
		wp_die();

	}

	/**
	 * Form validation
	 *
	 * @param Form  $form The form.
	 * @param array $data Form data.
	 * @return string
	 */
	public function validate_form( Form $form, array $data ) {

		// validate honeypot field.
		$honeypot_key = sprintf( '_formello_h%d', $form->ID );
		if ( ! isset( $data[ $honeypot_key ] ) || '' !== $data[ $honeypot_key ] ) {
			return 'spam';
		}
		// validate recaptcha.
		if ( isset( $data['g-recaptcha-response'] ) ) {
			$captcha_validate = $this->validate_recaptcha( $form, $data );
		}

		if ( isset( $captcha_validate ) && ( false === $captcha_validate ) ) {
			return array( 'captcha' => 'invalid captcha' );
		}

		// perform validation.
		$validation = $this->validator->make( $data, $form->constraints );

		// then validate.
		$validation->validate();

		if ( $validation->fails() ) {
			// handling errors.
			$errors = $validation->errors();

			return $errors->firstOfAll();

		}

		$error_code = '';

		/**
		 * This filter allows you to perform your own form validation. The dynamic portion of the hook refers to the form slug.
		 *
		 * Return a non-empty string if you want to raise an error.
		 * Error codes with a specific error message are: "required_field_missing", "invalid_email", and "error"
		 *
		 * @param string $error_code
		 * @param Form $form
		 * @param array $data
		 */
		$error_code = apply_filters( 'formello_validate_form_' . $form->id, $error_code, $form, $data );

		/**
		 * This filter allows you to perform your own form validation.
		 *
		 * Return a non-empty string if you want to raise an error.
		 * Error codes with a specific error message are: "required_field_missing", "invalid_email", and "error"
		 *
		 * @param string $error_code
		 * @param Form $form
		 * @param array $data
		 */
		$error_code = apply_filters( 'formello_validate_form', $error_code, $form, $data );

		if ( ! empty( $error_code ) ) {
			return $error_code;
		}

		// all good: no errors!
		return '';
	}

	/**
	 * ReCaptcha validation
	 *
	 * @param Form  $form The form.
	 * @param array $data Form data.
	 * @return string
	 */
	private function validate_recaptcha( $form, $data ) {

		$captcha_postdata = http_build_query(
			array(
				'secret'   => $form->settings['recaptcha']['secret_key'],
				'response' => $data['g-recaptcha-response'],
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
	 * Get the response
	 *
	 * @param int   $error_code The error code number.
	 * @param Form  $form The form.
	 * @param array $data The input data.
	 * @return array
	 */
	private function get_response_for_error_code( $error_code, Form $form, $data = array() ) {
		// return success response for empty error code string or spam (to trick bots).
		if ( '' === $error_code || 'spam' === $error_code ) {
			$response = array(
				'message'   => array(
					'type' => 'success',
					'text' => $form->get_message( 'success' ),
				),
				'hide_form' => (bool) $form->settings['hide'],
			);

			if ( ! empty( $form->settings['redirect_url'] ) ) {
				$response['redirect_url'] = formello_replace_data_variables( $form->settings['redirectUrl'], $data, 'urlencode' );
			}

			return apply_filters( 'formello_form_response', $response, $form, $data );
		}

		// get error message.
		$message = $form->get_message( 'error' );
		if ( empty( $message ) ) {
			$message = $form->get_message( 'error' );
		}

		// return error response.
		return array(
			'message' => array(
				'type'   => 'warning',
				'text'   => $message,
				'errors' => $error_code,
			),
		);
	}

	/*
	private function processUploads( $file, $form_id ){

		// Define data.
		$file_name            = sanitize_file_name( $file['name'] );
		$file_ext             = pathinfo( $file_name, PATHINFO_EXTENSION );
		$file_base            = wp_basename( $file_name, ".$file_ext" );
		$file_name_new        = sprintf( '%s-%s.%s', $file_base, wp_hash( $file_name . uniqid() . $form_id ), strtolower( $file_ext ) );
		$uploads              = wp_upload_dir();
		$formello_uploads_root = trailingslashit( $uploads['basedir'] ) . 'formello';

		// Add filter to allow redefine store directory.
		$custom_uploads_root = apply_filters( 'formello_upload_root', $formello_uploads_root );
		if ( wp_is_writable( $custom_uploads_root ) ) {
			$formello_uploads_root = $custom_uploads_root;
		}

		$form_directory       = absint( $form_id ) . '-' . md5( $form_id );
		$formello_uploads_form = trailingslashit( $formello_uploads_root ) . $form_directory;
		$file_new             = trailingslashit( $formello_uploads_form ) . $file_name_new;
		$file_url             = trailingslashit( $uploads['baseurl'] ) . 'formello/' . trailingslashit( $form_directory ) . $file_name_new;
		$attachment_id        = '0';

		// Check for form upload directory destination.
		if ( ! file_exists( $formello_uploads_form ) ) {
			wp_mkdir_p( $formello_uploads_form );
		}

		// Check if the index.html exists in the root uploads director, if not create it.
		if ( ! file_exists( trailingslashit( $formello_uploads_root ) . 'index.html' ) ) {
			file_put_contents( trailingslashit( $formello_uploads_root ) . 'index.html', '' );
		}

		// Check if the index.html exists in the form uploads director, if not create it.
		if ( ! file_exists( trailingslashit( $formello_uploads_form ) . 'index.html' ) ) {
			file_put_contents( trailingslashit( $formello_uploads_form ) . 'index.html', '' );
		}

		// Move the file to the uploads dir - similar to _wp_handle_upload().
		$move_new_file = @move_uploaded_file( $file['tmp_name'], $file_new );

		// Set correct file permissions.
		$stat  = stat( dirname( $file_new ) );
		$perms = $stat['mode'] & 0000666;
		@ chmod( $file_new, $perms );

	}
	*/
}
