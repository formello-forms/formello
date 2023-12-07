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

use Formello\Log;
use Formello\TagReplacers\Replacer;

/**
 * Get defaults for our general options.
 *
 * @since 1.0.0
 */
class Response {
	use RequestTrait;

	/**
	 * The constructor.
	 *
	 * @param int $settings The form settings.
	 * @param int $data The form data.
	 */
	public function __construct( $data, $config ) {
		$this->data   = $data;
		$this->config = $config;
	}

	/**
	 * Get the response
	 *
	 * @param boolean $as_html Check for Html response.
	 * @return array
	 */
	public function get_response( $as_html = false ) {
		if ( $as_html ) {
			return $this->to_html();
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
		$settings = $this->get_form_settings();

		$response = array(
			'hide_form' => (bool) $settings['hide'],
			'errors' => $this->get_errors(),
			'message' => array(
				'type'   => $type,
				'text'   => $this->get_message( $type ),
			),
		);

		if ( ! empty( $settings['redirect_url'] ) ) {
			$response['redirect_url'] = $settings['redirect_url'];
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
	public function to_html() {
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

		$debug['id']      = $this->get_id();
		$debug['errors']  = $this->get_errors();
		$debug['config']  = $this->config;
		$debug['fields']  = $this->data['fields'];
		$debug['actions'] = empty( $this->data['actions'] ) ? array() : $this->data['actions'];

		return $debug;
	}

	/**
	 * Get form message
	 *
	 * @param string $type The response type.
	 * @return string
	 */
	private function get_message( $type ) {
		$messages = $this->get_setting( 'messages' );
		$message = isset( $messages['form'][ $type ] ) ? $messages['form'][ $type ] : 'error';

		$message = apply_filters( 'formello_form_message_' . $type, $message );
		return $message;
	}

	/**
	 * Check if has errors
	 *
	 * @return boolean
	 */
	private function message_type() {
		return $this->has_errors() ? 'error' : 'success';
	}

	/**
	 * Generate error list.
	 *
	 * @return string Html list
	 */
	private function error_list() {
		$out = '<ul>';
		$errors = $this->get_errors();
		foreach ( $errors as $key => $error ) {
			$out .= '<li>' . $error . '</li>';
		}
		$out .= '</ul>';
		return $out;
	}

}
