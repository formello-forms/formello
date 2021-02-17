<?php

namespace Formello\Rakit\Validation\Tests;

use Formello\Rakit\Validation\Validation;
use Formello\Rakit\Validation\Validator;
use Formello\PHPUnit\Framework\TestCase;
use ReflectionClass;
class ValidationTest extends \Formello\PHPUnit\Framework\TestCase
{
    /**
     * @param string $rules
     * @param array $expectedResult
     *
     * @dataProvider parseRuleProvider
     */
    public function testParseRule($rules, $expectedResult)
    {
        $class = new \ReflectionClass(\Formello\Rakit\Validation\Validation::class);
        $method = $class->getMethod('parseRule');
        $method->setAccessible(\true);
        $validation = new \Formello\Rakit\Validation\Validation(new \Formello\Rakit\Validation\Validator(), [], []);
        $result = $method->invokeArgs($validation, [$rules]);
        $this->assertSame($expectedResult, $result);
    }
    /**
     * @return array
     */
    public function parseRuleProvider()
    {
        return [['email', ['email', []]], ['min:6', ['min', ['6']]], ['uploaded_file:0,500K,png,jpeg', ['uploaded_file', ['0', '500K', 'png', 'jpeg']]], ['same:password', ['same', ['password']]], ['regex:/^([a-zA-Z\\,]*)$/', ['regex', ['/^([a-zA-Z\\,]*)$/']]]];
    }
}
