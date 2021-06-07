=== Contact form builder for Gutenberg - Formello ===
Contributors:      Formello
Donate link: 	   https://formello.net
Tags:              contact form, form builder, form block, gutenberg form, forms
Requires at least: 5.4.0
Tested up to:      5.7.0
Stable tag:        1.1.5
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
* Form Library

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
* Number
* Range
* Color

For each of this input field you can set all html attribute (required, pattern, max, min step etc...). You can also add a description underneath the field and a tooltip.

== Screenshots ==

1. Form preview
2. Button options
3. All blocks
4. Form option
5. Form with label on side
6. Validation

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

= 1.1.5 =
* Fixes remote template

= 1.1.4 =
* Better handling of form settings async( a lot of code reduction)
* Improvement on how to embed form on page ( until this is solved: https://github.com/WordPress/gutenberg/issues/29693)
* Improvement on form actions, now have custom button
* Small fixes

= 1.1.3 =
* Small fixes

= 1.1.2 =
* Fix library using wrong id
* Fix library output form that has fixed position addon
* Improve the submission table sql
* Fix autocomplete on honeypot

= 1.1.1 =
* Added italian translations
* Fixed button padding, border and color
* Fixed menu

= 1.1.0 =
* Better handling of CPT

= 1.0.9 =
* Better support to reusable blocks
* Added adminbar menu
* Added url suggestion
* Fixed label position
* Fix library

= 1.0.8 =
* Added notification for new submission on admin bar
* FIx CSS discrepancy

= 1.0.4 =
* Some cleanup and tweak for speed optimization

= 1.0.3 =
* Added status notification on submission table

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
