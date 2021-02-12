<?php

namespace Formello\TagReplacers;

class Wp {

    protected $id = 'wp';

    public function __construct() 
    {
    }

    public function post_id() {
        global $post;

        if ( is_admin() && defined( 'DOING_AJAX' ) && DOING_AJAX ) {
            // If we are doing AJAX, use the referer to get the Post ID.
            $post_id = url_to_postid( wp_get_referer() );
        } elseif( $post ) {
            $post_id = $post->ID;
        } else {
            return false; // No Post ID found.
        }

        return $post_id;
    }

    public function post_title() {
        $post_id = $this->post_id();
        if( ! $post_id ) return;
        $post = get_post( $post_id );
        return ( $post ) ? $post->post_title : '';
    }

    public function post_url() {
        $post_id = $this->post_id();
        if( ! $post_id ) return;
        $post = get_post( $post_id );
        return ( $post ) ? get_permalink( $post->ID ) : '';
    }

    public function post_author() {
        $post_id = $this->post_id();
        if( ! $post_id ) return;
        $post = get_post( $post_id );
        if( ! $post ) return '';
        $author = get_user_by( 'id', $post->post_author);
        return $author->display_name;
    }

    public function post_author_email() {
        $post_id = $this->post_id();
        if( ! $post_id ) return;
        $post = get_post( $post_id );
        if( ! $post ) return '';
        $author = get_user_by( 'id', $post->post_author );
        return $author->user_email;
    }

    public function user_id() {
        $current_user = wp_get_current_user();

        return ( $current_user ) ? $current_user->ID : '';
    }

    public function user_first_name() {
        $current_user = wp_get_current_user();

        return ( $current_user ) ? $current_user->user_firstname : '';
    }

    public function user_last_name() {
        $current_user = wp_get_current_user();

        return ( $current_user ) ? $current_user->user_lastname : '';
    }

    public function user_display_name() {
        $current_user = wp_get_current_user();

        return ( $current_user ) ? $current_user->display_name : '';
    }

	public function user_username()
	{
		$current_user = wp_get_current_user();

		return ( $current_user ) ? $current_user->user_nicename : '';
	}

    public function user_email() {
        $current_user = wp_get_current_user();

        return ( $current_user ) ? $current_user->user_email : '';
    }

    public function user_url() {
        $current_user = wp_get_current_user();

        return ( $current_user ) ? $current_user->user_url : '';
    }

    public function admin_email() {
        return get_option( 'admin_email' );
    }

    public function site_title() {
        return get_bloginfo( 'name' );
    }

    public function site_url() {
        return get_bloginfo( 'url' );
    }

    public function post_meta( $meta ) {
        $post_id = $this->post_id();
        if( ! $post_id ) return;
        $result = get_post_meta( $post_id, $meta );

        return ( $result ) ?: '';
    }

}
