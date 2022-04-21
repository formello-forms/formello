<?php
/**
 * Perform email Action.
 *
 * @package Formello
 */

namespace Formello\Actions;

/**
 * Class email action
 */
class Email extends Action {

	/**
	 * The action label.
	 *
	 * @var string $type Type of action.
	 */
	protected $type = 'email';

	/**
	 * The action label.
	 *
	 * @var string $label Action label.
	 */
	protected $label = 'Send Email';

	/**
	 * The action label.
	 *
	 * @var array $settings Array of settings.
	 */
	protected $settings = array();

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->label    = __( 'Send Email', 'formello' );
		$this->settings = $this->get_default_settings();

		add_action( 'wp_mail_failed', array( $this, 'onMailError' ), 10, 1 );

	}

	public function onMailError( $wp_error ) {

		error_log( print_r( $wp_error ) );

	}

	/**
	 * Retrieve default settings
	 *
	 * @return array
	 */
	private function get_default_settings() {
		$defaults = array(
			'name'         => '',
			'from'         => get_option( 'admin_email' ),
			'to'           => get_option( 'admin_email' ),
			'subject'      => '',
			'message'      => '',
			'headers'      => '',
			'content_type' => 'text/html',
		);
		return $defaults;
	}

	/**
	 * Processes this action
	 *
	 * @param array $action_settings Te action settings.
	 */
	public function process( $action_settings ) {

		$settings = array_merge( $this->settings, $action_settings );

		if ( empty( $settings['to'] ) || empty( $settings['message'] ) ) {
			return false;
		}
		$html_email = 'text/html' === $settings['content_type'];

		$to      = apply_filters( 'formello_action_email_to', $settings['to'] );
		$subject = ! empty( $settings['subject'] ) ? $settings['subject'] : '';
		$subject = apply_filters( 'formello_action_email_subject', $subject );
		$message = apply_filters( 'formello_action_email_message', $settings['message'] );

		// parse additional email headers from settings.
		$headers = array();
		if ( ! empty( $settings['headers'] ) ) {
			$headers = explode( PHP_EOL, $settings['headers'] );
		}

		$content_type = $html_email ? 'text/html' : 'text/plain';
		$charset      = get_bloginfo( 'charset' );
		$headers[]    = sprintf( 'Content-Type: %s; charset=%s', $content_type, $charset );

		if ( ! empty( $settings['from'] ) ) {
			$from      = apply_filters( 'formello_action_email_from', $settings['from'] );
			$headers[] = sprintf( 'From: %s', $from );
		}

		$result = wp_mail( $to, $subject, $message, $headers );

		return true;
	}
}
