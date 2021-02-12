<?php

namespace Formello\Rakit\Validation\Rules;

use Formello\Rakit\Validation\Helper;
use Formello\Rakit\Validation\Rule;
class In extends \Formello\Rakit\Validation\Rule
{
    /** @var string */
    protected $message = "The :attribute only allows :allowed_values";
    /** @var bool */
    protected $strict = \false;
    /**
     * Given $params and assign the $this->params
     *
     * @param array $params
     * @return self
     */
    public function fillParameters(array $params) : \Formello\Rakit\Validation\Rule
    {
        if (\count($params) == 1 && \is_array($params[0])) {
            $params = $params[0];
        }
        $this->params['allowed_values'] = $params;
        return $this;
    }
    /**
     * Set strict value
     *
     * @param bool $strict
     * @return void
     */
    public function strict(bool $strict = \true)
    {
        $this->strict = $strict;
    }
    /**
     * Check $value is existed
     *
     * @param mixed $value
     * @return bool
     */
    public function check($value) : bool
    {
        $this->requireParameters(['allowed_values']);
        $allowedValues = $this->parameter('allowed_values');
        $or = $this->validation ? $this->validation->getTranslation('or') : 'or';
        $allowedValuesText = \Formello\Rakit\Validation\Helper::join(\Formello\Rakit\Validation\Helper::wraps($allowedValues, "'"), ', ', ", {$or} ");
        $this->setParameterText('allowed_values', $allowedValuesText);
        return \in_array($value, $allowedValues, $this->strict);
    }
}
