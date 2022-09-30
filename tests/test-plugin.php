<?php
/**
 * My test case
 *
 * @package Formello
 */

namespace Formello\Tests;

use Formello\TagReplacers\Replacer;

/**
 * Base test case
 */
class Plugin_Test extends Base_Test {

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
	 * A single example test.
	 */
	public function test_rest() {

		$request = new \WP_REST_Request( 'GET', '/wp/v2/formello_form/' . $this->post_id );
		$response = $this->server->dispatch( $request );
		$data = $response->get_data();

		$this->assertEquals( 200, $response->get_status() );

	}

	/**
	 * Create a new post
	 */
	public function test_tag_replacer() {
		$str = '{{wp.site_title}}';
		$replacer = new Replacer();
		// Check the expected post title.
		$this->assertEquals( 'Test Blog', $replacer->parse( $str ) );
	}

}
