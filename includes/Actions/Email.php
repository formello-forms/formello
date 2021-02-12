<?php

namespace Formello\Actions;

use Formello\Form;
use Formello\Data;
use Formello\TagReplacers\Replacer;

class Email extends Action {

	protected $type  = 'email';
	protected $label = 'Send Email';
	protected $settings = array();

	public function __construct() {
		$this->label = __( 'Send Email', 'formello' );
		$this->settings = $this->get_default_settings();
	}

	/**
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
	 * @param array $settings
	 * @param Data $submission
	 * @param Form $form
	 */
	public function process( array $settings, Data $submission, Form $form ) {

		$replacer = new \Formello\TagReplacers\Replacer();

		if ( empty( $settings['to'] ) || empty( $settings['message'] ) ) {
			return false;
		}
		$settings   = array_merge( $this->get_default_settings(), $settings );
		$html_email = $settings['content_type'] === 'text/html';

		$to      = apply_filters( 'formello_action_email_to', $replacer->parse( $settings['to'] ) );
		$subject = ! empty( $settings['subject'] ) ? $replacer->parse( $settings['subject'] ) : '';
		$subject = apply_filters( 'formello_action_email_subject', $subject );
		$message = apply_filters( 'formello_action_email_message', $replacer->parse( $settings['message'] ) );

		// parse additional email headers from settings
		$headers = array();
		if ( ! empty( $settings['headers'] ) ) {
			$headers = explode( PHP_EOL, $settings['headers'] );
		}

		$content_type = $html_email ? 'text/html' : 'text/plain';
		$charset      = get_bloginfo( 'charset' );
		$headers[]    = sprintf( 'Content-Type: %s; charset=%s', $content_type, $charset );

		if ( ! empty( $settings['from'] ) ) {
			$from      = apply_filters( 'formello_action_email_from', $replacer->parse( $settings['from'] ) );
			$headers[] = sprintf( 'From: %s', $from );
		}
		
		return wp_mail( $to, $subject, $message, $headers );
	}
}
