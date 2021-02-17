<?php

namespace Formello\DrewM\MailChimp\Tests;

use Formello\DrewM\MailChimp\MailChimp;
use Formello\PHPUnit\Framework\TestCase;
class MailChimpTest extends \Formello\PHPUnit\Framework\TestCase
{
    /**
     * @throws \Exception
     */
    public function testInvalidAPIKey()
    {
        $this->expectException('\\Exception');
        new \Formello\DrewM\MailChimp\MailChimp('abc');
    }
    /**
     * @throws \Exception
     */
    public function testInstantiation()
    {
        $MC_API_KEY = \getenv('MC_API_KEY');
        $MailChimp = new \Formello\DrewM\MailChimp\MailChimp($MC_API_KEY, 'https://api.mailchimp.com/3.0');
        $this->assertInstanceOf('Formello\\DrewM\\MailChimp\\MailChimp', $MailChimp);
        $this->assertSame('https://api.mailchimp.com/3.0', $MailChimp->getApiEndpoint());
        $this->assertFalse($MailChimp->success());
        $this->assertFalse($MailChimp->getLastError());
        $this->assertSame(array('headers' => null, 'body' => null), $MailChimp->getLastResponse());
        $this->assertSame(array(), $MailChimp->getLastRequest());
    }
    /**
     * @throws \Exception
     */
    public function testSubscriberHash()
    {
        $email = 'Foo@Example.Com';
        $expected = \md5(\strtolower($email));
        $result = \Formello\DrewM\MailChimp\MailChimp::subscriberHash($email);
        $this->assertEquals($expected, $result);
    }
    public function testResponseState()
    {
        $MC_API_KEY = \getenv('MC_API_KEY');
        $MailChimp = new \Formello\DrewM\MailChimp\MailChimp($MC_API_KEY);
        $MailChimp->get('lists');
        // Since we're using a fake key, it doesn't work
        $this->assertFalse($MailChimp->success());
        // But now we have an error message
        $this->assertSame('Unknown error, call getLastResponse() to find out what happened.', $MailChimp->getLastError());
    }
}
