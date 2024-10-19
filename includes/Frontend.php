<?php
/**
 * Manage the frontend submissions.
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://www.francescopepe.com
 * @since      1.0.0
 *
 * @package    Formello
 * @subpackage Formello/includes
 */

namespace Formello;

/**
 * Frontend Pages Handler
 *
 * @since 1.0.0
 */
class Frontend {
	/**
	 * The ID of this plugin.
	 *
	 * @since    2.6.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    2.6.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 2.6.0
	 * @param string $plugin_name The name of this plugin.
	 * @param string $version     The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Listen for form submit
	 */
	public function listen_for_submit() {

		if ( ! check_ajax_referer( '_formello', '_formello', false ) ) {
			wp_send_json_error( array( 'message' => __( 'Wrong nonce', 'formello' ) ), 500 );
			wp_die();
		}

		if ( empty( $_POST['_formello_id'] ) ) {
			wp_send_json_error( array( 'message' => __( 'Missing ID', 'formello' ) ), 500 );
			wp_die();
		}

		$form_id = absint( $_POST['_formello_id'] );
		$form    = new \Formello\Processor\Form( $form_id );
		$form->validate();

		if ( $form->has_errors() ) {
			wp_send_json_error( $form->get_response() );
			wp_die();
		}

		$this->process_form( $form );

		$response = $form->get_response();

		if ( $form->has_errors() ) {
			wp_send_json_error( $response );
		}
		wp_send_json_success( $response );
		wp_die();
	}

	/**
	 * Listen for form submit
	 *
	 * @param Form $form The form object.
	 */
	public function process_form( $form ) {

		/**
		* General purpose hook that runs before all form actions, so we can still modify the submission object that is passed to actions.
		*/
		do_action( 'formello_process_form', $form );

		// save submission object so that other form processor have an insert ID to work with (eg file upload).
		$form->save();

		$actions = $form->get_actions();

		// process form actions asynchronously.
		if ( isset( $actions ) ) {
			foreach ( $actions as $action_settings ) {
				/**
				 * Processes the specified form action and passes related data.
				 *
				 * @param array $action_settings
				 * @param Form $form
				 */
				if ( $action_settings['async'] && ! $form->is_debug() ) {
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
