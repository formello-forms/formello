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
			'add_new_item'        => __( 'Add New Form', 'formello' ),
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
		'show_in_nav_menus'   => false,
		'rewrite'             => false,
		'hierarchical'        => false,
		'show_in_menu'        => true,
		'show_in_admin_bar'   => true,
		'show_in_rest'        => true,
		'capability_type'     => 'post',
		'template'            => array(
			array( 'formello/form' ),
		),
		'template_lock'       => 'insert', // This will block template insertion.
		'supports'            => array(
			'title',
			'editor',
			'custom-fields',
		),
	);
	register_post_type( 'formello_form', $args );

	register_rest_field(
		'formello_form',
		'metadata',
		array(
			'get_callback' => function ( $data ) {
				return get_post_meta( $data['id'], '_formello_settings', true );
			},
		)
	);

}
add_action( 'init', __NAMESPACE__ . '\register_cpt' );
