<?php
/**
 * Perform MailChimp Action.
 *
 * @package Formello
 */

namespace Formello\Actions;

use Formello\Form;
use Formello\Data;
use Formello\DrewM\MailChimp\MailChimp as SDK;
use Formello\TagReplacers\Replacer;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class MailChimp action
 *
 * @since 1.0.0
 */
class MailChimp extends Action {

	/**
	 * The action label.
	 *
	 * @var string $type Type of action.
	 */
	protected $type = 'mailchimp';

	/**
	 * The action label.
	 *
	 * @var string $label Action label.
	 */
	protected $label = 'MailChimp API';

	/**
	 * The action label.
	 *
	 * @var array $settings Array of settings.
	 */
	protected $settings = array();

	/**
	 * The replacer object.
	 *
	 * @var array $replacer Replacer Object.
	 */
	protected $replacer;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->label    = __( 'MailChimp', 'formello' );
		$this->settings = $this->get_default_settings();
		$this->replacer = new \Formello\TagReplacers\Replacer();
	}

	/**
	 * Retrieve default settings.
	 *
	 * @return array
	 */
	private function get_default_settings() {
		$defaults = array(
			'name' => '',
			'api'  => '',
		);
		return $defaults;
	}

	/**
	 * Process action.
	 *
	 * @param array $settings Array of settings.
	 * @param Data  $submission Data object.
	 * @param Form  $form The form.
	 */
	public function process( array $settings, Data $submission, Form $form ) {
		if ( empty( $settings['key'] ) || empty( $settings['list'] ) ) {
			return false;
		}

		$mail_chimp = new SDK( $settings['key'] );

		$url = 'lists/' . $settings['list'] . '/members';

		$data = array(
			'email_address' => $this->replacer->parse( $settings['email_address'] ),
			'status'        => 'subscribed',
		);

		if ( ! empty( $settings['merge_fields'] ) ) {
			$data['merge_fields'] = $settings['merge_fields'];
		}

		$result = $mail_chimp->post( $url, $data );
		return $result;
	}

}
