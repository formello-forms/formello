<?php

namespace Formello\Rakit\Validation\Tests;

use Formello\Rakit\Validation\Rule;
class Even extends \Formello\Rakit\Validation\Rule
{
    protected $message = "The :attribute must be even";
    public function check($value) : bool
    {
        if (!\is_numeric($value)) {
            return \false;
        }
        return $value % 2 === 0;
    }
}
