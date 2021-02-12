<?php

namespace Formello\TagReplacers;

class Replacer {

	public $replacers = [];

	/**
	* Constructor
	*/
    public function __construct() {
        $this->replacers[ 'fields' ] = new Fields();
    	$this->replacers[ 'other' ] = new Other();
    	$this->replacers[ 'wp' ] = new Wp();
	}

    public function parse( $template ){
        preg_match('/\{\{ *(\w+)(?:\.([\w\.]+))? *(?:\|\| *(\w+))? *\}\}/', $template, $matches);

        if(  $matches ){
            $tag     = $matches[1];
            $param   = ! isset( $matches[2] ) ? '' : $matches[2];
            $default = ! isset( $matches[3] ) ? $template : $matches[3];

            $template = $this->getData( $tag, $param, $default );

        };

        return $template;
    }

    protected function getData( $tag, $param, $default ) {
        $replacement = $this->replacers[ $tag ];

        if( array_key_exists( $tag,  $this->replacers ) ){
            $value = method_exists( $replacement, $param ) ? $replacement->$param() : $default;
        }

        if( $tag === 'fields' ){
            $value = $replacement->getData( $param );
        }

        if( $tag === 'meta' ){
            $value = $this->replacers[ 'wp' ]->post_meta( $param );
        }

        return ! empty( $value ) ? $value : $template;

    }

}
