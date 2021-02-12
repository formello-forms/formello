<?php

namespace Formello\Rakit\Validation\Rules;

use Formello\Rakit\Validation\Rule;
class Accepted extends \Formello\Rakit\Validation\Rule
{
    /** @var bool */
    protected $implicit = \true;
    /** @var string */
    protected $message = "The :attribute must be accepted";
    /**
     * Check the $value is accepted
     *
     * @param mixed $value
     * @return bool
     */
    public function check($value) : bool
    {
        $acceptables = ['yes', 'on', '1', 1, \true, 'true'];
        return \in_array($value, $acceptables, \true);
    }
}
