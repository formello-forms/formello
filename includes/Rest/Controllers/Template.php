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
		$this->rest_base = 'templates';
	}

	/**
	 * Register the routes
	 *
	 * @return void
	 */
	public function register_routes() {

		// Get Templates.
		register_rest_route(
			$this->namespace,
			$this->rest_base . '/export',
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'export_forms' ),
				'permission_callback' => '__return_true',
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

		// Get Patterns.
		register_rest_route(
			$this->namespace,
			'/patterns/',
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'set_patterns' ),
				'permission_callback' => array( $this, 'update_settings_permissions' ),
			)
		);

		// Sync template from Formello.net.
		register_rest_route(
			$this->namespace,
			'/sync_template_library/',
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'sync_template_library' ),
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
		);

		if ( ! in_array( $filetype, array_keys( $allowedTypes ) ) ) {
			return $this->error( 'no_templates', __( 'Allowed file is json.', 'formello' ) );
		}

		$forms = $wp_filesystem->get_contents( $filepath );
		$forms = json_decode( $forms );

		foreach ( $forms as $form ) {
			// Create post object.
			$my_post = array(
				'post_title'   => wp_strip_all_tags( $form->post_title ),
				'post_content' => $form->post_content,
				'post_status'  => 'draft',
				'post_author'  => 1,
				'post_type'    => $form->post_type,
			);
			wp_insert_post( $my_post );

		}

		return $this->success( __( 'Forms imported!', 'formello' ) );

	}

	/**
	 * Get patterns.
	 *
	 * @return mixed
	 */
	public function set_patterns() {

		$local_patterns = $this->get_local_patterns();

		set_transient( 'formello_patterns', $local_patterns );

		if ( is_array( $local_patterns ) ) {
			return $this->success( $local_patterns );
		} else {
			return $this->error( 'no_templates', __( 'Templates not found.', 'formello' ) );
		}
	}

	/**
	 * Sync the template library.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function sync_template_library( $request ) {
		delete_transient( 'formello_templates' );
		delete_transient( 'popper_templates' );

		if ( current_user_can( 'manage_options' ) ) {
			$templates = $this->get_templates();
		}

		return $this->success( __( 'Templates synced!', 'formello' ) );
	}

	/**
	 * Get local patterns.
	 *
	 * @return mixed
	 */
	private function get_local_patterns() {

		$all_patterns = $this->get_forms();
		$local_patterns = array();

		foreach ( $all_patterns as $pattern ) {
			$local_patterns[] = array(
				'title' => $pattern->post_title,
				'content' => $pattern->post_content,
				'description' => '',
				'blockTypes' => array(
					'formello/library',
				),
				'keywords' => array(),
				'categories' => array( 'form' ),
				'name' => 'formello/' . sanitize_title( $pattern->post_title ),
			);
		}

		set_transient( 'formello_patterns', $local_patterns );

		return $local_patterns;

	}

	/**
	 * Get templates.
	 *
	 * @return mixed
	 */
	private function get_templates() {
		$url       = 'https://formello.net/wp-json/formello/v1/formello_templates?nocache=' . time();
		$templates = get_transient( 'formello_templates', false );

		/*
		 * Get remote templates.
		 */
		if ( ! $templates ) {
			$requested_templates = wp_remote_get( $url );

			if ( ! is_wp_error( $requested_templates ) ) {
				$new_templates = wp_remote_retrieve_body( $requested_templates );
				$new_templates = json_decode( $new_templates, true );

				if ( $new_templates && is_array( $new_templates ) ) {
					$templates = $new_templates;

					set_transient( 'formello_templates', $templates );
				}
			} else {
				$templates = array();
			}
		}

		set_transient( 'formello_templates', $templates );

		return $templates;

	}

	/**
	 * Retrieve form post types.
	 */
	private function get_forms() {
		$args = array(
			'post_type'     => 'formello_form',
			'fields'        => '',
			'no_found_rows' => true,
			'post_status'   => 'publish',
            'numberposts'   => 500, // phpcs:ignore
		);

		$forms = get_posts( $args );

		return $forms;
	}

}
