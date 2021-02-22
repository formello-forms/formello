<?php
/**
 * Manage API request.
 *
 * @package Formello
 */

namespace Formello;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use WP_REST_Controller;

/**
 * REST_API Handler
 *
 * @since 1.0.0
 */
class Api extends WP_REST_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->includes();

		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Include the controller classes
	 *
	 * @return void
	 */
	private function includes() {
		if ( ! class_exists( __NAMESPACE__ . '\Api\Settings' ) ) {
			require_once __DIR__ . '/Api/Settings.php';
		}
		if ( ! class_exists( __NAMESPACE__ . '\Api\Form' ) ) {
			require_once __DIR__ . '/Api/Form.php';
		}
	}

	/**
	 * Register the API routes
	 *
	 * @return void
	 */
	public function register_routes() {
		( new Api\Settings() )->register_routes();
		( new Api\Form() )->register_routes();
	}

}
