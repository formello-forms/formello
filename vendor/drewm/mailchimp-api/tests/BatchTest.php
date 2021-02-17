<?php

namespace Formello\DrewM\MailChimp\Tests;

use Formello\DrewM\MailChimp\MailChimp;
use Formello\PHPUnit\Framework\TestCase;
class BatchTest extends \Formello\PHPUnit\Framework\TestCase
{
    /**
     * @throws \Exception
     */
    public function testNewBatch()
    {
        $MC_API_KEY = \getenv('MC_API_KEY');
        $MailChimp = new \Formello\DrewM\MailChimp\MailChimp($MC_API_KEY);
        $Batch = $MailChimp->new_batch('1');
        $this->assertInstanceOf('Formello\\DrewM\\MailChimp\\Batch', $Batch);
        $this->assertSame(array(), $Batch->get_operations());
    }
}
