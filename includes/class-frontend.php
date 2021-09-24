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
	 * Class instance.
	 *
	 * @access private
	 * @var $instance Class instance.
	 */
	private static $instance;

	/**
	 * Initiator
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

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

		// only respond to AJAX requests with _formello_id set.
		if ( empty( $_POST['_formello_id'] )
			|| empty( $_SERVER['HTTP_X_REQUESTED_WITH'] )
			|| strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) !== strtolower( 'XMLHttpRequest' ) ) {
			return;
		}

		$form = new Form( absint( $_POST['_formello_id'] ) );
		$submission = new Processor( $form );

		$result = $submission->process();

		$form->populate_with_data( $result );
		if ( empty( $result['errors'] ) ) {
			$form->save();
			$this->process_form( $form );
		}

		$response = $this->get_response( $form );

		wp_send_json( $response, 200 );
		wp_die();

	}

	/**
	 * Listen for form submit
	 *
	 * @param Form $form The form object.
	 */
	public function process_form( Form $form ) {

		$form_settings = $form->get_settings();

		// save submission object so that other form processor have an insert ID to work with (eg file upload).
		if ( $form_settings['storeSubmissions'] ) {
			$form->save();
		}

		/**
		* General purpose hook that runs before all form actions, so we can still modify the submission object that is passed to actions.
		*/
		do_action( 'formello_process_form', $form );

		// process form actions.
		if ( isset( $form_settings['actions'] ) ) {

			foreach ( $form_settings['actions'] as $action_settings ) {
				/**
				 * Processes the specified form action and passes related data.
				 *
				 * @param Form $form
				 * @param array $action_settings
				 */
				do_action( 'formello_process_form_action_' . $action_settings['type'], $form, $action_settings );
			}
		}

		/**
		 * General purpose hook after all form actions have been processed for this specific form. The dynamic portion of the hook refers to the form slug.
		 *
		 * @param Form $form
		 */
		do_action( "formello_form_{$form->ID}_success", $form );

		/**
		 * General purpose hook after all form actions have been processed.
		 *
		 * @param Form $form
		 */
		do_action( 'formello_form_success', $form );

	}

	/**
	 * Get the response
	 *
	 * @param int   $error_code The error code number.
	 * @param Form  $form The form.
	 * @param Data $data The input data.
	 * @return array
	 */
	private function get_response( Form $form ) {

		$data = $form->to_array();

		// return success response for empty error code string or spam (to trick bots).
		if ( empty( $data['errors'] ) ) {
			$response = array(
				'message'   => array(
					'type' => 'success',
					'text' => $form->get_message( 'success' ),
				),
				'hide_form' => (bool) $data['settings']['hide'],
			);

			if ( ! empty( $data['redirect_url'] ) ) {
				$response['redirect_url'] = $data['settings']['redirectUrl'];
			}

			if( current_user_can('manage_options') && $form->is_debug() ){
				$response['debug'] = $data['debug'];
			}

			return apply_filters( 'formello_form_response', $response );
		}

		// return error response.
		return array(
			'message' => array(
				'type'   => 'error',
				'text'   => $form->get_message( 'error' ),
				'errors' => $data['errors'],
				'debug'  => current_user_can('manage_options') ? $data['debug'] : ''
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
