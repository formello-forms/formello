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
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/textarea',
			array(
				'render_callback' => array( $this, 'do_textarea_block' ),
			)
		);

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/select',
			array(
				'render_callback' => array( $this, 'do_select_block' ),
			)
		);

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/fieldset'
		);

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/output'
		);

		register_block_type(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/button',
			array(
				'render_callback' => array( $this, 'do_button_block' ),
			)
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/form',
			array(
				'render_callback' => array( $this, 'do_formello_block' ),
			)
		);
	}

	/**
	 * Render form block on frontend
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_formello_block( $attributes, $content = '' ) {

		do_action( 'formello_block_render' );

		if ( $attributes['captchaEnabled'] && 'reCaptcha' === $attributes['captchaType'] ) {
			wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js' );
		}
		if ( $attributes['captchaEnabled'] && 'hCaptcha' === $attributes['captchaType'] ) {
			wp_enqueue_script( 'hcaptcha', 'https://js.hcaptcha.com/1/api.js' );
		}

		return $content;
	}

	/**
	 * Render form block
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_reusable_block( $attributes, $content = '' ) {

		if ( empty( $attributes['ref'] ) ) {
			return '';
		}

		$form = get_post( $attributes['ref'] );

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

		do_action( 'formello_input_block_render', $attributes, $content );

		if ( ! empty( $attributes['type'] ) && 'password' === $attributes['type'] ) {
			wp_enqueue_script( 'password-strength-meter' );
		}

		if ( class_exists( '\WP_HTML_Tag_Processor' ) ) {
			$p = new \WP_HTML_Tag_Processor( $content );

			if ( $p->next_tag( array( 'tag_name' => 'input' ) ) ) {

				$p->set_attribute( 'value', $replacer->parse( $p->get_attribute( 'value' ) ) );

				if ( $p->get_attribute( 'multiple' ) ) {
					$p->set_attribute( 'name', $p->get_attribute( 'name' ) . '[]' );
				}
				$input_name = $p->get_attribute( 'name' );
				// phpcs:ignore
				if ( isset( $_POST[ $input_name ] ) ) {
					// phpcs:ignore
					$p->set_attribute( 'value', sanitize_text_field( $_POST[ $input_name ] ) );
				}
			}

			return $p->get_updated_html();
		}

		return $content;
	}

	/**
	 * Render input block
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_select_block( $attributes, $content = '' ) {

		if ( class_exists( '\WP_HTML_Tag_Processor' ) ) {
			$p = new \WP_HTML_Tag_Processor( $content );

			if ( $p->next_tag( array( 'tag_name' => 'select' ) ) ) {

				if ( $p->get_attribute( 'multiple' ) ) {

					$p->set_attribute( 'name', $p->get_attribute( 'name' ) . '[]' );
				}
			}

			return $p->get_updated_html();
		}

		return $content;
	}

	/**
	 * Render input block
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_textarea_block( $attributes, $content = '' ) {
		$replacer = new TagReplacers\Replacer();
		$content  = $replacer->parse( $content );

		if ( class_exists( '\WP_HTML_Tag_Processor' ) ) {
			$p = new \WP_HTML_Tag_Processor( $content );

			if ( $p->next_tag( array( 'tag_name' => 'textarea' ) ) ) {
				$textarea_name = $p->get_attribute( 'name' );

				// phpcs:ignore
				if ( isset( $_POST[ $textarea_name ] ) ) {
					// phpcs:ignore
					$content = str_replace( '</textarea>', wp_kses_post( $_POST[ $textarea_name ] ) . '</textarea>', $p->get_updated_html() );
				}
			}
		}

		return $content;
	}

	/**
	 * Render button block
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 * @param  object $block The bock.
	 */
	public function do_button_block( $attributes, $content = '', $block ) {
		if ( ! is_admin() && ! defined( 'REST_REQUEST' ) ) {
			$nonce    = wp_nonce_field( '_formello', '_formello', true, false );
			$content .= $nonce;
		}
		$settings = get_option( 'formello' );

		$captcha = '';
		if ( $block->context['formello/captchaEnabled'] && 'reCaptcha' === $block->context['formello/captchaType'] ) {
			$captcha = sprintf(
				'<div class="g-recaptcha" data-sitekey="%s" data-size="%s" data-action="submit"></div>',
				$settings['reCaptcha']['site_key'],
				'1' === $settings['reCaptcha']['version'] ? 'normal' : 'invisible',
			);
		}
		if ( $block->context['formello/captchaEnabled'] && 'hCaptcha' === $block->context['formello/captchaType'] ) {
			$captcha = sprintf(
				'<div class="h-captcha" data-sitekey="%s" data-size="%s" data-action="submit"></div>',
				$settings['hCaptcha']['site_key'],
				'1' === $settings['hCaptcha']['version'] ? 'normal' : 'invisible',
			);
		}

		return $captcha . $content;
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
		register_block_pattern_category(
			'formello',
			array( 'label' => __( 'Formello', 'formello' ) )
		);

		$patterns = json_decode(
			file_get_contents(
				FORMELLO_PLUGIN_DIR . '/assets/templates/templates.json'
			),
			true
		);

		foreach ( $patterns as $pattern ) {
			register_block_pattern(
				$pattern['name'],
				$pattern
			);
		}
	}
}
Blocks::get_instance();
