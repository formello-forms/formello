<?php
/**
 * Form Controller
 *
 * @package Formello
 */

namespace Formello\Form;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Form Controller
 *
 * @since 1.0.0
 */
class Controller {

	/**
	 * Class instance.
	 *
	 * @access private
	 * @var $instance Class instance.
	 */
	private static $instance;

	/**
	 * The request.
	 *
	 * @access private
	 * @var $request Store the request.
	 */
	private $request;

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
		add_action( 'wp', array( $this, 'listen_for_submit' ) );
		add_filter( 'render_block', array( $this, 'form_response' ), 10, 2 );
		add_action( 'wp_ajax_formello', array( $this, 'listen_for_ajax_submit' ) );
		add_action( 'wp_ajax_nopriv_formello', array( $this, 'listen_for_ajax_submit' ) );
	}

	/**
	 * Listen for form submit
	 */
	public function listen_for_submit() {

		// If empty skip.
		// phpcs:ignore
		if ( empty( $_POST['_formello_id'] ) ) {
			return;
		}

		// phpcs:ignore
		$form_id = absint( $_POST['_formello_id'] );
		$this->request = new Request( $form_id );

		$req = $this->request->submit();

		if ( ! $req->has_errors() ) {
			// It's valid! We can proceed with actions.
			$this->process_form( $req );

			$anchor = add_query_arg(
				array(
					'formello' => $form_id . '#formello-message-' . $form_id,
				),
				home_url( $_SERVER['REQUEST_URI'] )
			);

			wp_safe_redirect( esc_url( $anchor ) );
			exit;
		};

	}

	/**
	 * Listen for form submit
	 */
	public function listen_for_ajax_submit() {

		if ( ! check_ajax_referer( '_formello', '_formello', false ) ) {
			wp_send_json_error( __( 'Invalid ajax referer.', 'formello' ), 500 );
			return true;
		}

		// only respond to AJAX requests with _formello_id set.
		// phpcs:ignore
		if ( empty( $_POST['_formello_id'] )
			|| empty( $_SERVER['HTTP_X_REQUESTED_WITH'] )
			|| strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ) !== strtolower( 'XMLHttpRequest' ) ) {
			wp_send_json_error( __( 'Missing form id', 'formello' ), 500 );
			wp_die();
		}

		// phpcs:ignore
		$form_id = absint( $_POST['_formello_id'] );
		$this->request = new Request( $form_id );

		$req = $this->request->submit();

		if ( $req->has_errors() ) {
			$req->log( 'debug', 'Not validated:', $req->get_response() );
			wp_send_json( $req->get_response() );
			wp_die();

		};

		// It's valid! We can proceed.
		$this->process_form( $req );

		wp_send_json( $req->get_response(), 200 );
		wp_die();

	}

	/**
	 * Listen for form submit
	 *
	 * @param Formello\Form\Response $response The formello response.
	 */
	public function process_form( $response ) {

		$form_settings = $this->request->get_settings();

		/**
		* General purpose hook that runs before all form actions, so we can still modify the submission object that is passed to actions.
		*/
		do_action( 'formello_process_form', $response );

		// save submission object so that other form processor have an insert ID to work with (eg file upload).
		if ( $form_settings['storeSubmissions'] ) {
			$response->save();
		}

		$actions = $response->get_actions();

		$response->log( 'debug', 'Actions to run:', $actions );

		// process form actions asynchronously.
		if ( isset( $actions ) ) {
			foreach ( $actions as $action_settings ) {
				/**
				 * Processes the specified form action and passes related data.
				 *
				 * @param array $action_settings
				 * @param Form $response
				 */
				if ( $action_settings['async'] && ! $response->get_setting( 'debug' ) ) {
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
						$response // We pass form here because not async action need to access to form data.
					);
				}
			}
		}

		/**
		 * General purpose hook after all form actions have been processed for this specific form. The dynamic portion of the hook refers to the form ID.
		 *
		 * @param Form $response
		 */
		do_action( "formello_form_{$response->get_id()}_success", $response );

		/**
		 * General purpose hook after all form actions have been processed.
		 *
		 * @param Form $response
		 */
		do_action( 'formello_form_success', $response );
	}

	/**
	 * Output HTML form response.
	 *
	 * @param  string $content The html content.
	 * @param  array  $block   The block data.
	 *
	 * @return string          The html result.
	 */
	public function form_response( $content, $block ) {
		if ( 'formello/form' !== $block['blockName'] ) {
			return $content;
		}
		$id = 0;
		if ( class_exists( '\WP_HTML_Tag_Processor' ) ) {
			$form = new \WP_HTML_Tag_Processor( $content );

			if ( $form->next_tag( array( 'tag_name' => 'form' ) ) ) {
				$id = $form->get_attribute( 'data-id' );
			}
		}
		// phpcs:ignore
		if ( empty( $this->request ) && isset( $_GET['formello'] ) && $_GET['formello'] === $id ) {
			$response = sprintf(
				'<div class="formello-message success" id="%s"><p>%s</p></div>',
				'formello-message-' . $id,
				! isset( $block['attrs']['successMessage'] ) ? 'Thanks for submitting this form.' : $block['attrs']['successMessage'],
			);
			return $content . $response;
		}
		if ( ! empty( $this->request ) && (int) $id === $this->request->get_id() ) {
				return $content . $this->request->get_response( true )->get_html_response();
		}
		return $content;
	}

}
Controller::get_instance();
