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

/**
 * @group ajax
 */
class Ajax_Test extends Ajax_Base_Test {

	/**
	 * Setup test
	 * @return void
	 */
	public function setup():void {
        parent::setup();

		// Become an administrator.
		$this->_setRole( 'administrator' );

		$_SERVER['HTTP_X_REQUESTED_WITH']      = 'XMLHttpRequest';
		$_POST['_formello_id']                 = $this->post_id;
		$_POST['_formello_h' . $this->post_id] = '';
		$_POST['name']                         = 'test';
		$_POST['email']                        = 'formello@formello.com';
		$_POST['test']                         = '{{fields.email}}';
		$_POST['non_registered_input']         = 'this should not appear';
		$_POST['_formello']                    = wp_create_nonce( '_formello' );
    }

	/**
	 * Submit a form
	 * @test
	 */
	public function submit() {

        try {
			$this->_handleAjax( 'formello' );
		} catch ( WPAjaxDieContinueException $e ) {}

		$response = json_decode( $this->_last_response );

		$fields = array(
			'name'  => 'test',
			'email' => 'formello@formello.com',
			'test'  => 'formello@formello.com',
		);

		$this->assertTrue( $response->success );
		$this->assertEquals( 'Grazie', $response->data->message );
		$this->assertEquals( $response->data->debug->fields->test, 'formello@formello.com' );
		$this->assertEquals( $fields, (array) $response->data->debug->fields );
		$this->assertObjectHasProperty( 'non_registered_input', $response->data->debug->params );

    }

	/**
	 * Submit a spam request
	 * @test
	 */
	public function spam_request() {

        $_POST[ '_formello_h' . $this->post_id ] = 'stocazzo';

        try {
            $this->_handleAjax( 'formello' );
        } catch ( WPAjaxDieContinueException $e ) {}

		$response = json_decode( $this->_last_response );

		$this->assertEquals( 'Ops', $response->data->message );
		$this->assertFalse( $response->success );

    }

	/**
	 * Submit a wrong form id
	 * @test
	 */
	public function wrong_id() {

        $_POST[ '_formello_id'] = 12310;

        try {
			$this->_handleAjax( 'formello' );
        } catch ( WPAjaxDieContinueException $e ) {}

		$response = json_decode( $this->_last_response );

		$this->assertEquals( 'Ops. An error occurred.', $response->data->message );
		$this->assertFalse( $response->success );

	}

}
