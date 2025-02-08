<?php
/**
 * Tag replacer
 *
 * @package Formello
 */

namespace Formello\TagReplacers;

use Formello\TagReplacers\Fields;
use Formello\TagReplacers\Other;
use Formello\TagReplacers\Wp;

/**
 * Class Replacer
 */
class Replacer {

	/**
	 * Array containing the replacers.
	 *
	 * @var array
	 */
	protected $data = array();

	/**
	 * Array containing the replacers.
	 *
	 * @var array
	 */
	protected $replacers = array();

	/**
	 * Constructor
	 *
	 * @param array $data The data to replace.
	 */
	public function __construct( $data = array() ) {
		$this->replacers['fields'] = new Fields( $data );
		$this->replacers['other']  = new Other();
		$this->replacers['query']  = new Other();
		$this->replacers['meta']   = new Meta();
		$this->replacers['wp']     = new Wp();
	}

	/**
	 * Parse the template variables
	 *
	 * @param string $template The template variable.
	 */
	public function parse( $template ) {
		$pattern = '/\{\{ *(\w+)(?:\.([\w-]+))? *(?:\|\| *(\w+))? *\}\}/i';

		$result = preg_replace_callback( $pattern, array( $this, 'get_data' ), $template );

		return $result;
	}

	/**
	 * Parse the template variables
	 *
	 * @param string $matches The matches array.
	 */
	protected function get_data( $matches ) {

		if ( $matches ) {
			$tag     = $matches[1];
			$param   = ! isset( $matches[2] ) ? '' : $matches[2];
			$value = ! isset( $matches[3] ) ? '' : $matches[3];

			$result = $this->replace( $tag, $param, $value );
		}

		return $result;
	}

	/**
	 * Parse the template variables
	 *
	 * @param string $tag The tag variable.
	 * @param string $param The param variable.
	 * @param string $value Default value.
	 */
	protected function replace( $tag, $param, $value = '' ) {
		$replacement = $this->replacers[ $tag ];

		if ( array_key_exists( $tag, $this->replacers ) ) {
			$value = method_exists( $replacement, $param ) ? $replacement->$param() : $value;
		}

		if ( 'query' === $tag ) {
			$value = $this->replacers['other']->get_query( $param );
		}

		if ( 'fields' === $tag ) {
			$value = $replacement->get_data( $param );
		}

		if ( 'meta' === $tag ) {
			$value = $this->replacers['wp']->post_meta( $param );
		}

		return ! empty( $value ) ? $value : $value;
	}
}
