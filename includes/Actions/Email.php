<?php
/**
 * Perform email Action.
 *
 * @package formello
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
	 * Constructor
	 */
	public function __construct() {
		parent::__construct();
		$this->label    = 'Email';
		$this->settings = $this->get_default_settings();

		add_action( 'wp_mail_failed', array( $this, 'onMailError' ), 10, 1 );
	}

	/**
	 * Mail error
	 *
	 * @param array $wp_error The mail error.
	 */
	public function onMailError( $wp_error ) {
		$this->log( 'debug', 'Mail Error ($wp_Error)', array( $wp_error ) );
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
	 * @param array         $action_settings Te action settings.
	 * @param Formello\Form $form The form object.
	 */
	public function process( $action_settings, $form ) {
		$settings = array_merge( $this->settings, $action_settings );
		$this->log( 'debug', 'Mail Settings:', $settings );

		if ( empty( $settings['to'] ) || empty( $settings['message'] ) ) {
			$this->log( 'debug', 'Mail Not Sent:' );
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
		$headers[]    = 'Cc:' . $settings['cc'];
		$headers[]    = 'Bcc:' . $settings['bcc'];

		$content_type = $html_email ? 'text/html' : 'text/plain';
		$charset      = get_bloginfo( 'charset' );
		$headers[]    = sprintf( 'Content-Type: %s; charset=%s', $content_type, $charset );

		if ( ! empty( $settings['from'] ) ) {
			$from      = apply_filters( 'formello_action_email_from', $settings['from'] );
			$headers[] = sprintf( 'From: %s', $from );
		}

		$result = wp_mail( $to, $subject, $message, $headers );

		if ( ! $result ) {
			$this->log( 'debug', __METHOD__ . '(). Mail details:', array( $to, $subject, $message, $headers ) );
			$this->log( 'debug', __METHOD__ . '(). Form details:', $form->get_response() );
		}

		return true;
	}
}
