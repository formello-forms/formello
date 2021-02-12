<?php

namespace Formello\Rakit\Validation\Rules;

use Formello\Rakit\Validation\Rule;
class TypeArray extends \Formello\Rakit\Validation\Rule
{
    /** @var string */
    protected $message = "The :attribute must be array";
    /**
     * Check the $value is valid
     *
     * @param mixed $value
     * @return bool
     */
    public function check($value) : bool
    {
        return \is_array($value);
    }
}
