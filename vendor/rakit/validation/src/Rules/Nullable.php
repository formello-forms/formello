<?php

namespace Formello\Rakit\Validation\Rules;

use Formello\Rakit\Validation\Rule;
class Nullable extends \Formello\Rakit\Validation\Rule
{
    /**
     * Check the $value is valid
     *
     * @param mixed $value
     * @return bool
     */
    public function check($value) : bool
    {
        return \true;
    }
}
