<?php
/**
 * Tag replacer
 *
 * @package Formello
 */

namespace Formello\TagReplacers;

/**
 * Class Wp
 */
class Wp {

	/**
	 * Constructor
	 */
	public function __construct() {
	}

	/**
	 * The post ID
	 */
	public function post_id() {
		global $post;

		if ( is_admin() && defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			// If we are doing AJAX, use the referer to get the Post ID.
			$post_id = url_to_postid( wp_get_referer() );
		} elseif ( $post ) {
			$post_id = $post->ID;
		} else {
			return false; // No Post ID found.
		}

		return $post_id;
	}

	/**
	 * The post title
	 */
	public function post_title() {
		$post_id = $this->post_id();
		if ( ! $post_id ) {
			return;
		}
		$post = get_post( $post_id );
		return ( $post ) ? $post->post_title : '';
	}

	/**
	 * The post URL
	 */
	public function post_url() {
		$post_id = $this->post_id();
		if ( ! $post_id ) {
			return;
		}
		$post = get_post( $post_id );
		return ( $post ) ? get_permalink( $post->ID ) : '';
	}

	/**
	 * The post author
	 */
	public function post_author() {
		$post_id = $this->post_id();
		if ( ! $post_id ) {
			return;
		}
		$post = get_post( $post_id );
		if ( ! $post ) {
			return '';
		}
		$author = get_user_by( 'id', $post->post_author );
		return $author->display_name;
	}

	/**
	 * The post author email
	 */
	public function post_author_email() {
		$post_id = $this->post_id();
		if ( ! $post_id ) {
			return;
		}
		$post = get_post( $post_id );
		if ( ! $post ) {
			return '';
		}
		$author = get_user_by( 'id', $post->post_author );
		return $author->user_email;
	}

	/**
	 * The user ID
	 */
	public function user_id() {
		$current_user = wp_get_current_user();

		return ( $current_user ) ? $current_user->ID : '';
	}

	/**
	 * The user first name
	 */
	public function user_first_name() {
		$current_user = wp_get_current_user();

		return ( $current_user ) ? $current_user->user_firstname : '';
	}

	/**
	 * The user last name
	 */
	public function user_last_name() {
		$current_user = wp_get_current_user();

		return ( $current_user ) ? $current_user->user_lastname : '';
	}

	/**
	 * The user display name
	 */
	public function user_display_name() {
		$current_user = wp_get_current_user();

		return ( $current_user ) ? $current_user->display_name : '';
	}

	/**
	 * The user username
	 */
	public function user_username() {
		$current_user = wp_get_current_user();

		return ( $current_user ) ? $current_user->user_nicename : '';
	}

	/**
	 * The user email
	 */
	public function user_email() {
		$current_user = wp_get_current_user();

		return ( $current_user ) ? $current_user->user_email : '';
	}

	/**
	 * The user url
	 */
	public function user_url() {
		$current_user = wp_get_current_user();

		return ( $current_user ) ? $current_user->user_url : '';
	}

	/**
	 * The admin email
	 */
	public function admin_email() {
		return get_option( 'admin_email' );
	}

	/**
	 * The site title
	 */
	public function site_title() {
		return get_bloginfo( 'name' );
	}

	/**
	 * The site url
	 */
	public function site_url() {
		return get_bloginfo( 'url' );
	}

	/**
	 * The post meta
	 *
	 * @param string $meta The meta.
	 */
	public function post_meta( $meta ) {
		$post_id = $this->post_id();
		if ( ! $post_id ) {
			return;
		}
		$result = get_post_meta( $post_id, $meta );

		return ( $result ) ? $result : '';
	}
}
