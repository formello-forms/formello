<?php
namespace Formello;

/**
 * Scripts and Styles Class
 */
class Assets {

    function __construct() {

        if ( is_admin() ) {
            add_action( 'admin_enqueue_scripts', [ $this, 'register' ], 5 );
        } else {
            add_action( 'wp_enqueue_scripts', [ $this, 'register' ], 5 );
            add_filter('clean_url', [ $this, 'add_async_forscript' ], 11, 1);
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
     * @param  array $scripts
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
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'settings' => get_option( 'formello' ),
            )
        );
    }

    /**
     * Register styles
     *
     * @param  array $styles
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
     */
    public function get_scripts() {
        $prefix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '.min' : '';

        $script_asset_path = FORMELLO_PATH . "/build/index.asset.php";
        if ( ! file_exists( $script_asset_path ) ) {
            throw new \Error(
                'You need to run `npm start` or `npm run build` for the "create-block/formello" block first.'
            );
        }

        $script_asset = require( $script_asset_path );

        $scripts = [
            'formello-form-block-editor' => [
                'src'       => FORMELLO_ASSETS . '/index.js',
                'version'   => $script_asset['version'],
                'deps'      => $script_asset['version'],
                'in_footer' => true
            ],
            'formello-form-block' => [
                'src'       => FORMELLO_ASSETS . '/frontend.js',
                'version'   => $script_asset['version'],
                'in_footer' => true,
                //'deps'   => [ 'formello-recaptcha' ],
            ],
            'formello-recaptcha' => [
                'src'       => 'https://www.google.com/recaptcha/api.js#asyncload',
                'in_footer' => true
            ],
        ];

        return $scripts;
    }

    /**
     * Get registered styles
     *
     * @return array
     */
    public function get_styles() {

        $styles = [
            'formello-form-block-editor' => [
                'src' =>  FORMELLO_ASSETS . '/index.css'
            ],
            'formello-form-block' => [
                'src' =>  FORMELLO_ASSETS . '/style-index.css'
            ],
        ];

        return $styles;
    }

    public function add_async_forscript( $url ) {

        if ( strpos( $url, '#asyncload' )===false )
            return $url;
        else if ( is_admin() )
            return str_replace( '#asyncload', '', $url );
        else
            return str_replace( '#asyncload', '', $url ) . "' async='async' defer='defer"; 
    }

}
