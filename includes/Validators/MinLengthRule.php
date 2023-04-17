<?php

namespace Formello\Validators;

use Rakit\Validation\Rule;

class MinLengthRule extends Rule
{

    /** @var string */
    protected $message = ":attribute :value has been used";

    /** @var array */
    protected $fillableParams = ['minlength'];

    public function __construct()
    {
    }

    public function check( $value ): bool
    {
        $this->requireParameters( $this->fillableParams );

        $length = (int) $this->parameter('minlength');

        // true for valid, false for invalid
        return strlen( $value ) >= $length;
    }
}