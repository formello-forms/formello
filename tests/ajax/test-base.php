<?php
/**
 * My test case
 *
 * @package Formello
 */

/**
 * Base test case
 */
abstract class Ajax_Base_Test extends WP_Ajax_UnitTestCase {

	/**
	 * Holds the WP REST Server object
	 *
	 * @var WP_REST_Server
	 */
	protected $server;

	/**
	 * Holds post id.
	 *
	 * @var int
	 */
	protected $post_id;

	/**
	 * Create a item for our test and initiate REST API.
	 *
	 * @return void
	 */
	public function setUp():void {
		parent::setUp();
        wp_set_current_user( 1 );

		$this->post_id = $this->factory->post->create(
			array(
				'post_title' => 'Test form',
				'post_status' => 'publish',
				'post_type' => 'formello_form',
			)
		);

		add_post_meta(
			$this->post_id,
			'_formello_settings',
			array(
				'constraints' => array(
					'email' => 'required|email',
					'number' => 'min:4|max:13|numeric'
				),
				'fields' => array(
					'name' => 'text',
					'email' => 'email',
					'number' => 'number',
					'test' => 'text',
				),
				'hide' => true,
				'debug' => true,
				'messages' => array(
					'success' => 'Grazie',
					'error' => 'Ops',
				),
				'captchaEnabled' => false,
				'redirectUrl' => '',
				'storeSubmissions' => false,
			)
		);

		add_post_meta(
			$this->post_id,
			'_formello_actions',
			array()
		);
    }

	/**
	 * Delete the item after the test.
	 */
	public function tearDown():void {
		parent::tearDown();
		wp_delete_post( $this->post_id );
	}
}
