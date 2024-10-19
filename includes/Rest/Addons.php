<?php
/**
 * Retrieve Addons.
 *
 * @package Formello
 */

namespace Formello\Rest;

use WP_REST_Controller;

/**
 * REST_API Handler
 */
class Addons extends Base {

	/**
	 * {inheritDoc}
	 */
	public function __construct() {
		$this->rest_base = 'addons';
	}

	/**
	 * {inheritDoc}
	 */
	public function endpoints() {
		return array(
			'' => array(
				'methods' => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'list_addons' ),
			),
		);
	}

	/**
	 * Get addons.
	 *
	 * @return mixed
	 */
	public function list_addons() {

		$addons = array(
			array(
				'id' => 1,
				'title'   => 'Moosend',
				'slug'    => 'moosend',
				'excerpt' => __( 'The Moosend addon allows you to create Moosend newsletter subscription forms in WordPress, so you can grow your e-mail list.', 'formello' ),
				'category' => 'integrations',
			),
			array(
				'id' => 2,
				'title'   => 'Auto suggest',
				'slug'   => 'autosuggest',
				'excerpt' => __( 'Improves the user experience of the search form by showing results inline.', 'formello' ),
				'category' => 'general',
			),
			array(
				'id' => 3,
				'title'   => 'Calculator',
				'slug'   => 'calculator',
				'excerpt' => __( 'Adds a field to show the result of a calculation based on the values in your form.', 'formello' ),
				'category' => 'general',
			),
			array(
				'id' => 4,
				'title'   => 'Templates',
				'slug'   => 'templates',
				'excerpt' => __( 'Create your own collection of form templates to deploy on your sites.', 'formello' ),
				'category' => 'general',
			),
			array(
				'id' => 5,
				'title'   => 'Frontend Posting',
				'slug'   => 'frontend-posting',
				'excerpt' => __( 'Allows you to create a post, page, or other type of post from the frontend.', 'formello' ),
				'category' => 'general',
			),
			array(
				'id' => 6,
				'title'   => 'Mailerlite',
				'slug'   => 'mailerlite',
				'excerpt' => __( 'Adds contacts to your MailerLite groups.', 'formello' ),
				'category' => 'integrations',
			),
			array(
				'id' => 7,
				'title'   => 'Login',
				'slug'   => 'login',
				'excerpt' => __( 'Adds actions for logging in and user profile management to your forms.', 'formello' ),
				'category' => 'general',
			),
			array(
				'id' => 8,
				'title'   => 'File Upload',
				'slug'   => 'file-upload',
				'excerpt' => __( 'Adds an input field to upload files.', 'formello' ),
				'category' => 'general',
			),
			array(
				'id' => 9,
				'title'   => 'Brevo',
				'slug'   => 'brevo',
				'excerpt' => __( 'Addon to subscribe automatically collected emails to your Brevo list.', 'formello' ),
				'category' => 'integrations',
			),
			array(
				'id' => 10,
				'title'   => 'Popper',
				'slug'   => 'popper',
				'excerpt' => __( 'A popup builder with activation on exit intent, on scroll and on click on anchor for opt-in, lead generation and more.', 'formello' ),
				'category' => 'free',
			),
			array(
				'id' => 11,
				'title'   => 'GetResponse',
				'slug'   => 'getresponse',
				'excerpt' => __( 'Addon for GetResponse to subscribe automatically collected emails to your list.', 'formello' ),
				'category' => 'integrations',
			),
			array(
				'id' => 12,
				'title'   => 'MailPoet',
				'slug'   => 'mailpoet',
				'excerpt' => __( 'Addon for creating MailPoet newsletter subscription forms.', 'formello' ),
				'category' => 'integrations',
			),
			array(
				'id' => 13,
				'title'   => 'WebHooks',
				'slug'   => 'web-hooks',
				'excerpt' => __( 'Send your form data to any external service through HTTP requests using GET or POST methods.', 'formello' ),
				'category' => 'integrations',
			),
			array(
				'id' => 14,
				'title'   => 'Exporter',
				'slug'   => 'exporter',
				'excerpt' => __( 'With this extension you can export all the data sent to the form to an xlsx file that can be opened in Excel or a csv.', 'formello' ),
				'category' => 'utility',
			),
			array(
				'id' => 15,
				'title'   => 'Conditional Fields',
				'slug'   => 'conditional-fields',
				'excerpt' => __( 'The Conditional Fields extension allows you to show or hide a field based on rules.', 'formello' ),
				'category' => 'utility',
			),
			array(
				'id' => 16,
				'title'   => 'Inserter',
				'slug'   => 'inserter',
				'excerpt' => __( 'Automatically insert a form at the end or within a post automatically. You can add rules and exclusions based on categories and tags.', 'formello' ),
				'category' => 'utility',
			),
			array(
				'id' => 17,
				'title'   => 'ConvertKit',
				'slug'   => 'convertkit',
				'excerpt' => __( 'Addon for ConvertKit with which you can easily sign up your leads to your list and start collecting thousands of emails.', 'formello' ),
				'category' => 'integrations',
			),
			array(
				'id' => 18,
				'title'   => 'Mailchimp',
				'slug'   => 'mailchimp',
				'excerpt' => __( 'Addon for Mailchimp with which you can easily sign up your leads to your list and start collecting thousands of emails.', 'formello' ),
				'category' => 'integrations',
			),
		);

		return $addons;
	}
}
