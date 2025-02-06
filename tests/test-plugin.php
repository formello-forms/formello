<?php
/**
 * My test case
 *
 * @package Formello
 */

use Formello\TagReplacers\Replacer;

/**
 * Base test case
 */
class Plugin_Test extends Base_Test {

	/**
	 * Create a new post
	 */
	public function test_tag_replacer() {
		$replacer = new Replacer();
		// Check the expected post title.
		$this->assertEquals( 'Test Blog', $replacer->parse( '{{wp.site_title}}' ) );
		// If no form is submitted, should return empty string
		$this->assertEquals( '', $replacer->parse( '{{fields.name}}' ) );
	}

}
