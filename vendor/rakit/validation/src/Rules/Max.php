<?php

namespace Formello\Rakit\Validation\Rules;

use Formello\Rakit\Validation\Rule;
class Max extends \Formello\Rakit\Validation\Rule
{
    use Traits\SizeTrait;
    /** @var string */
    protected $message = "The :attribute maximum is :max";
    /** @var array */
    protected $fillableParams = ['max'];
    /**
     * Check the $value is valid
     *
     * @param mixed $value
     * @return bool
     */
    public function check($value) : bool
    {
        $this->requireParameters($this->fillableParams);
        $max = $this->getBytesSize($this->parameter('max'));
        $valueSize = $this->getValueSize($value);
        if (!\is_numeric($valueSize)) {
            return \false;
        }
        return $valueSize <= $max;
    }
}
