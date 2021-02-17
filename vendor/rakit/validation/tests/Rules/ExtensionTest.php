<?php

namespace Formello\Rakit\Validation\Tests;

use Formello\Rakit\Validation\Rules\Extension;
use Formello\PHPUnit\Framework\TestCase;
class ExtensionTest extends \Formello\PHPUnit\Framework\TestCase
{
    public function setUp()
    {
        $this->rule = new \Formello\Rakit\Validation\Rules\Extension();
    }
    public function testValids()
    {
        $this->assertTrue($this->rule->fillParameters(['pdf', 'png', 'txt'])->check('somefile.txt'));
        $this->assertTrue($this->rule->fillParameters(['.pdf', '.png', '.txt'])->check('somefile.txt'));
        $this->assertTrue($this->rule->fillParameters(['pdf', 'png', 'txt'])->check('path/to/somefile.txt'));
        $this->assertTrue($this->rule->fillParameters(['pdf', 'png', 'txt'])->check('./absolute/path/to/somefile.txt'));
        $this->assertTrue($this->rule->fillParameters(['pdf', 'png', 'txt'])->check('https://site.test/somefile.txt'));
    }
    public function testInvalids()
    {
        $this->assertFalse($this->rule->fillParameters(['pdf', 'png', 'txt'])->check(''));
        $this->assertFalse($this->rule->fillParameters(['pdf', 'png', 'txt'])->check('.dotfile'));
        $this->assertFalse($this->rule->fillParameters(['pdf', 'png', 'txt'])->check('notafile'));
        $this->assertFalse($this->rule->fillParameters(['pdf', 'png', 'txt'])->check('somefile.php'));
        $this->assertFalse($this->rule->fillParameters(['.pdf', '.png', '.txt'])->check('somefile.php'));
    }
}
