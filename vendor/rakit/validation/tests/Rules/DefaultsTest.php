<?php

namespace Formello\Rakit\Validation\Tests;

use Formello\Rakit\Validation\Rules\Defaults;
use Formello\PHPUnit\Framework\TestCase;
class DefaultsTest extends \Formello\PHPUnit\Framework\TestCase
{
    public function setUp()
    {
        $this->rule = new \Formello\Rakit\Validation\Rules\Defaults();
    }
    public function testDefaults()
    {
        $this->assertTrue($this->rule->fillParameters([10])->check(0));
        $this->assertTrue($this->rule->fillParameters(['something'])->check(null));
        $this->assertTrue($this->rule->fillParameters([[1, 2, 3]])->check(\false));
        $this->assertTrue($this->rule->fillParameters([[1, 2, 3]])->check([]));
    }
}
