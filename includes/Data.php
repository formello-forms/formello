<?php

namespace Formello;

class Data {

	private $replacer;
	private $raw;
	private $form_id;
	private $ignored_field_names;
	private $data        = array();
	private $ip_address  = '';
	private $user_agent  = '';
	private $referer_url = '';
	private $submitted_at;

	public function __construct( $data, $form_id, $ignored_field_names = [] ){
        $this->replacer = new TagReplacers\Replacer();
		$this->raw = $data;
		$this->form_id = $form_id;
		$this->ignored_field_names = $ignored_field_names;
		$this->process( $data );
	}

	public function process( $data ){
        // filter out ignored field names
        foreach ( $data as $key => $value ) {
            if ( $key[0] === '_' || in_array( $key, $this->ignored_field_names ) ) {
                unset( $data[ $key ] );
                continue;
            }

            // this detects the WPBruiser token field to ensure it isn't stored
            // CAVEAT: this will detect any non-uppercase string with 2 dashes in the field name and no whitespace in the field value
            if ( class_exists('GoodByeCaptcha') && is_string( $key ) && is_string( $value ) && strtoupper( $key ) !== $key && substr_count( $key, '-' ) >= 2 && substr_count( trim( $value ), ' ' ) === 0 ) {
                unset( $data[ $key ] );
                continue;
            }

            $this->data[ $key ] = $this->sanitize( $value );
        }
        $this->ip_address   = ! empty( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( $_SERVER['REMOTE_ADDR'] ) : '';
        $this->user_agent   = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] ) : '';
        $this->referer_url  = ! empty( $_SERVER['HTTP_REFERER'] ) ? sanitize_text_field( $_SERVER['HTTP_REFERER'] ) : '';
        $this->submitted_at = gmdate( 'Y-m-d H:i:s' );
		
	}

    /**
    * Sanitize array with values before saving. Can be called recursively.
    *
    * @param mixed $value
    * @return mixed
    */
    public function sanitize( $value ) {
        if ( is_string( $value ) ) {
            // do nothing if empty string
            if ( $value === '' ) {
                return $value;
            }

            // strip slashes
            $value = stripslashes( $value );

            // strip all whitespace
            $value = trim( $value );

            // convert &amp; back to &
            $value = html_entity_decode( $value, ENT_NOQUOTES );
            $value= $this->replaceTags( $value );

        } elseif ( is_array( $value ) || is_object( $value ) ) {
            $new_value = array();
            $vars      = is_array( $value ) ? $value : get_object_vars( $value );

            // do nothing if empty array or object
            if ( count( $vars ) === 0 ) {
                return $value;
            }

            foreach ( $vars as $key => $sub_value ) {
                // strip all whitespace & HTML from keys (!)
                $key = trim( strip_tags( $key ) );

                // sanitize sub value
                $new_value[ $key ] = $this->sanitize( $sub_value );
                $new_value[ $key ] = $this->replaceTags( $sub_value );
            }

            $value = is_object( $value ) ? (object) $new_value : $new_value;
        }

        return $value;
    }

    private function replaceTags( $template ){

    	//if( strpos( $template, '{{' ) !== false ){
	        $template = $this->replacer->parse( $template );
    	//}

        return $template;

    }

	public function save() {
		global $wpdb;
		$table = $wpdb->prefix . 'formello_submissions';
		$data = array(
			'data'    => json_encode( $this->data ),
			'form_id' => $this->form_id,
		);

		foreach ( array( 'ip_address', 'user_agent', 'submitted_at', 'referer_url' ) as $prop ) {
			$data[ $prop ] = $this->$prop;
		}

		if ( ! empty( $this->id ) ) {
            $wpdb->prepare(
                $wpdb->update( $table, $data, array( 'id' => $this->id ) );
            );
			return;
		}

		// insert new row
		$num_rows = $wpdb->insert( $table, $data );
		if ( $num_rows > 0 ) {
			$this->id = $wpdb->insert_id;
		}
	}

	/**
	 * @param $object
	 * @return Submission
	 */
	public static function from_object( $object ) {
		$data = empty( $object->data ) ? array() : (array) json_decode( $object->data, true );

		$submission               = new Submission();
		$submission->id           = (int) $object->id;
		$submission->form_id      = (int) $object->form_id;
		$submission->data         = $data;
		$submission->ip_address   = (string) $object->ip_address;
		$submission->user_agent   = (string) $object->user_agent;
		$submission->referer_url  = (string) $object->referer_url;
		$submission->submitted_at = $object->submitted_at;
		return $submission;
	}

	public function __get( $name ){
		return $this->$name;
	}

}
