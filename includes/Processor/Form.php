<?php
/**
 * Set our block attribute defaults.
 *
 * @package formello
 */

namespace Formello\Processor;

use function Formello\Utils\formello_default_options as default_options;

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
	 * The form settings
	 *
	 * @var array
	 */
	protected $settings = array();

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
		if ( ! empty( $id ) ) {
			$this->ID       = $id;
			$this->settings = $this->get_settings( $id );
			$this->actions  = get_post_meta( $id, '_formello_actions', true );
		}
	}

	/**
	 * Set settings.
	 *
	 * @param [type] $id The form ID.
	 * @return array
	 */
	private function get_settings( $id ) {
		$default = array(
			'debug' => false,
			'hide' => true,
			'captchaEnabled' => false,
			'redirectUrl' => '',
		);
		return wp_parse_args( get_post_meta( $id, '_formello_settings', true ), $default );
	}

	/**
	 * Validate form request.
	 * This will return an array containing errors if any, sanitized fields and post request unslashed.
	 *
	 * @return void
	 */
	public function validate() {
		$v = new \Formello\Processor\Validator( $this->ID, $this->settings );
		$v->validate();
		$this->data = $v->get_data();
		if ( ! $this->has_errors() ) {
			$this->add_details();
		}
	}

	/**
	 * Validate form request.
	 * This will return an array containing errors if any, sanitized fields and post request unslashed.
	 *
	 * @return boolean
	 */
	public function has_errors() {
		return count( $this->data['errors'] );
	}

	/**
	 * Set error.
	 *
	 * @param string $error The action name.
	 */
	public function add_error( $error ) {
		$this->data['errors'][] = $error;
	}

	/**
	 * Save form submission in DB.
	 */
	public function save() {
		if ( empty( $this->data['fields'] ) ) {
			return true;
		}

		if ( empty( $this->settings['storeSubmissions'] ) ) {
			return true;
		}

		global $wpdb;

		$values = array();
		$place_holders = array();
		$submissions_table = $wpdb->prefix . 'formello_submissions';
		$submissions_meta_table = $wpdb->prefix . 'formello_submissions_meta';
		$form_id = $this->ID;
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

		$query = 'INSERT INTO ' . $wpdb->prefix . 'formello_submissions_meta (form_id, submission_id, field_name, field_value ) VALUES ';
		$query .= implode( ', ', $place_holders );

		//phpcs:ignore
		$wpdb->query( $wpdb->prepare( $query, $values ) );

		$formello_result = get_transient( 'formello_news', false );
		set_transient( 'formello_news', $formello_result + 1, DAY_IN_SECONDS );
	}

	/**
	 * Get the response
	 *
	 * @return array
	 */
	public function get_response() {

		$type = empty( $this->data['errors'] ) ? 'success' : 'error';

		$response = array(
			'hide' => (bool) $this->settings['hide'],
			'redirect_url' => $this->settings['redirectUrl'],
			'errors' => $this->data['errors'],
			'message' => $this->get_message( $type ),
		);

		if ( current_user_can( 'manage_options' ) && $this->is_debug() ) {
			$response['debug'] = $this->data;
		}

		return apply_filters( 'formello_form_response', $response );
	}

	/**
	 * Get form actions
	 *
	 * @return array
	 */
	public function get_id() {
		return $this->ID;
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
			} elseif ( is_string( $value ) ) {
				$value = $this->replace_tags( $value );
			}
		}

		return $actions;
	}

	/**
	 * Add details
	 *
	 * @return void
	 */
	private function add_details() {
		$settings = get_option( 'formello' );
		// add details on response.
		if ( ! empty( $settings['ip_logging'] ) ) {
			$this->data['details']['ip_address'] = ! empty( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		}
		$this->data['details']['user_agent']   = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$this->data['details']['referer_url']  = ! empty( $_SERVER['HTTP_REFERER'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '';
		$this->data['details']['submitted_at'] = wp_date( 'Y-m-d H:i:s' );

		$this->data['actions'] = array();
		foreach ( $this->actions as $action_settings ) {
			$this->data['actions'][] = $this->recursive_actions( $action_settings );
		}
	}

	/**
	 * Replace tags if any.
	 *
	 * @param mixed $template String template.
	 */
	private function replace_tags( $template ) {
		$replacer = new \Formello\TagReplacers\Replacer( $this->data['fields'] );
		$result   = $replacer->parse( $template );

		return $result;
	}

	/**
	 * Get debug
	 *
	 * @return boolean
	 */
	public function is_debug() {
		return $this->settings['debug'];
	}

	/**
	 * Get form message
	 *
	 * @param string $code The code response.
	 * @return string
	 */
	private function get_message( $code ) {
		$settings = get_option( 'formello' );
		$message = empty( $this->settings['messages'][ $code ] ) ? $settings['messages']['form'][ $code ] : $this->settings['messages'][ $code ];

		$message = apply_filters( 'formello_form_message_' . $code, $message );
		return $message;
	}
}
