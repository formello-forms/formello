<?php
/**
 * Manage all assets.
 *
 * @package Formello
 */

namespace Formello;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Scripts and Styles Class
 *
 * @since 1.0.0
 */
class CPT {

	/**
	 * Class instance.
	 *
	 * @access private
	 * @var $instance Class instance.
	 */
	private static $instance;

	/**
	 * Initiator
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->register();
		if ( is_admin() ) {
			add_filter( 'allowed_block_types', array( $this, 'allowed_block_types'), 10, 2 );
		}
	}

	/**
	 * Register our app scripts and styles
	 *
	 * @return void
	 */
	public function register() {
		$args = array(
			'labels' => array(
				'name'                => _x( 'Forms', 'Post Type General Name', 'formello' ),
				'singular_name'       => _x( 'Form', 'Post Type Singular Name', 'formello' ),
				'menu_name'           => __( 'Formello', 'formello' ),
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
			'supports'            => array(
				'title',
				'editor',
				'custom-fields',
			),
		);
		register_post_type( 'formello_form', $args );

	}

	/**
	 * Return allowed blocks on CPT.
	 *
	 * @param array $allowed_block_types Allowed blocks.
	 * @param mixed $post Post object.
	 *
	 * @return array Allowed blocks.
	 */
	public function allowed_block_types( $allowed_block_types, $post ) {

		if ( 'formello_form' === $post->post_type ) {
			return array(
				'core/group',
				'core/columns',
				'core/paragraph',
				'core/heading',
				'core/spacer',
				'core/separator',
				'core/image',
				'formello/form',
				'formello/fieldset',
				'formello/input',
				'formello/button',
				'formello/inputflex',
				'formello/output',
				'formello/select',
				'formello/actions',
				'formello/actions-email',
				'formello/actions-webhooks',
				'formello/actions-mailchimp',
				'formello/actions-more',
			);
		}

		return $allowed_block_types;

	}

}
