<?php
/**
 * Manage Template API.
 *
 * @package Formello
 */

namespace Formello\Rest\Controllers;

use WP_REST_Controller;

/**
 * REST_API Handler
 */
class Template extends Base {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = 'forms';
	}

	/**
	 * Register the routes
	 *
	 * @return void
	 */
	public function register_routes() {

		// Export Templates.
		register_rest_route(
			$this->namespace,
			$this->rest_base . '/export',
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'export_forms' ),
				'permission_callback' => array( $this, 'update_settings_permissions' ),
			)
		);

		// Get Templates.
		register_rest_route(
			$this->namespace,
			$this->rest_base . '/import',
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'import_forms' ),
				'permission_callback' => array( $this, 'update_settings_permissions' ),
			)
		);
	}

	/**
	 * Export forms.
	 *
	 * @return mixed
	 */
	public function export_forms() {

		$forms = $this->get_forms();

		$response = new \WP_REST_Response( $forms, 200 );

		$response->header( 'Content-Type', 'application/json; charset=utf-8' );
		$response->header( 'Content-Disposition', 'attachment; filename=forms.json' );

		return $response;
	}

	/**
	 * Export forms.
	 *
	 * @param WP_REST_Request $request  request object.
	 * @return mixed
	 */
	public function import_forms( $request ) {
		$body = $request->get_file_params( 'file' );

		global $wp_filesystem;
		// Initialize the WP filesystem, no more using 'file-put-contents' function.
		if ( empty( $wp_filesystem ) ) {
			require_once ABSPATH . '/wp-admin/includes/file.php';
			WP_Filesystem();
		}

		$filepath = $body['file']['tmp_name'];
		$fileSize = filesize( $filepath );
		$fileinfo = finfo_open( FILEINFO_MIME_TYPE );
		$filetype = finfo_file( $fileinfo, $filepath );

		if ( $fileSize > 3145728 ) { // 3 MB (1 byte * 1024 * 1024 * 3 (for 3 MB)).
			return $this->error( 'no_templates', __( 'File max size is 3MB.', 'formello' ) );
		}

		$allowedTypes = array(
			'application/json' => 'json',
			'text/plain' => 'json',
		);

		if ( ! in_array( $filetype, array_keys( $allowedTypes ) ) ) {
			return $this->error( 'no_templates', __( 'Allowed file is json.', 'formello' ) );
		}

		$forms = $wp_filesystem->get_contents( $filepath );
		$forms = json_decode( $forms );

		foreach ( $forms as $form ) {
			// Create post object.
			$my_post = array(
				'ID' => 0,
				'post_title'   => wp_strip_all_tags( $form->title->raw ),
				'post_content' => $form->content->raw,
				'post_status'  => 'draft',
				'post_author'  => 1,
				'post_type'    => $form->type,
				'meta_input' => array(
					'_formello_actions' => $form->meta->_formello_actions,
					'_formello_settings' => $form->meta->_formello_settings,
				),
			);
			wp_insert_post( $my_post );

		}

		return $this->success( __( 'Forms imported!', 'formello' ) );
	}

	/**
	 * Retrieve form post types.
	 */
	private function get_forms() {
		$args = array(
			'post_type'     => 'formello',
			'fields'        => '',
			'no_found_rows' => true,
			'post_status'   => 'publish',
            'numberposts'   => 500, // phpcs:ignore
		);

		$forms = get_posts( $args );

		return $forms;
	}
}
