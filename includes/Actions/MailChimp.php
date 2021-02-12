<?php

namespace Formello\Actions;

use Formello\Form;
use Formello\Data;
use Formello\DrewM\MailChimp\MailChimp as SDK;
use Formello\TagReplacers\Replacer;

class MailChimp extends Action {

	protected $type  = 'mailchimp';
	protected $label = 'Mailchimp API';
	protected $replacer;

	public function __construct() {
		$this->label = __( 'MailChimp', 'formello' );
		$this->settings = $this->get_default_settings();
        $this->replacer = new \Formello\TagReplacers\Replacer();
	}

	/**
	* @return array
	*/
	private function get_default_settings() {
		$defaults = array(
			'name' => '',
			'api' => '',
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
		if ( empty( $settings['key'] ) || empty( $settings['list'] ) ) {
			return false;
		}

		$mailChimp = new SDK( $settings[ 'key' ] );

		$url =  'lists/' . $settings['list'] . '/members';

		$data = [
			'email_address' => $this->replacer->parse( $settings['email_address'] ),
			'status'        => 'subscribed'
		];

		if( !empty( $settings['merge_fields'] ) ){
			$data['merge_fields'] = $settings['merge_fields'];
		}

		$result = $mailChimp->post( $url, $data );
		return $result;
	}

}
