<?php
/**
 * Register the form CPT
 *
 * @package formello
 * @since   1.0.0
 */

namespace Formello;

defined( 'ABSPATH' ) || exit;

/**
 * Register FOrmello Forms CPT
 *
 * @since 1.0.0
 */
function register_cpt() {

	$args = array(
		'labels' => array(
			'name'                => _x( 'Forms', 'formello' ),
			'singular_name'       => _x( 'Form', 'formello' ),
			'menu_name'           => __( 'Forms', 'formello' ),
			'parent_item_colon'   => __( 'Parent Form', 'formello' ),
			'all_items'           => __( 'Forms', 'formello' ),
			'view_item'           => __( 'View Form', 'formello' ),
			'add_new_item'        => __( 'Add New', 'formello' ),
			'add_new'             => __( 'Add New', 'formello' ),
			'edit_item'           => __( 'Edit Form', 'formello' ),
			'update_item'         => __( 'Update Form', 'formello' ),
			'search_items'        => __( 'Search Form', 'formello' ),
			'not_found'           => __( 'Not Found', 'formello' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'formello' ),
		),
		'public'              => false,
		'publicly_queryable'  => false,
		'has_archive'         => false,
		'show_ui'             => true,
		'menu_icon'           => 'dashicons-feedback',
		'exclude_from_search' => true,
		'show_in_nav_menus'   => true,
		'rewrite'             => false,
		'rest_controller_class' => '\Formello\Rest\Controllers\Forms',
		'hierarchical'        => false,
		'show_in_menu'        => true,
		'show_in_admin_bar'   => true,
		'show_in_rest'        => true,
		'template'            => array(
			array(
				'formello/form',
				array(
					'lock' => array(
						'move'   => false,
						'remove' => true,
					),
				),
			),
		),
		//'template_lock'       => 'insert', // This will block template insertion.
		'supports'            => array(
			'title',
			'editor',
			'excerpt',
			'custom-fields',
			'revisions',
		),
	);
	register_post_type( 'formello_form', $args );

}

/**
 * Register FOrmello Forms CPT
 *
 * @since 1.0.0
 */
function register_cpt_meta() {

	$defaults = array(
		'storeSubmissions' => true,
		'recaptchaEnabled' => false,
		'hide' => false,
		'debug' => false,
		'redirect_url' => '',
		'actions' => array(),
		'constraints' => array(),
		'fields' => array(),
	);

	register_post_meta(
		'formello_form',
		'_formello_parent',
		array(
			'show_in_rest' => true,
			'default' => 0,
			'single' => true,
			'type' => 'number',
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'formello_form',
		'_formello_settings',
		array(
			'show_in_rest' => array(
				'schema' => array(
					'type' => 'object',
					'additionalProperties' => true,
				),
			),
			'default' => $defaults,
			'single' => true,
			'type' => 'object',
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_meta(
		'formello_form',
		'_formello_actions',
		array(
			'show_in_rest' => array(
				'schema' => array(
					'items' => array(
						'type' => 'object',
						'properties' => array(),
						'additionalProperties' => true,
					),
				),
			),
			'single' => true,
			'type' => 'array',
			'additionalProperties' => true,
			'auth_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);

	register_post_status(
		'formello-private',
		array(
			'label'                     => _x( 'Formello private', 'post' ),
			'public'                    => false,
			'private'                   => false,
			'internal'                  => false,
			'protected'                 => false,
			'exclude_from_search'       => false,
			'show_in_admin_all_list'    => false,
			'show_in_admin_status_list' => true,
			'label_count'               => _n_noop( 'Private <span class="count">(%s)</span>', 'Private <span class="count">(%s)</span>' ),
		)
	);

	register_post_status(
		'formello-trash',
		array(
			'label'                     => _x( 'Private trash', 'post' ),
			'public'                    => false,
			'private'                   => false,
			'internal'                  => false,
			'protected'                 => true,
			'exclude_from_search'       => false,
			'show_in_admin_all_list'    => false,
			'show_in_admin_status_list' => true,
			'label_count'               => _n_noop( 'Private Trashed <span class="count">(%s)</span>', 'Private Trashed <span class="count">(%s)</span>' ),
		)
	);

}

add_action( 'init', __NAMESPACE__ . '\register_cpt' );
add_action( 'init', __NAMESPACE__ . '\register_cpt_meta' );
