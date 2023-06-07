<?php
/**
 * My test case
 *
 * @package Formello
 */

/**
 * Base test case
 */
class Base_Test extends WP_UnitTestCase {

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

		//remove_filter( 'query', array( $this, '_create_temporary_table' ) );
		//remove_filter( 'query', array( $this, '_drop_temporary_table' ) );

		// Initiating the REST API.
		//global $wp_rest_server;

		//$this->server = $wp_rest_server = new \WP_REST_Server();
		//do_action( 'rest_api_init' );

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
				'constraints' => array(),
				'debug' => false,
				'fields' => array(
					'name' => 'text',
					'email' => 'email',
				),
				'hide' => false,
				'messages' => false,
				'recaptchaEnabled' => false,
				'redirect_url' => '',
				'storeSubmissions' => true,
			)
		);

	}

	/**
	 * Delete the item after the test.
	 */
	public function tearDown():void {

		parent::tearDown();

		//global $wp_rest_server;
		//$wp_rest_server = null;

		wp_delete_post( $this->post_id );
	}

	/**
	 * Test WordPress and plugin are loaded.
	 */
	public function test_wordpress_and_plugin_are_loaded() {
		$this->assertTrue( function_exists( 'do_action' ) );
		$this->assertTrue( class_exists( 'Formello\\Plugin' ) );
	}

}
