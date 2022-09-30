<?php
/**
*  !!!! ONLY FOR AJAX CALL !!!!
*  
* Tests for the Ajax calls to save and get sos stats. 
* For speed, non ajax calls of class-ajax.php are tested in test-ajax-others.php
* Ajax tests are not marked risky when run in separate processes and wp_debug 
* disabled. But, this makes tests slow so non ajax calls are kept separate
* 
* @package Formello
*  
*/

namespace Formello\Tests;

use Formello\TagReplacers\Replacer;
use WP_Ajax_UnitTestCase;
use WPAjaxDieContinueException;
use WPAjaxDieStopException;

/**
 * @group ajax
 */
class Ajax_Test extends \WP_Ajax_UnitTestCase {

	protected $post_id;
	protected $user;

	/**
	 * Setup test
	 * @return void
	 */
	public function setup():void {
        parent::setup();

        $this->user = $this->factory->user->create_and_get(
        	array(
        		'user_login' => 'jdoe',
        		'user_pass' => NULL,
        		'role' => 'administrator' 
        	)
        );

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
				'actions' => array(),
				'constraints' => array(),
				'debug' => false,
				'fields' => array(
					'name' => 'text',
					'email' => 'email',
				),
				'hide' => true,
				'messages' => false,
				'recaptchaEnabled' => false,
				'redirect_url' => '',
				'storeSubmissions' => false,
			)
		);  
    }

    public function teardown():void {
        parent::teardown();
		wp_delete_post( $this->post_id );
    }

	/**
	 * Create a new post
	 */
	public function test_sample() {

		$nonce = wp_create_nonce( '_formello' );
        $_SERVER[ 'HTTP_X_REQUESTED_WITH' ] = 'XMLHttpRequest';
        $_POST[ '_formello_id' ] = $this->post_id + 1;
        $_POST[ '_formello_h' . $this->post_id ] = '';
        $_POST[ 'name' ] = 'test';
        $_POST[ 'email' ] = 'formello@formello.com';
        $_POST[ '_formello' ] = $nonce;

        try {
            $this->_handleAjax( 'formello' );
        } catch ( WPAjaxDieContinueException $e ) {}

		$response = json_decode( $this->_last_response );
var_dump($response);
		$this->assertEquals( 'success', $response->message->type );
		$this->assertEquals( 'Thanks for submitting this form.', $response->message->text );

    }

}
