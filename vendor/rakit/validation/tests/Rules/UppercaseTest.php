<?php

namespace Formello\Rakit\Validation\Tests;

use Formello\Rakit\Validation\Rules\Uppercase;
use Formello\PHPUnit\Framework\TestCase;
class UppercaseTest extends \Formello\PHPUnit\Framework\TestCase
{
    public function setUp()
    {
        $this->rule = new \Formello\Rakit\Validation\Rules\Uppercase();
    }
    public function testValids()
    {
        $this->assertTrue($this->rule->check('USERNAME'));
        $this->assertTrue($this->rule->check('FULL NAME'));
        $this->assertTrue($this->rule->check('FULL_NAME'));
    }
    public function testInvalids()
    {
        $this->assertFalse($this->rule->check('username'));
        $this->assertFalse($this->rule->check('Username'));
        $this->assertFalse($this->rule->check('userName'));
    }
}
