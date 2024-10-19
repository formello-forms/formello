<?php
/**
 * Block handler.
 *
 * @link       https://www.francescopepe.com
 * @since      1.0.0
 *
 * @package    Formello
 * @subpackage Formello/includes
 */

namespace Formello;

use WP_HTML_Tag_Processor;

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
	 * The ID of this plugin.
	 *
	 * @since    2.6.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    2.6.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * The main file of this plugin.
	 *
	 * @since    2.6.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $entry_point;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 2.6.0
	 * @param string $plugin_name The name of this plugin.
	 * @param string $version     The version of this plugin.
	 * @param string $entry_point The main file of this plugin.
	 */
	public function __construct( $plugin_name, $version, $entry_point ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->entry_point = $entry_point;
		add_shortcode( 'formello', array( $this, 'do_reusable_block' ) );
	}

	/**
	 * Register our dynamic blocks.
	 *
	 * @since 1.2.0
	 */
	public function register_blocks() {

		register_block_type_from_metadata(
			plugin_dir_path( $this->entry_point ) . 'build/blocks/library',
			array(
				'render_callback' => array( $this, 'do_reusable_block' ),
			)
		);

		register_block_type_from_metadata(
			plugin_dir_path( $this->entry_point ) . 'build/blocks/form',
		);

		register_block_type_from_metadata(
			plugin_dir_path( $this->entry_point ) . 'build/blocks/input',
		);

		register_block_type_from_metadata(
			plugin_dir_path( $this->entry_point ) . 'build/blocks/textarea',
		);

		register_block_type_from_metadata(
			plugin_dir_path( $this->entry_point ) . 'build/blocks/select',
		);

		register_block_type_from_metadata(
			plugin_dir_path( $this->entry_point ) . 'build/blocks/fieldset'
		);

		register_block_type_from_metadata(
			plugin_dir_path( $this->entry_point ) . 'build/blocks/multichoices'
		);

		register_block_type_from_metadata(
			plugin_dir_path( $this->entry_point ) . 'build/blocks/output'
		);

		register_block_type_from_metadata(
			plugin_dir_path( $this->entry_point ) . 'build/blocks/button',
		);
	}

	/**
	 * Render form block
	 *
	 * @param array $attributes The attributes of block.
	 */
	public function do_reusable_block( $attributes ) {

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

		wp_interactivity_config(
			'formello',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce( '_formello' ),
				'settings' => \Formello\Utils\formello_frontend_options(),
			)
		);

		$form_context = \Formello\Utils\formello_form_context( $attributes['ref'] );

		if ( $form_context['enableJsValidation'] ) {
			// phpcs:ignore
			wp_enqueue_script( 'bouncer', 'https://cdn.jsdelivr.net/gh/cferdinandi/bouncer@1.4.6/dist/bouncer.min.js' );
		}

		if ( $form_context['captchaEnabled'] && 'reCaptcha' === $form_context['captchaType'] ) {
			// phpcs:ignore
			wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js' );
		}
		if ( $form_context['captchaEnabled'] && 'hCaptcha' === $form_context['captchaType'] ) {
			// phpcs:ignore
			wp_enqueue_script( 'hcaptcha', 'https://js.hcaptcha.com/1/api.js' );
		}

		wp_interactivity_state(
			'formello',
			array(
				'captcha' => array(
					'enabled' => $form_context['captchaEnabled'] ?? false,
					'type' => $form_context['captchaType'] ?? 'recaptcha',
					'version' => $form_context['version'] ?? '1',
				),
				'errors' => array(),
			)
		);

		$content = do_blocks( $form->post_content );

		$p = new WP_HTML_Tag_Processor( $content );

		if ( $p->next_tag( 'form' ) ) {
			$p->set_attribute( 'data-wp-interactive', 'formello' );
			$p->set_attribute( 'data-wp-init', 'callbacks.init' );
			$p->set_attribute( 'data-wp-context', wp_json_encode( $form_context ) );
			$p->set_attribute( 'data-wp-on--submit', 'actions.sendForm' );
			$p->set_attribute( 'data-id', $attributes['ref'] );
		}

		if ( $p->next_tag( array( 'tag_name' => 'input', 'class_name' => 'formello-hp' ) ) ) {
			$p->set_attribute( 'name', '_formello_h' . $attributes['ref'] );
			$p->set_attribute( 'aria-label', __( 'If you are human, leave this field blank.', 'formello' ) );
		}

		return do_blocks( $p->get_updated_html() );
	}

	/**
	 * Add formello block category
	 *
	 * @param  array $categories The categories of Gutenberg.
	 */
	public function register_block_category( $categories ) {
		$currentScreen = get_current_screen();
		if ( 'formello' === $currentScreen->id ) {
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
		return array_merge(
			$categories,
			array(
				array(
					'slug'  => 'formello',
					'title' => __( 'Formello' ),
				),
			),
		);
	}

	/**
	 * Add formello block pattern category
	 */
	public function register_block_pattern_category() {
		register_block_pattern_category(
			'formello',
			array( 'label' => __( 'Form', 'formello' ) )
		);

		$patterns = json_decode(
			file_get_contents(
				plugin_dir_path( $this->entry_point ) . 'assets/templates/patterns.json'
			),
			true
		);

		if ( ! $patterns ) {
			return;
		}

		foreach ( $patterns as $pattern ) {
			if ( empty( $pattern['name'] ) ) {
				continue;
			}
			register_block_pattern(
				$pattern['name'],
				$pattern
			);
		}
	}
}
