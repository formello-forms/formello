<?php
/**
 * Sanitize and validate form submission.
 *
 * @package Formello
 */

namespace Formello\Form;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use \Rakit\Validation\Validator;
use Formello\Log;
use Formello\TagReplacers\Replacer;

/**
 * Get defaults for our general options.
 *
 * @since 1.0.0
 */
class Response {

	/**
	 * The form ID
	 *
	 * @var Int
	 */
	protected $ID = 0;

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
	 * The constructor.
	 *
	 * @param int   $id The form id.
	 * @param array $settings The form settings.
	 * @param array $data The form data.
	 * @param array $errors The form errors.
	 */
	public function __construct( $id, $settings, $data, $errors ) {
		$this->ID = $id;
		$this->settings = $settings;
		$this->data = $data;
		$this->errors = $errors;
		$this->logger = Log::get_instance();
	}

	/**
	 * Get ID of form
	 *
	 * @return number
	 */
	public function get_id() {
		return $this->ID;
	}

	/**
	 * Get the response
	 *
	 * @param boolean $as_html Check for Html response.
	 * @return array
	 */
	public function get_response( $as_html = false ) {
		if ( $as_html ) {
			return $this->get_html_response();
		}

		return $this->to_array();
	}

	/**
	 * Get the response
	 *
	 * @return array
	 */
	public function to_array() {

		$type = $this->message_type();

		$response = array(
			'hide_form' => (bool) $this->settings['hide'],
			'errors' => $this->get_errors(),
			'message' => array(
				'type'   => $type,
				'text'   => $this->get_message( $type ),
			),
		);

		if ( ! empty( $this->settings['redirect_url'] ) ) {
			$response['redirect_url'] = $this->settings['redirect_url'];
		}

		if ( current_user_can( 'manage_options' ) && $this->is_debug() ) {
			$response['debug'] = $this->get_debug();
		}

		return apply_filters( 'formello_form_response', $response );
	}

	/**
	 * Get the response
	 *
	 * @return array
	 */
	public function get_html_response() {
		$type = $this->message_type();
		$response = sprintf(
			'<div class="formello-message %s"><p>%s</p>%s</div>',
			$type,
			$this->get_message( $type ),
			$this->error_list()
		);

		if ( $this->is_debug() ) {
			$response .= sprintf(
				'<div class="formello-debug"><p>%s</p><small>%s</small><pre>%s</pre></div>',
				__( 'Debug output', 'formello' ),
				__( 'This output is visible only to admin.', 'formello' ),
				wp_json_encode( $this->get_debug(), JSON_PRETTY_PRINT )
			);
		}

		return $response;
	}

	/**
	 * Get form as array
	 *
	 * @return array
	 */
	public function get_debug() {
		$debug = array();

		$debug['id']       = $this->ID;
		$debug['errors']   = $this->get_errors();
		$debug['settings'] = $this->settings;
		$debug['fields']   = $this->data['fields'];
		$debug['actions']  = empty( $this->data['actions'] ) ? array() : $this->data['actions'];

		return $debug;
	}

	/**
	 * Get form message
	 *
	 * @param string $code The code response.
	 * @return string
	 */
	private function get_message( $code ) {
		$message = isset( $this->settings['messages'][ $code ] ) ? $this->settings['messages'][ $code ] : 'error';

		$message = apply_filters( 'formello_form_message_' . $code, $message );
		return $message;
	}

	/**
	 * Get request details
	 */
	public function get_details() {
		$respose = array();
		// add details on response.
		$response['ip_address']   = ! empty( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$response['user_agent']   = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$response['referer_url']  = ! empty( $_SERVER['HTTP_REFERER'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '';
		$response['submitted_at'] = wp_date( 'Y-m-d H:i:s' );

		return $response;
	}

	/**
	 * Save form submission in DB.
	 */
	public function save() {
		if ( empty( $this->data['fields'] ) ) {
			return true;
		}

		if ( ! $this->settings['storeSubmissions'] ) {
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
		$data = array_merge( $data, $this->get_details() );

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
	 * Get form actions
	 *
	 * @return array
	 */
	public function get_actions() {
		return $this->data['actions'];
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
	 * Add log debug
	 *
	 * @param string $level The actions response.
	 * @param string $message The actions response.
	 * @param array  $context The actions response.
	 */
	public function log( $level, $message, $context = array() ) {
		$this->logger->log( $level, $message, $context );
	}

	/**
	 * Check if has errors
	 *
	 * @return boolean
	 */
	public function has_errors() {
		return ! empty( $this->errors );
	}

	/**
	 * Check if has errors
	 *
	 * @return boolean
	 */
	private function get_errors() {
		return $this->errors;
	}

	/**
	 * Check if has errors
	 *
	 * @return boolean
	 */
	private function message_type() {
		return empty( $this->errors ) ? 'success' : 'error';
	}

	/**
	 * Generate error list.
	 *
	 * @return string Html list
	 */
	private function error_list() {
		$out = '<ul>';
		foreach ( $this->errors as $key => $error ) {
			$out .= '<li>' . $error . '</li>';
		}
		$out .= '</ul>';
		return $out;
	}

}
