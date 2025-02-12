<?php
/**
 * Manage Settings.
 *
 * @package Formello
 */

namespace Formello\Rest;

/**
 * REST_API Handler
 */
class Settings extends Base {
	/**
	 * {inheritDoc}
	 *
	 * @var string
	 */
	protected $rest_base = 'settings';

	/**
	 * {inheritDoc}
	 */
	public function endpoints() {
		return array(
			'/reset' => array(
				'methods' => \WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'reset' ),
				'permission_callback' => array( $this, 'update_settings_permissions' ),
			),
		);
	}

	/**
	 * Get all registered columns.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return Array
	 */
	public function reset( $request ) {
		delete_option( 'formello' );

		return array(
			'success' => true,
			'response' => __( 'Settings resetted!', 'formello' ),
		);
	}
}
