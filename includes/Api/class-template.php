<?php
/**
 * Manage Template API.
 *
 * @package Formello
 */

namespace Formello\Api;

use WP_REST_Controller;
use Formello\Encryption;

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

		// Get template data.
		register_rest_route(
			$this->namespace,
			'/get_template_data/',
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_template_data' ),
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
				'permission_callback' => array( $this, 'update_settings_permission' ),
			)
		);

	}

	/**
	 * Get templates.
	 *
	 * @return mixed
	 */
	public function get_templates() {
		$url       = 'https://library.formello.net/wp-json/templates/get_templates';
		$templates = get_transient( 'formello_templates', false );

		/*
		 * Get remote templates.
		 */
		if ( ! $templates ) {
			$requested_templates = wp_remote_get( $url );

			if ( ! is_wp_error( $requested_templates ) ) {
				$new_templates = wp_remote_retrieve_body( $requested_templates );
				$new_templates = json_decode( $new_templates, true );

				if ( $new_templates && isset( $new_templates['response'] ) && is_array( $new_templates['response'] ) ) {
					$templates = $new_templates['response'];

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
			'post_status'   => 'any',
			'numberposts'   => 500, // phpcs:ignore
		);

		$all_templates = get_posts( $args );
		$local_templates = array();

		foreach ( $all_templates as $template ) {
			//$image_id   = get_post_thumbnail_id( $template );
			//$image_data = wp_get_attachment_image_src( $image_id, 'large' );

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
				//'thumbnail'        => isset( $image_data[0] ) ? $image_data[0] : false,
				//'thumbnail_width'  => isset( $image_data[1] ) ? $image_data[1] : false,
				//'thumbnail_height' => isset( $image_data[2] ) ? $image_data[2] : false,
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
	 * Get templates.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function get_template_data( \WP_REST_Request $request ) {
		$url           = 'https://library.formello.net/wp-json/templates/get_template';
		$id            = $request->get_param( 'id' );
		$type          = $request->get_param( 'type' );
		$template_data = false;

		switch ( $type ) {
			case 'remote':
				$cached_template_data = get_transient( 'formello_template_data', array() );

				if ( isset( $cached_template_data[ $id ] ) ) {
					$template_data = $cached_template_data[ $id ];
				}

				if ( ! $template_data ) {
					$requested_template_data = wp_remote_get(
						add_query_arg(
							array(
								'id' => $id,
							),
							$url
						)
					);

					if ( ! is_wp_error( $requested_template_data ) ) {
						$new_template_data = wp_remote_retrieve_body( $requested_template_data );
						$new_template_data = json_decode( $new_template_data, true );

						if ( $new_template_data && isset( $new_template_data['response'] ) && is_array( $new_template_data['response'] ) ) {
							$template_data = $new_template_data['response'];

							$cached_template_data[ $id ] = $template_data;
							set_transient( 'formello_template_data', $cached_template_data, DAY_IN_SECONDS );
						}
					}
				}
				break;

			case 'local':
				$post = get_post( $id );

				if ( $post && 'formello_form' === $post->post_type ) {
					$template_data = array(
						'id'      => $post->ID,
						'title'   => $post->post_title,
						'content' => $post->post_content,
					);
				}

				break;
		}

		if ( is_array( $template_data ) ) {
			return $this->success( $template_data );
		} else {
			return $this->error( 'no_template_data', __( 'Template data not found.', 'formello' ) );
		}
	}

	/**
	 * Sync the template library.
	 *
	 * @param WP_REST_Request $request  request object.
	 *
	 * @return mixed
	 */
	public function sync_template_library( \WP_REST_Request $request ) {
		delete_transient( 'formello_templates' );
		delete_transient( 'formello_template_data' );

		return $this->success( true );
	}

	/**
	 * Checks if a given request has access to read the items.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function update_settings_permissions( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Retrieves the query params for the items collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		return array();
	}

	/**
	 * Success rest.
	 *
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function success( $response ) {
		return new \WP_REST_Response(
			array(
				'success'  => true,
				'response' => $response,
			),
			200
		);
	}

	/**
	 * Failed rest.
	 *
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function failed( $response ) {
		return new \WP_REST_Response(
			array(
				'success'  => false,
				'response' => $response,
			),
			200
		);
	}

	/**
	 * Error rest.
	 *
	 * @param mixed $code     error code.
	 * @param mixed $response response data.
	 * @return mixed
	 */
	public function error( $code, $response ) {
		return new \WP_REST_Response(
			array(
				'error'      => true,
				'success'    => false,
				'error_code' => $code,
				'response'   => $response,
			),
			401
		);
	}

}
