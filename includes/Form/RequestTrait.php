<?php
/**
 * Helper trait.
 *
 * @package Formello
 */

namespace Formello\Form;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Formello\Log;
use Formello\TagReplacers\Replacer;

trait RequestTrait {

	/**
	 * The data submitted
	 *
	 * @var array
	 */
	protected $data = array();

	/**
	 * The configuration data
	 *
	 * @var array
	 */
	protected $config = array();

	/**
	 * The form logger
	 *
	 * @var array
	 */
	protected $logger;

	/**
	 * Is form loaded?
	 */
	public function is_loaded() {
		return ! empty( $this->config ) || ! empty( $this->data );
	}

	/**
	 * Get ID of form
	 *
	 * @return number
	 */
	public function get_id() {
		return $this->config['ID'];
	}

	/**
	 * Get a Data array.
	 *
	 * @return array
	 */
	public function get_data() {
		return $this->data;
	}

	/**
	 * Get a Data array.
	 *
	 * @return array
	 */
	public function get_config() {
		return $this->config;
	}

	/**
	 * Get form settings
	 *
	 * @return array
	 */
	public function get_settings() {
		return $this->config['settings'];
	}

	/**
	 * Get form settings
	 *
	 * @return array
	 */
	public function get_form_settings() {
		return $this->config['form'];
	}

	/**
	 * Get form setting by name
	 *
	 * @param array $setting The setting to load.
	 * @return array
	 */
	public function get_setting( $setting ) {
		return $this->config['settings'][ $setting ];
	}

	/**
	 * Get form setting by name
	 *
	 * @param array $setting The setting to load.
	 * @return array
	 */
	public function get_form_setting( $setting ) {
		return $this->config['form'][ $setting ];
	}

	/**
	 * Get form fields description.
	 *
	 * @return array
	 */
	public function get_fields_definitions() {
		return $this->config['form']['fields'];
	}

	/**
	 * Get form fields filled.
	 *
	 * @param string $name The field name.
	 * @return array
	 */
	public function get_fields() {
		return $this->data['fields'];
	}

	/**
	 * Get form fields value.
	 *
	 * @param string $name The field name.
	 * @return array
	 */
	public function get_field( $name ) {
		if ( ! empty( $this->data['fields'][ $name ] ) ) {
			return $this->data['fields'][ $name ];
		}
	}

	/**
	 * Set sanitized form fields value.
	 *
	 * @param string $name The field name.
	 * @param string $value The field name.
	 */
	public function set_field( $name, $value ) {
		$fields = $this->get_fields_definitions();
		if ( ! empty( $fields[ $name ] ) ) {
			$sanitized = $this->sanitize_field( $name, $value );
			$this->data['fields'][ $name ] = $sanitized;
			// We store sanitized value also in $_POST
			// so action can access to already sanitized values.
			$_POST[ $name ] = $sanitized;
		}
	}

	/**
	 * Sanitize field with values before saving. Can be called recursively.
	 *
	 * @param string $key the field array key.
	 * @param mixed  $value the value to sanitize.
	 * @return mixed
	 */
	private function sanitize_field( $key, $value ) {
		$fields = $this->get_fields_definitions();

		// Skip file.
		if ( 'file' === $fields[ $key ] ) {
			return sanitize_text_field( $value );
		}

		// Skip password. We do not store password.
		if ( 'password' === $fields[ $key ] ) {
			return sanitize_text_field( $value );
		}

		if ( is_array( $value ) ) {
			$field = array_map( array( $this, 'replace_tags' ), $value );
			return array_map( 'sanitize_text_field', $field );
		}

		if ( 'richtext' === $fields[ $key ] ) {
			$allowed_tags = wp_kses_allowed_html( 'post' );
			return wp_kses( stripslashes_deep( $this->replace_tags( $value ) ), $allowed_tags );
		}

		if ( 'textarea' === $fields[ $key ] ) {
			return sanitize_textarea_field( $this->replace_tags( $value ) );
		}

		return sanitize_text_field( $this->replace_tags( $value ) );
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
	 * Check if has errors
	 *
	 * @return boolean
	 */
	public function has_errors() {
		return ! empty( $this->data['errors'] );
	}

	/**
	 * Check if has errors
	 *
	 * @return boolean
	 */
	public function get_errors() {
		return $this->data['errors'];
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
	 * Replace tags if any.
	 *
	 * @param mixed $template String template.
	 */
	private function replace_tags( $template ) {
		$replacer = new Replacer();
		$result   = $replacer->parse( $template );

		return $result;
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
	 * Get debug
	 *
	 * @return boolean
	 */
	public function is_debug() {
		return $this->config['form']['debug'] && current_user_can( 'manage_options' ) ? true : false;
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
	 * Get form settings
	 *
	 * @param array $settings The form settings.
	 *
	 * @return array
	 */
	private function parse_settings( $settings ) {
		$defaults = array(
			'storeSubmissions' => true,
			'recaptchaEnabled' => false,
			'hide' => false,
			'debug' => false,
			'messages' => array(
				'success' => __( 'Thanks for submitting this form.', 'formello' ),
				'error' => __( 'Ops. An error occurred.', 'formello' ),
			),
		);

		if ( empty( $settings ) ) {
			return $defaults;
		}
		
		$messages = $this->get_setting( 'messages' );
		if ( '' === $settings['messages']['success'] ) {
			$settings['messages']['success'] = $messages['form']['success'];
		}
		if ( '' === $settings['messages']['error'] ) {
			$settings['messages']['error'] = $messages['form']['error'];
		}
		return wp_parse_args( $settings, $defaults );
	}

    protected function __clone() {}
    protected function __sleep() {}
    protected function __wakeup() {}

}
