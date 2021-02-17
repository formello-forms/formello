<?php

namespace Formello\Rakit\Validation\Tests;

use Formello\Rakit\Validation\Rules\Date;
use Formello\PHPUnit\Framework\TestCase;
class DateTest extends \Formello\PHPUnit\Framework\TestCase
{
    public function setUp()
    {
        $this->rule = new \Formello\Rakit\Validation\Rules\Date();
    }
    public function testValids()
    {
        $this->assertTrue($this->rule->check("2010-10-10"));
        $this->assertTrue($this->rule->fillParameters(['d-m-Y'])->check("10-10-2010"));
    }
    public function testInvalids()
    {
        $this->assertFalse($this->rule->check("10-10-2010"));
        $this->assertFalse($this->rule->fillParameters(['Y-m-d'])->check("2010-10-10 10:10"));
    }
}
