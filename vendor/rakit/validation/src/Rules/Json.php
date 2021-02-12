<?php

namespace Formello\Rakit\Validation\Rules;

use Formello\Rakit\Validation\Rule;
class Json extends \Formello\Rakit\Validation\Rule
{
    /** @var string */
    protected $message = "The :attribute must be a valid JSON string";
    /**
     * Check the $value is valid
     *
     * @param mixed $value
     * @return bool
     */
    public function check($value) : bool
    {
        if (!\is_string($value) || empty($value)) {
            return \false;
        }
        \json_decode($value);
        if (\json_last_error() !== \JSON_ERROR_NONE) {
            return \false;
        }
        return \true;
    }
}
