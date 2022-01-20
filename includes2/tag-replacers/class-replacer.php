<?php

namespace Formello\TagReplacers;

/**
 * Class Replacer
 */
class Replacer {

	/**
	 * Array containing the replacers.
	 *
	 * @var replacers
	 */
	protected $replacers = array();

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->replacers['fields'] = new Fields();
		$this->replacers['other']  = new Other();
		$this->replacers['wp']     = new Wp();
	}

	/**
	 * Parse the template variables
	 *
	 * @param string $template The template variable.
	 */
	public function parse( $template ) {
		preg_match( '/\{\{ *(\w+)(?:\.([\w\.]+))? *(?:\|\| *(\w+))? *\}\}/', $template, $matches );

		if ( $matches ) {
			$tag     = $matches[1];
			$param   = ! isset( $matches[2] ) ? '' : $matches[2];
			$default = ! isset( $matches[3] ) ? $template : $matches[3];

			$template = $this->get_data( $tag, $param, $default );

		};

		return $template;
	}

	/**
	 * Parse the template variables
	 *
	 * @param string $tag The tag variable.
	 * @param string $param The param variable.
	 * @param string $default Default value.
	 */
	protected function get_data( $tag, $param, $default ) {
		$replacement = $this->replacers[ $tag ];

		if ( array_key_exists( $tag, $this->replacers ) ) {
			$value = method_exists( $replacement, $param ) ? $replacement->$param() : $default;
		}

		if ( 'fields' === $tag ) {
			$value = $replacement->get_data( $param );
		}

		if ( 'meta' === $tag ) {
			$value = $this->replacers['wp']->post_meta( $param );
		}

		return ! empty( $value ) ? $value : $default;

	}

}
