<?php
/**
 * Register the form CPT
 *
 * @package formello
 * @since   1.0.0
 */

namespace Formello\Utils;

defined( 'ABSPATH' ) || exit;

/**
 * Register FOrmello Forms CPT
 *
 * @since 1.0.0
 */
function register_cpt() {

	$args = array(
		'labels' => array(
			'name'                => __( 'Forms', 'formello' ),
			'singular_name'       => __( 'Form', 'formello' ),
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
		'capability_type'     => 'post',
		'has_archive'         => false,
		'show_ui'             => true,
		'menu_icon'           => 'dashicons-feedback',
		'exclude_from_search' => true,
		'show_in_nav_menus'   => true,
		'rewrite'             => false,
		'hierarchical'        => false,
		'show_in_menu'        => false,
		'show_in_admin_bar'   => true,
		'show_in_rest'        => true,
		'template'            => array(
			array(
				'formello/form',
			),
		),
		//'template_lock'       => 'insert',
		'supports'            => array(
			'author',
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
 * Register Formello Forms CPT
 *
 * @since 1.0.0
 */
function register_cpt_meta() {

	$defaults = array(
		'storeSubmissions' => true,
		'captchaEnabled' => false,
		'captchaType' => '',
		'enableJsValidation' => true,
		'hide' => false,
		'debug' => false,
		'redirectUrl' => '',
		'actions' => array(),
		'constraints' => array(),
		'fields' => array(),
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
			'default' => array(
				array(
					'async' => true,
					'type' => 'email',
					'name' => 'Email',
					'to' => '{{wp.admin_email}}',
					'from' => '{{wp.admin_email}}',
					'cc' => '',
					'bcc' => '',
					'replyTo' => '',
					'subject' => __( '[Formello] New form submission', 'formello' ),
					'message' => '{{fields.all_data}}',
					'advanced' => false,
					'id' => 1,
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
}

add_action( 'init', __NAMESPACE__ . '\register_cpt' );
add_action( 'init', __NAMESPACE__ . '\register_cpt_meta' );
