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
				'name'      => 'Forms',
				'all_items' => 'Forms',
			),
			'show_in_menu' => 'formello',
			'show_in_rest' => true,
			'public' => true,
			'has_archive' => false,
			'exclude_from_search' => true,
			'publicly_queryable' => false,
			'query_var' => false,
			'supports' => array( 'title', 'editor' ),
			'rewrite' => array( 'slug' => 'formello_form' ),
			'menu_icon' => 'dashicons-feedback',
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
				'formello/form',
				'formello/input',
				'formello/inputflex',
				'formello/output',
				'formello/select',
				'formello/actions',
			);
		}

		return $allowed_block_types;

	}

}
