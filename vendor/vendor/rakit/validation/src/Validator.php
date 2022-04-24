<?php

namespace Formello\Rakit\Validation;

class Validator
{
    use \Formello\Rakit\Validation\Traits\TranslationsTrait, \Formello\Rakit\Validation\Traits\MessagesTrait;
    /** @var array */
    protected $translations = [];
    /** @var array */
    protected $validators = [];
    /** @var bool */
    protected $allowRuleOverride = \false;
    /** @var bool */
    protected $useHumanizedKeys = \true;
    /**
     * Constructor
     *
     * @param array $messages
     * @return void
     */
    public function __construct(array $messages = [])
    {
        $this->messages = $messages;
        $this->registerBaseValidators();
    }
    /**
     * Register or override existing validator
     *
     * @param mixed $key
     * @param \Rakit\Validation\Rule $rule
     * @return void
     */
    public function setValidator(string $key, \Formello\Rakit\Validation\Rule $rule)
    {
        $this->validators[$key] = $rule;
        $rule->setKey($key);
    }
    /**
     * Get validator object from given $key
     *
     * @param mixed $key
     * @return mixed
     */
    public function getValidator($key)
    {
        return isset($this->validators[$key]) ? $this->validators[$key] : null;
    }
    /**
     * Validate $inputs
     *
     * @param array $inputs
     * @param array $rules
     * @param array $messages
     * @return Validation
     */
    public function validate(array $inputs, array $rules, array $messages = []) : \Formello\Rakit\Validation\Validation
    {
        $validation = $this->make($inputs, $rules, $messages);
        $validation->validate();
        return $validation;
    }
    /**
     * Given $inputs, $rules and $messages to make the Validation class instance
     *
     * @param array $inputs
     * @param array $rules
     * @param array $messages
     * @return Validation
     */
    public function make(array $inputs, array $rules, array $messages = []) : \Formello\Rakit\Validation\Validation
    {
        $messages = \array_merge($this->messages, $messages);
        $validation = new \Formello\Rakit\Validation\Validation($this, $inputs, $rules, $messages);
        $validation->setTranslations($this->getTranslations());
        return $validation;
    }
    /**
     * Magic invoke method to make Rule instance
     *
     * @param string $rule
     * @return Rule
     * @throws RuleNotFoundException
     */
    public function __invoke(string $rule) : \Formello\Rakit\Validation\Rule
    {
        $args = \func_get_args();
        $rule = \array_shift($args);
        $params = $args;
        $validator = $this->getValidator($rule);
        if (!$validator) {
            throw new \Formello\Rakit\Validation\RuleNotFoundException("Validator '{$rule}' is not registered", 1);
        }
        $clonedValidator = clone $validator;
        $clonedValidator->fillParameters($params);
        return $clonedValidator;
    }
    /**
     * Initialize base validators array
     *
     * @return void
     */
    protected function registerBaseValidators()
    {
        $baseValidator = [
            'required' => new \Formello\Rakit\Validation\Rules\Required(),
            'required_if' => new \Formello\Rakit\Validation\Rules\RequiredIf(),
            'required_unless' => new \Formello\Rakit\Validation\Rules\RequiredUnless(),
            'required_with' => new \Formello\Rakit\Validation\Rules\RequiredWith(),
            'required_without' => new \Formello\Rakit\Validation\Rules\RequiredWithout(),
            'required_with_all' => new \Formello\Rakit\Validation\Rules\RequiredWithAll(),
            'required_without_all' => new \Formello\Rakit\Validation\Rules\RequiredWithoutAll(),
            'email' => new \Formello\Rakit\Validation\Rules\Email(),
            'alpha' => new \Formello\Rakit\Validation\Rules\Alpha(),
            'numeric' => new \Formello\Rakit\Validation\Rules\Numeric(),
            'alpha_num' => new \Formello\Rakit\Validation\Rules\AlphaNum(),
            'alpha_dash' => new \Formello\Rakit\Validation\Rules\AlphaDash(),
            'alpha_spaces' => new \Formello\Rakit\Validation\Rules\AlphaSpaces(),
            'in' => new \Formello\Rakit\Validation\Rules\In(),
            'not_in' => new \Formello\Rakit\Validation\Rules\NotIn(),
            'min' => new \Formello\Rakit\Validation\Rules\Min(),
            'max' => new \Formello\Rakit\Validation\Rules\Max(),
            'between' => new \Formello\Rakit\Validation\Rules\Between(),
            'url' => new \Formello\Rakit\Validation\Rules\Url(),
            'integer' => new \Formello\Rakit\Validation\Rules\Integer(),
            'boolean' => new \Formello\Rakit\Validation\Rules\Boolean(),
            'ip' => new \Formello\Rakit\Validation\Rules\Ip(),
            'ipv4' => new \Formello\Rakit\Validation\Rules\Ipv4(),
            'ipv6' => new \Formello\Rakit\Validation\Rules\Ipv6(),
            'extension' => new \Formello\Rakit\Validation\Rules\Extension(),
            'array' => new \Formello\Rakit\Validation\Rules\TypeArray(),
            'same' => new \Formello\Rakit\Validation\Rules\Same(),
            'regex' => new \Formello\Rakit\Validation\Rules\Regex(),
            'date' => new \Formello\Rakit\Validation\Rules\Date(),
            'accepted' => new \Formello\Rakit\Validation\Rules\Accepted(),
            'present' => new \Formello\Rakit\Validation\Rules\Present(),
            'different' => new \Formello\Rakit\Validation\Rules\Different(),
            'uploaded_file' => new \Formello\Rakit\Validation\Rules\UploadedFile(),
            'mimes' => new \Formello\Rakit\Validation\Rules\Mimes(),
            'callback' => new \Formello\Rakit\Validation\Rules\Callback(),
            'before' => new \Formello\Rakit\Validation\Rules\Before(),
            'after' => new \Formello\Rakit\Validation\Rules\After(),
            'lowercase' => new \Formello\Rakit\Validation\Rules\Lowercase(),
            'uppercase' => new \Formello\Rakit\Validation\Rules\Uppercase(),
            'json' => new \Formello\Rakit\Validation\Rules\Json(),
            'digits' => new \Formello\Rakit\Validation\Rules\Digits(),
            'digits_between' => new \Formello\Rakit\Validation\Rules\DigitsBetween(),
            'defaults' => new \Formello\Rakit\Validation\Rules\Defaults(),
            'default' => new \Formello\Rakit\Validation\Rules\Defaults(),
            // alias of defaults
            'nullable' => new \Formello\Rakit\Validation\Rules\Nullable(),
        ];
        foreach ($baseValidator as $key => $validator) {
            $this->setValidator($key, $validator);
        }
    }
    /**
     * Given $ruleName and $rule to add new validator
     *
     * @param string $ruleName
     * @param \Rakit\Validation\Rule $rule
     * @return void
     */
    public function addValidator(string $ruleName, \Formello\Rakit\Validation\Rule $rule)
    {
        if (!$this->allowRuleOverride && \array_key_exists($ruleName, $this->validators)) {
            throw new \Formello\Rakit\Validation\RuleQuashException("You cannot override a built in rule. You have to rename your rule");
        }
        $this->setValidator($ruleName, $rule);
    }
    /**
     * Set rule can allow to be overrided
     *
     * @param boolean $status
     * @return void
     */
    public function allowRuleOverride(bool $status = \false)
    {
        $this->allowRuleOverride = $status;
    }
    /**
     * Set this can use humanize keys
     *
     * @param boolean $useHumanizedKeys
     * @return void
     */
    public function setUseHumanizedKeys(bool $useHumanizedKeys = \true)
    {
        $this->useHumanizedKeys = $useHumanizedKeys;
    }
    /**
     * Get $this->useHumanizedKeys value
     *
     * @return void
     */
    public function isUsingHumanizedKey() : bool
    {
        return $this->useHumanizedKeys;
    }
}
