<?php
/**
 * Block handler.
 *
 * @package Formello
 */

namespace Formello;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Block Handler
 *
 * @since 1.0.0
 */
class Blocks {

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
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'admin_init', array( $this, 'register_block_pattern_category' ) );
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ) );
		add_shortcode( 'formello', array( $this, 'do_reusable_block' ) );
	}

	/**
	 * Register our dynamic blocks.
	 *
	 * @since 1.2.0
	 */
	public function register_blocks() {

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/library',
			array(
				'render_callback' => array( $this, 'do_reusable_block' ),
			)
		);

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/input',
			array(
				'render_callback' => array( $this, 'do_input_block' ),
			)
		);

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/textarea'
		);

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/select',
			array(
				'render_callback' => array( $this, 'do_input_block' ),
			)
		);

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/fieldset'
		);

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/button',
			array(
				'render_callback' => array( $this, 'do_button_block' ),
			)
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/form'
		);
	}

	/**
	 * Render form block on frontend
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 * @param  object $block The bock object.
	 */
	public function do_formello_block( $attributes, $content = '', $block ) {

		do_action( 'formello_block_render' );

		return $content;
	}

	/**
	 * Render form block
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_reusable_block( $attributes, $content = '' ) {
		if ( empty( $attributes['id'] ) ) {
			return '';
		}

		$form = get_post( $attributes['id'] );

		if ( ! $form || 'formello_form' !== $form->post_type ) {
			return '';
		}

		if ( 'publish' !== $form->post_status || ! empty( $form->post_password ) ) {
			return '';
		}

		return do_blocks( $form->post_content );
	}

	/**
	 * Render input block
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_input_block( $attributes, $content = '' ) {
		$replacer = new TagReplacers\Replacer();
		$content   = $replacer->parse( $content );

		do_action( 'formello_input_block_render', $attributes, $content );

		if ( ! empty( $attributes['type'] ) && 'password' === $attributes['type'] ) {
			wp_enqueue_script( 'password-strength-meter' );
		}

		if ( empty( $attributes['multiple'] ) ) {
			return $content;
		}

		if ( class_exists( '\WP_HTML_Tag_Processor' ) ) {
			$p = new \WP_HTML_Tag_Processor( $content );

			if ( $p->next_tag( array( 'tag_name' => 'input' ) ) ) {
				$p->set_attribute( 'name', $p->get_attribute( 'name' ) . '[]' );
			}

			return $p->get_updated_html();
		}

		return $content;
	}

	/**
	 * Render button block
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_button_block( $attributes, $content = '' ) {
		if ( ! is_admin() && ! defined( 'REST_REQUEST' ) ) {
			$nonce = wp_nonce_field( '_formello', '_formello', true, false );
			$content .= $nonce;
		}

		return $content;
	}

	/**
	 * Add formello block category
	 *
	 * @param  array $categories The categories of Gutenberg.
	 */
	public function register_block_category( $categories ) {
		return array_merge(
			array(
				array(
					'slug'  => 'formello',
					'title' => __( 'Formello' ),
				),
			),
			$categories
		);
	}

	/**
	 * Add formello block pattern category
	 */
	public function register_block_pattern_category() {
		register_block_pattern_category(
			'form',
			array( 'label' => __( 'Form', 'formello' ) )
		);

		$patterns = get_transient( 'formello_patterns' );
		$templates = get_transient( 'formello_templates' );

		if ( $patterns && $templates ) {
			$templates = array_merge( $patterns, $templates );
		}

		if ( ! $templates ) {
			return;
		}

		foreach ( $templates as $pattern ) {
			register_block_pattern(
				$pattern['name'],
				$pattern
			);
		}

	}

}
Blocks::get_instance();
