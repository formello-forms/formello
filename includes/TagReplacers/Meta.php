<?php
/**
 * Tag replacer
 *
 * @package Formello
 */

namespace Formello\TagReplacers;

/**
 * Class Meta
 */
class Meta {

	/**
	 * Constructor
	 */
	public function __construct() {
	}

	/**
	 * The post meta
	 *
	 * @param string $meta The meta.
	 */
	public function post_meta( $meta ) {
		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return;
		}
		$result = get_post_meta( $post_id, $meta );

		return is_scalar( $result ) ? $result : '';
	}
}
