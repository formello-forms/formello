<?php

namespace Formello\Rakit\Validation\Rules;

use Formello\Rakit\Validation\Rule;
class Ip extends \Formello\Rakit\Validation\Rule
{
    /** @var string */
    protected $message = "The :attribute is not valid IP Address";
    /**
     * Check the $value is valid
     *
     * @param mixed $value
     * @return bool
     */
    public function check($value) : bool
    {
        return \filter_var($value, \FILTER_VALIDATE_IP) !== \false;
    }
}
