<?php
namespace Formello;

/**
 * Frontend Pages Handler
 */
class Block {

    public function __construct() {
        add_action( 'init', [ $this, 'register_block' ] );
        add_filter( 'block_categories', [ $this, 'formello_block_category' ] );
    }

    /**
     * Render frontend app
     *
     * @param  array $atts
     * @param  string $content
     *
     * @return string
     */
    public function register_block( $atts, $content = '' ) {

        register_block_type( 'formello/form', array(

            'attributes'      => [
                'recaptchaEnabled'  => [
                    'type'      => 'boolean', 
                    'default'   => false, 
                ],
                'storeSubmissions'  => [
                    'type'      => 'boolean', 
                    'default'   => false, 
                ],
                'hide'  => [
                    'type'      => 'boolean', 
                    'default'   => false, 
                ],
            ],
            'editor_script'     => 'formello-form-block-editor',
            'editor_style'      => 'formello-form-block-editor',
            'style'             => 'formello-form-block',
            'script'            => 'formello-form-block',
            'render_callback'   => function( $attributes, $content = null ) {
                
                $settings = get_option( 'formello', formello_get_option_defaults() );
                $recaptchaUrl = 'https://www.google.com/recaptcha/api.js';

                if( $attributes['recaptchaEnabled'] && !empty( $settings['recaptcha']['site_key'] ) ){
                    if( (int)$settings['recaptcha']['version'] === 1 ){
                        wp_enqueue_script( 'google-recaptcha', $recaptchaUrl );
                    }else{
                        wp_enqueue_script( 'google-recaptcha', $recaptchaUrl . '?render=' . $settings['recaptcha']['site_key'] );
                    }
                }
                
                wp_enqueue_script( 'formello-form-block' );
                wp_enqueue_style( 'formello-form-block' );

                unset( $settings['integrations'] );
                unset( $settings['recaptcha'][ 'secret_key' ] );
                $settings = array_merge( $settings, $attributes );

                wp_localize_script( 
                    'formello-form-block', 
                    'formello',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'settings' => $settings
                    ) 
                );
                return $content;
            },
        ) );
    }

    function formello_block_category( $categories ) {
        return array_merge(
            $categories,
            array(
                array(
                    'slug' => 'formello',
                    'title' => __( 'Formello' ),
                ),
            )
        );
    }

}
