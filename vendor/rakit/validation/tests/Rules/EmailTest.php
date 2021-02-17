<?php

namespace Formello\Rakit\Validation\Tests;

use Formello\Rakit\Validation\Rules\Email;
use Formello\PHPUnit\Framework\TestCase;
class EmailTest extends \Formello\PHPUnit\Framework\TestCase
{
    public function setUp()
    {
        $this->rule = new \Formello\Rakit\Validation\Rules\Email();
    }
    public function testValids()
    {
        $this->assertTrue($this->rule->check('johndoe@gmail.com'));
        $this->assertTrue($this->rule->check('johndoe@foo.bar'));
        $this->assertTrue($this->rule->check('foo123123@foo.bar.baz'));
    }
    public function testInvalids()
    {
        $this->assertFalse($this->rule->check(1));
        $this->assertFalse($this->rule->check('john doe@gmail.com'));
        $this->assertFalse($this->rule->check('johndoe'));
        $this->assertFalse($this->rule->check('johndoe.gmail.com'));
        $this->assertFalse($this->rule->check('johndoe.gmail.com'));
    }
}
