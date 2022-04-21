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

use Formello\Form;

/**
 * Frontend Pages Handler
 *
 * @since 1.0.0
 */
class Frontend {

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
		// phpcs:ignore
		if ( empty( $_POST['_formello_id'] )
			|| empty( $_SERVER['HTTP_X_REQUESTED_WITH'] )
			|| strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) !== strtolower( 'XMLHttpRequest' ) ) {
			return;
		}

		// phpcs:ignore
		$form_id = absint( $_POST['_formello_id'] );
		$form = new Form( $form_id );

		if ( ! $form->validate() ) {
			wp_send_json( $form->get_response() );
			wp_die();
		};

		$this->process_form( $form );

		$response = $form->get_response();

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

		$actions = $form->get_actions();

		// process form actions asynchronously.
		if ( isset( $actions ) ) {

			foreach ( $actions as $action_settings ) {
				/**
				 * Processes the specified form action and passes related data.
				 *
				 * @param Form $form
				 * @param array $action_settings
				 */
				//do_action( 'formello_process_form_action_' . $action_settings['type'], $action_settings );
				wp_schedule_single_event( time() + 60, 'formello_process_form_action_' . $action_settings['type'], array( 'action_settings' => $action_settings ), true );
			}
		}

		/**
		 * General purpose hook after all form actions have been processed for this specific form. The dynamic portion of the hook refers to the form slug.
		 *
		 * @param Form $form
		 */
		do_action( "formello_form_{$form->get_id()}_success", $form );

		/**
		 * General purpose hook after all form actions have been processed.
		 *
		 * @param Form $form
		 */
		do_action( 'formello_form_success', $form );

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
Frontend::get_instance();
