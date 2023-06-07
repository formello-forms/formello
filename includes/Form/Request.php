<?php
/**
 * Sanitize and validate form submission and return a Response.
 *
 * @package Formello
 */

namespace Formello\Form;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Formello\Log;
use Formello\Utils\formello_default_options;

/**
 * Get defaults for our general options.
 *
 * @since 1.0.0
 */
class Request {
	use RequestTrait;

	/**
	 * The configuration data.
	 *
	 * @var array
	 */
	protected $config = array();

	/**
	 * The data submitted.
	 *
	 * @var array
	 */
	protected $data = array();

	/**
	 * The constructor.
	 *
	 * @param int $id The form id.
	 */
	public function __construct( $id = 0 ) {

		if ( ! empty( $id ) ) {
			$this->config['settings'] = get_option( 'formello', \Formello\Utils\formello_default_options() );
			$this->config['ID']       = $id;			
			$this->config['actions']  = get_post_meta( $id, '_formello_actions', true );
			$this->data['fields']     = array();
			$this->data['actions']    = array();
			$this->data['errors']     = array();

			$settings      = get_post_meta( $id, '_formello_settings', true );
			$form_settings = $this->parse_settings( $settings );

			$this->config['form'] = $form_settings;

			$this->logger = Log::get_instance();
		}

	}

	/**
	 * Process data
	 *
	 * @return Formello\Form\Response
	 */
	public function submit() {

		$validator = new Validator( $this->data, $this->config );
		// Validate.
		$validator->validate();

		// Not spam and sanitized, we can validate.
		if ( ! $validator->has_errors() ) {
			// Populate actions with cleaned up data.
			$this->populate_actions();
		} else {
			$this->data['errors'] = $validator->get_errors();
		}
		$this->data['fields'] = $validator->get_fields();
	}

	/**
	 * Populate actions
	 */
	public function populate_actions() {

		$form_actions = $this->config['actions'];

		if ( isset( $form_actions ) ) {
			foreach ( $form_actions as $action_settings ) {
				$this->data['actions'][] = $this->recursive_actions( $action_settings );
			}
		}

	}

	/**
	 * Recursive sanitation for an array
	 *
	 * @param array $actions The actions to sanitize.
	 *
	 * @return mixed
	 */
	private function recursive_actions( $actions ) {

		foreach ( $actions as $key => &$value ) {
			if ( is_array( $value ) ) {

				$value = $this->recursive_actions( $value );

			} elseif ( is_string( $value ) ) {

				$value = $this->replace_tags( $value );

			}
		}

		return $actions;
	}

	/**
	 * Save form submission in DB.
	 */
	public function save() {
		if ( empty( $this->data['fields'] ) ) {
			return true;
		}

		if ( ! $this->get_form_setting('storeSubmissions') ) {
			return true;
		}

		global $wpdb;

		$values = array();
		$placeholder = array();
		$submissions_table = $wpdb->prefix . 'formello_submissions';
		$submissions_meta_table = $wpdb->prefix . 'formello_submissions_meta';
		$form_id = $this->get_id();

		$fields = $this->data['fields'];
		$no_store_fields = apply_filters( 'formello_response_nostorefields', array( 'field' => 'password' ) );
		// Remove password, we don't store it.
		$allowed_fields = array_intersect_key(
			$fields,
			array_diff( $this->get_form_setting('fields'), $no_store_fields ),
		);

		$data = array(
			'data'    => wp_json_encode( $allowed_fields ),
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
		foreach ( $fields as $key => $value ) {
			array_push( $values, $form_id, $this->submission_id, $key, maybe_serialize( $value ) );
			$place_holders[] = "('%d', '%d', '%s', '%s')";
		}
		$sql = implode( ',', $values );

		$query = 'INSERT INTO ' . $wpdb->prefix . 'formello_submissions_meta (form_id, submission_id, field_name, field_value ) VALUES ';
		$query .= implode( ', ', $place_holders );

		//phpcs:ignore
		$wpdb->query( $wpdb->prepare( $query, $values ) );

		$formello_result = get_transient( 'formello_news' );
		set_transient( 'formello_news', $formello_result + 1, DAY_IN_SECONDS );

	}

	/**
	 * Get the response
	 *
	 * @param boolean $as_html Check for Html response.
	 * @return array
	 */
	public function get_response( $as_html = false ) {
		$response = new Response( $this->data, $this->config );

		return $response->get_response( $as_html );
	}

}
