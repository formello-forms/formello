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

		// Get Patterns.
		register_rest_route(
			$this->namespace,
			'/patterns/',
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'get_patterns' ),
				'permission_callback' => '__return_true',
			)
		);

		// Sync template from Formello.net.
		register_rest_route(
			$this->namespace,
			'/sync_template_library/',
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'sync_template_library' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Export forms.
	 *
	 * @return mixed
	 */
	public function export_forms() {

		$patterns = $this->get_local_patterns();
		$dir = \Formello\Utils\formello_dir() . '/tmp/formello.json';
		$dir_url = \Formello\Utils\formello_dir_url() . '/tmp/formello.json';

		global $wp_filesystem;
		// Initialize the WP filesystem, no more using 'file-put-contents' function.
		if ( empty( $wp_filesystem ) ) {
			require_once ABSPATH . '/wp-admin/includes/file.php';
			WP_Filesystem();
		}
		// Add a white index.
		$wp_filesystem->put_contents( $dir, wp_json_encode( $patterns ), 0644 );

		if ( is_array( $patterns ) ) {
			return $this->success( $dir_url );
		} else {
			return $this->error( 'no_templates', __( 'Templates not found.', 'formello' ) );
		}
	}

	/**
	 * Get patterns.
	 *
	 * @return mixed
	 */
	public function get_patterns() {

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
			$this->get_templates();
		}

		return $this->success( __( 'Templates synced!', 'formello' ) );
	}

	/**
	 * Get local patterns.
	 *
	 * @return mixed
	 */
	private function get_local_patterns() {

		$args = array(
			'post_type'     => 'formello_form',
			'fields'        => '',
			'no_found_rows' => true,
			'post_status'   => 'publish',
            'numberposts'   => 500, // phpcs:ignore
		);

		$all_patterns = get_posts( $args );
		$local_patterns = array();

		$args = array(
			'public'   => true,
			'_builtin' => true,
		);

		$output = 'names';
		$operator = 'and';

		$post_types = get_post_types( $args, $output, $operator );

		foreach ( $all_patterns as $pattern ) {
			$local_patterns[] = array(
				'title' => $pattern->post_title,
				'content' => $pattern->post_content,
				'description' => '',
				'blockTypes' => array(
					'formello/library',
				),
				'postTypes' => $post_types,
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

		/*
		 * Get user templates from db.
		 */
		$args = array(
			'post_type'     => 'formello_form',
			'fields'        => '',
			'no_found_rows' => true,
			'post_status'   => 'publish',
            'numberposts'   => 500, // phpcs:ignore
		);

		$all_templates = get_posts( $args );
		$local_templates = array();

		$args = array(
			'public'   => true,
			'_builtin' => true,
		);

		$output = 'names';
		$operator = 'and';

		$post_types = get_post_types( $args, $output, $operator );

		foreach ( $all_templates as $template ) {
			$local_templates[] = array(
				'title' => $template->post_title,
				'content' => $template->post_content,
				'description' => '',
				'blockTypes' => array(
					'formello/library',
				),
				'postTypes' => $postTypes,
				'keywords' => array(),
				'categories' => array( 'form' ),
				'name' => 'formello/' . sanitize_title( $template->post_title ),
			);
		}

		// merge all available templates.
		$templates = array_merge( $templates, $local_templates );

		set_transient( 'formello_templates', $templates );

		return $this->success( $templates );

	}
}
