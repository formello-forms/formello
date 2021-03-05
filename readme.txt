=== Formello ===
Contributors:      Formello
Tags:              contact form, form builder, form block, gutenberg form
Requires at least: 5.4.0
Tested up to:      5.7.0
Stable tag:        1.0.2
Requires PHP:      5.6
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

The Gutenberg WordPress Form Builder. Build forms directly within Gutenberg editor. Add & arrange form fields like blocks.

== Description ==

Formello is a Gutenberg form builder that helps you build beautiful html forms that seamless integrate in almost every theme with minimal effort.

You can create forms directly inside Gutenberg editor, save submitted data and also get notification of submitted form.

== Features ==

* Form validation
* ReCaptcha protection (v2 and v3 invisible)
* Store submissions
* Email notification
* Form customization: you can arrange field and display stacked field or in a row with label on side. You can change button colors and also choose loading icon and icon position.

== Supported form input ==

* Text
* Email
* Tel
* Url
* Hidden
* Checkbox
* Radio
* Date
* Time
* Textarea
* Range
* Color

== Installation ==

There's two ways to install Formello.

1. Go to "Plugins > Add New" in your Dashboard and search for: Formello. Then activate the plugin through the 'Plugins' screen in WordPress
2. Download the .zip from WordPress.org, and upload the folder to the `/wp-content/plugins/` directory via FTP.

In most cases, #1 will work fine and is way easier.

== Frequently Asked Questions ==

= Does this require jQuery? =

No. jQuery is not needed to perform ajax form submitting, therefore we don't include on frontend and your site will be light and fast.

= Can I store submissions? =

Yes. Your submissions will be stored in database, so you can keep track of them.

= Is there spam protection? =

Yes. We have a basic honeypot checker to prevent spam bot sending their stuffs. Also we have support for Google ReCaptcha (v2,v3) to stop spam bot sending form and to help you take things clean. Apart from this, data submitted are always validated and sanitized.

== Changelog ==

= 1.0.2 =
* [Improvements] Added placeholder and starter template to form
* [Improvements] Added label options
* [Improvements] Added color options styling to button
* [Improvements] Added support for date/time in old browsers
* Small bug fixes

= 1.0.1 =
* Small bug fixes

= 1.0.0 =
* Release
