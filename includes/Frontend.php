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
		add_action( 'wp_ajax_formello', array( $this, 'listen_for_submit' ) );
		add_action( 'wp_ajax_nopriv_formello', array( $this, 'listen_for_submit' ) );
	}

	/**
	 * Listen for form submit
	 */
	public function listen_for_submit() {

		// only respond to AJAX requests with _formello_id set.
        // phpcs:ignore
        if (empty($_POST['_formello_id'])
			|| empty( $_SERVER['HTTP_X_REQUESTED_WITH'] )
			|| strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) !== strtolower( 'XMLHttpRequest' ) ) {
			wp_send_json_error( __( 'Missing form id', 'formello' ), 500 );
			wp_die();
		}

        // phpcs:ignore
        $form_id = absint( $_POST['_formello_id'] );
		$form = new Form( $form_id );

		if ( ! $form->validate() ) {
			$form->log( 'debug', 'Not validated:', $form->to_array() );
			wp_send_json( $form->get_response() );
			wp_die();
		};

		$this->process_form( $form );
		$form->log( 'debug', 'Form sent:', $form->to_array() );

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

		/**
		* General purpose hook that runs before all form actions, so we can still modify the submission object that is passed to actions.
		*/
		do_action( 'formello_process_form', $form );

		// save submission object so that other form processor have an insert ID to work with (eg file upload).
		if ( $form_settings['storeSubmissions'] ) {
			$form->save();
		}

		$actions = $form->get_actions();

		$form->log( 'debug', 'Actions to run:', $actions );

		// process form actions asynchronously.
		if ( isset( $actions ) ) {
			foreach ( $actions as $action_settings ) {
				/**
				 * Processes the specified form action and passes related data.
				 *
				 * @param array $action_settings
				 * @param Form $form
				 */
				if ( $action_settings['async'] ) {
					wp_schedule_single_event(
						time() + 60,
						'formello_process_form_action_' . $action_settings['type'],
						array( 'action_settings' => $action_settings ),
						true
					);
				} else {
					do_action(
						'formello_process_form_action_' . $action_settings['type'],
						$action_settings,
						$form
					);
				}
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

}
Frontend::get_instance();
