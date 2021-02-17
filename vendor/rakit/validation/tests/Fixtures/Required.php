<?php

namespace Formello\Rakit\Validation\Tests;

use Formello\Rakit\Validation\Rule;
class Required extends \Formello\Rakit\Validation\Rule
{
    public function check($value) : bool
    {
        return \true;
    }
}
