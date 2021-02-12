<?php

namespace Formello\TagReplacers;

class Other {

    public function system_date() {
        $format = get_option( 'date_format' );
        if ( empty( $format ) ) {
            $format = 'Y/m/d';
        }
        return date( $format, time() );
    }

    public function system_time() {
        return date_i18n( get_option( 'time_format' ), current_time( 'timestamp' ) );
    }

    public function user_ip() {
        $ip = '127.0.0.1';
        if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
            //check ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
            //to check ip is pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } elseif( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }

}
