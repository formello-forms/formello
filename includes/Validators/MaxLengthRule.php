<?php

namespace Formello\Validators;

use Rakit\Validation\Rule;

class MaxLengthRule extends Rule
{

    /** @var string */
    protected $message = ":attribute :value has been used";

    /** @var array */
    protected $fillableParams = ['maxlength'];

    public function __construct()
    {
    }

    public function check( $value ): bool
    {
        $this->requireParameters( $this->fillableParams );

        $length = (int) $this->parameter('maxlength');

        // true for valid, false for invalid
        return strlen( $value ) <= $length;
    }
}