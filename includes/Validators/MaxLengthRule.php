<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://www.francescopepe.com
 * @since      1.0.0
 *
 * @package    Formello
 * @subpackage Formello/includes
 */

namespace Formello\Validators;

use Rakit\Validation\Rule;

/**
 * Max length Validator
 */
class MaxLengthRule extends Rule {

	/**
	 * {inheritDoc}
	 *
	 * @var string
	 */
	protected $message = ':attribute :value has been used';

	/**
	 * {inheritDoc}
	 *
	 * @var array
	 */
	protected $fillableParams = array( 'maxlength' );

	/**
	 * {inheritDoc}
	 */
	public function __construct() {
	}

	/**
	 * {inheritDoc}
	 *
	 * @param string $value Value to check.
	 * @return boolean
	 */
	public function check( $value ): bool {
		$this->requireParameters( $this->fillableParams );

		$length = (int) $this->parameter( 'maxlength' );

		// true for valid, false for invalid.
		return strlen( $value ) <= $length;
	}
}
