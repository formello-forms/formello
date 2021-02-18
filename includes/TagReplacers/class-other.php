<?php

namespace Formello\TagReplacers;

/**
 * Class Other
 */
class Other {

	/**
	 * Retrieve system date
	 */
	public function system_date() {
		$format = get_option( 'date_format' );
		if ( empty( $format ) ) {
			$format = 'Y/m/d';
		}
		return gmdate( $format, time() );
	}

	/**
	 * Retrieve system time
	 */
	public function system_time() {
		return date_i18n( get_option( 'time_format' ), current_time( 'timestamp' ) );
	}

	/**
	 * Retrieve user IP
	 */
	public function user_ip() {
		$ip = '127.0.0.1';
		if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
			// check ip from share internet.
			$ip = sanitize_text_field( wp_unslash( $_SERVER['HTTP_CLIENT_IP'] ) );
		} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			// to check ip is pass from proxy.
			$ip = sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_FORWARDED_FOR'] ) );
		} elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
			$ip = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
		}
		return $ip;
	}

}
