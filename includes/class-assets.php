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
class Assets {

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

		if ( is_admin() ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'register' ), 5 );
		} else {
			add_action( 'wp_enqueue_scripts', array( $this, 'register' ), 5 );
			add_filter( 'clean_url', array( $this, 'add_async_forscript' ), 11, 1 );
		}
	}

	/**
	 * Register our app scripts and styles
	 *
	 * @return void
	 */
	public function register() {
		$this->register_scripts( $this->get_scripts() );
		$this->register_styles( $this->get_styles() );
	}

	/**
	 * Register scripts
	 *
	 * @param  array $scripts The array of scripts.
	 *
	 * @return void
	 */
	private function register_scripts( $scripts ) {

		foreach ( $scripts as $handle => $script ) {
			$deps      = isset( $script['deps'] ) ? $script['deps'] : false;
			$in_footer = isset( $script['in_footer'] ) ? $script['in_footer'] : false;
			$version   = isset( $script['version'] ) ? $script['version'] : FORMELLO_VERSION;

			wp_register_script( $handle, $script['src'], $deps, $version, $in_footer );
		}
		wp_set_script_translations( 'formello-form-block-editor', 'formello' );
		wp_localize_script(
			'formello-form-block-editor',
			'formello',
			array(
				'templatesURL' => admin_url( 'edit.php?post_type=formello_form' ),
			)
		);
	}

	/**
	 * Register styles
	 *
	 * @param  array $styles The array of styles.
	 *
	 * @return void
	 */
	public function register_styles( $styles ) {
		foreach ( $styles as $handle => $style ) {
			$deps = isset( $style['deps'] ) ? $style['deps'] : false;

			wp_register_style( $handle, $style['src'], $deps, FORMELLO_VERSION );
		}
	}

	/**
	 * Get all registered scripts
	 *
	 * @return array
	 * @throws \Error Assets not loaded.
	 */
	public function get_scripts() {
		$prefix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '.min' : '';

		$script_asset_path = FORMELLO_PATH . '/build/index.asset.php';
		if ( ! file_exists( $script_asset_path ) ) {
			throw new \Error(
				'You need to run `npm start` or `npm run build` for the "create-block/formello" block first.'
			);
		}

		$script_asset = require $script_asset_path;

		$scripts = array(
			'formello-form-block-editor' => array(
				'src'       => FORMELLO_ASSETS . '/index.js',
				'version'   => $script_asset['version'],
				'deps'      => $script_asset['dependencies'],
				'in_footer' => true,
			),
			'formello-form-block'        => array(
				'src'       => FORMELLO_ASSETS . '/frontend.js',
				'version'   => $script_asset['version'],
				'in_footer' => true,
			),
			'formello-recaptcha'         => array(
				'src'       => 'https://www.google.com/recaptcha/api.js#asyncload',
				'in_footer' => true,
			),
			'formello-settings'          => array(
				'src'       => FORMELLO_ASSETS . '/dashboard.js',
				'deps'      => array( 'wp-api', 'wp-i18n', 'wp-components', 'wp-element', 'wp-api-fetch' ),
				'version'   => $script_asset['version'],
				'in_footer' => true,
			),
			'formello-flatpickr'         => array(
				'src'       => 'https://cdn.jsdelivr.net/npm/flatpickr',
				'in_footer' => true,
			),
		);

		/**
		* Filter to add additional JS to dashboard.
		*
		* @param array $scripts
		*/
		$scripts = apply_filters( 'formello_scripts', $scripts );

		return $scripts;
	}

	/**
	 * Get registered styles
	 *
	 * @return array
	 */
	public function get_styles() {

		$styles = array(
			'formello-form-block-editor' => array(
				'src' => FORMELLO_ASSETS . '/index.css',
			),
			'formello-form-block'        => array(
				'src' => FORMELLO_ASSETS . '/style-index.css',
			),
			'formello-settings'          => array(
				'src'  => FORMELLO_ASSETS . '/dashboard.css',
				'deps' => array( 'wp-components' ),
			),
		);

		return $styles;
	}

	/**
	 * Get async loaded string
	 *
	 * @param string $url The url of script.
	 * @return string
	 */
	public function add_async_forscript( $url ) {

		if ( strpos( $url, '#asyncload' ) === false ) {
			return $url;
		} elseif ( is_admin() ) {
			return str_replace( '#asyncload', '', $url );
		} else {
			return str_replace( '#asyncload', '', $url ) . "' async='async' defer='defer";
		}
	}

}
