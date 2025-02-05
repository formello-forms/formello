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
	}

	/**
	 * Delete the item after the test.
	 */
	public function tearDown():void {
		parent::tearDown();
	}

	/**
	 * Test WordPress and plugin are loaded.
	 */
	public function test_wordpress_and_plugin_are_loaded() {
		$this->assertTrue( function_exists( 'do_action' ) );
		$this->assertTrue( class_exists( 'Formello\\Plugin' ) );
	}

}
