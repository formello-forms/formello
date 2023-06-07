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

use Formello\TagReplacers\Replacer;

/**
 * @group ajax
 */
class Ajax_Test extends WP_Ajax_UnitTestCase {

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
				'constraints' => array(

				),
				'debug' => false,
				'fields' => array(
					'name' => 'text',
					'email' => 'email',
				),
				'hide' => true,
				'messages' => array(
					'success' => 'Stocazzo',
					'error' => 'Suka',
				),
				'recaptchaEnabled' => false,
				'redirect_url' => '',
				'storeSubmissions' => false,
			)
		);

		add_post_meta(
			$this->post_id,
			'_formello_actions',
			array()
		);

		$nonce = wp_create_nonce( '_formello' );
		$_SERVER[ 'HTTP_X_REQUESTED_WITH' ] = 'XMLHttpRequest';
		$_POST[ '_formello_id' ] = $this->post_id;
		$_POST[ '_formello_h' . $this->post_id ] = '';
		$_POST[ 'name' ] = 'test';
		$_POST[ 'email' ] = 'formello@formello.com';
		$_POST[ '_formello' ] = $nonce;

    }

    public function teardown():void {
        parent::teardown();
		wp_delete_post( $this->post_id );
    }

	/**
	 * Submit a form
	 */
	public function test_ajax() {

        try {
			$this->_handleAjax( 'formello' );
		} catch ( WPAjaxDieContinueException $e ) {}

		$response = json_decode( $this->_last_response );

		$this->assertEquals( 'success', $response->message->type );
		$this->assertEquals( 'Thanks for submitting this form.', $response->message->text );

    }

	/**
	 * Submit a spam request
	 */
	public function test_spam_request() {

        $_POST[ '_formello_h' . $this->post_id ] = 'stocazzo';

        try {
            $this->_handleAjax( 'formello' );
        } catch ( WPAjaxDieContinueException $e ) {}

		$response = json_decode( $this->_last_response );

		$this->assertEquals( 'error', $response->message->type );

    }

	/**
	 * Submit a wrong form id
	 */
	public function test_wrong_id() {

        $_POST[ '_formello_id' ] = $this->post_id + 1;

        try {
			$this->_handleAjax( 'formello' );
        } catch ( WPAjaxDieContinueException $e ) {}

		$response = json_decode( $this->_last_response );

		$this->assertEquals( 'error', $response->message->type );
		$this->assertEquals( 'Ops. An error occurred.', $response->message->text );

	}

}
