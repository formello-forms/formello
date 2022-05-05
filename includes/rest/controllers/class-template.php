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
class Template extends WP_REST_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'formello/v1';
		$this->rest_base = 'settings';
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
			'/get_templates/',
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_templates' ),
				'permission_callback' => '__return_true',
			)
		);

		// Regenerate CSS Files.
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
	 * Get templates.
	 *
	 * @return mixed
	 */
	public function get_templates() {
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

					set_transient( 'formello_templates', $templates, DAY_IN_SECONDS );
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

		foreach ( $all_templates as $template ) {
			$local_templates[] = array(
				'id'    => $template->ID,
				'title' => $template->post_title,
				'types' => array(
					array(
						'slug' => 'local',
					),
				),
				'content' => $template->post_content,
				'url' => $template->guid,
			);
		}

		// merge all available templates.
		$templates = array_merge( $templates, $local_templates );

		if ( is_array( $templates ) ) {
			return $this->success( $templates );
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

		return $this->success( true );
	}

}
