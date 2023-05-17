=== Contact form builder for Gutenberg - Formello ===
Contributors:      Formello, tropicalista
Donate link: 	   https://formello.net
Tags:              contact form, form builder, form block, gutenberg form, forms, gutenberg block, contact form plugin, forms, form builder, custom form, contact button, contact me, custom contact form, form manager, form, forms builder, forms creator, captcha, recaptcha, email form, web form, feedback form, email submit form, message form, contact form block, wordpress form plugin
Requires at least: 6.2
Tested up to:      6.2
Stable tag:        2.1.0
Requires PHP:      5.6
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

The Gutenberg WordPress Form Builder. Build forms directly within Gutenberg editor. Add & arrange form fields like blocks.

== Description ==

Formello is a **Gutenberg forms builder** that helps you build beautiful html forms that seamless integrate in almost every theme with minimal effort.

This is the next generation **WordPress form builder plugin**. You can create forms directly inside Gutenberg editor, save submitted data and also get notification of submitted form.

== Features ==

* Form validation ( both frontend and backend )
* ReCaptcha protection (v2 and v3 invisible)
* Store submissions: views all submitted form
* Email notification: receive a notification on form submissions
* Hide form or redirect to URL after a successful submission.
* Form customization: you can arrange field and display stacked field or in a row with label on side. You can change button colors and also choose loading icon and icon position.
* Form Library: choose from different ready made forms

== Extensions ==

If you wanna extend the form functionality with more useful features, you can download, from our [site](https://formello.net), an advanced version which includes this addons:

* [Mailchimp](https://formello.net/addons/mailchimp): action to send subscriber emails to your Mailchimp lists.
* [MailPoet](https://formello.net/addons/mailpoet): action to send subscriber emails to your MailPoet lists.
* [MailerLite](https://formello.net/addons/mailerlite): action to send subscriber emails to your MailerLite lists.
* [Sendinblue](https://formello.net/addons/sendinblue): action to send subscriber emails to your SendinBlue lists.
* [GetResponse](https://formello.net/addons/mailchimp): action to send subscriber emails to your GetResponse lists.
* [Inserter](https://formello.net/addons/inserter): automatically insert form on posts/page.
* [Exporter](https://formello.net/addons/exporter): export all your submission in an Excel ready format or CSV.
* [Web Hooks](https://formello.net/addons/web-hooks): send your mail submissions to any external endpoint.
* [Conditional fields](https://formello.net/addons/conditional-fields): add rules to display fields based on your defined conditions.
* 🔥 [Popper](https://wordpress.org/plugins/popper): a popup builder to increase leads with exit intent.

== Supported form input ==

* Text
* Email
* Tel
* Url
* Hidden
* Checkbox
* Radio
* Date
* Advanced date ( multiple, range )
* Time
* Textarea
* Richtext editor
* Number
* Range
* Color

For each of this input field you can set all html attribute (required, pattern, max, min step etc...). You can also add a description underneath the field.

== Screenshots ==

1. Form preview
2. Button options
3. All blocks
4. Form option
5. Form with label on side
6. Validation

== WHAT’S NEXT ==

If you like this plugin, then consider checking out our other projects:

* [Popper](https://wordpress.org/plugins/popper): a popup builder to increase leads with exit intent.
* [Mortgage Calculator](https://wordpress.org/plugins/mortgage): a mortgage calculator block for Gutenberg.
* [Search Console](https://wordpress.org/plugins/search-console): view all your search console data inside WordPress admin.
* [Pdf Embed](https://wordpress.org/plugins/pdf-embed): embed your PDFs using the official Adobe Embed API.

## Privacy Policy 
Contact form builder for Gutenberg &#8211; Formello uses [Appsero](https://appsero.com) SDK to collect some telemetry data upon user's confirmation. This helps us to troubleshoot problems faster & make product improvements.

Appsero SDK **does not gather any data by default.** The SDK only starts gathering basic telemetry data **when a user allows it via the admin notice**. We collect the data to ensure a great user experience for all our users. 

Integrating Appsero SDK **DOES NOT IMMEDIATELY** start gathering data, **without confirmation from users in any case.**

Learn more about how [Appsero collects and uses this data](https://appsero.com/privacy-policy/).

**CONTRIBUTE**

Formello is open source and you can [contribute here](https://github.com/formello-forms/formello).


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

= Can I use forms with Elementor or other page builders? =

Yes, you can insert Formello forms using a shortcode.

== Changelog ==

= 2.1.0 =
* No JS form sending
* Better handling of form request and response
* Added multi choices
* Code reduction
* Better handling of form in post/page
* Fixed addons page

= 2.0.1 =
* Fix hyphen in action tags not parsed
* Fix bulk delete
* Temporary disable rich text in action

= 2.0.0 =
* Fix action not firing
* Fix TinyMce not saving

= 1.9.9 =
* Fix readme

= 1.9.8 =
* Fix fatal error on install

= 1.9.7 =
* Fix composer dump autoload no dev

= 1.9.5 =
* Fix validation
* Better handling of table alert
* Switch submission to react
* Better handling of addons
* Better handling of columns show/hide
* Better handling of submissions views
* Added custom webpack config
* COde linting

= 1.9.4 =
* Adds double check on patterns

= 1.9.3 =
* Fix error on pattern registration

= 1.9.2 =
* Fix missing templates

= 1.9.1 =
* Fix uppercase folders

= 1.9.0 =
* Fix license message
* Added placeholder message on form
* Added global message settings
* Hide shortcode by default
* Fix date column position
* Code reduction
* Implement react addon page
* New textarea block
* Removed store
* Use native gutenberg block for template
* Use pattern instead of custom template
* Change attribute source
* New and better loading icons
* Better handling button align
* Added form import/export
* Don't store password
* New simplified merge tags
* Better column management on submissions table
* Added options to disable js and html5 validation

= 1.8.2 =
* Added select to match field
* Better template modal
* Added tests
* Added frontend defaults
* Added better form validation
* Added backend same as validation
* Added backend messages to pair with settings

= 1.8.1 =
* Missing tag

= 1.8.0 =
* Fix step
* Fix modal library
* Added modal on change library 

= 1.7.9 =
* Fix button 

= 1.7.8 =
* Fixed button colors

= 1.7.7 =
* Fixed advanced date

= 1.7.6 =
* Fixed icons color
* Small fixes

= 1.7.5 =
* Fixed starred count
* Fixed missing time on submisison page

= 1.7.4 =
* Added shortcode
* Fixed redirection

= 1.7.3 =
* Fix ancestor on select

= 1.7.2 =
* Update readme

= 1.7.1 =
* Fix wrong css on some themes

= 1.7.0 =
* Added shotcode render
* Fix missing dependencies
* Removed some icons

= 1.6.9 =
* Code linting
* Added store to settings to better manage
* Fix action email button

= 1.6.8 =
* Fix fieldset

= 1.6.7 =
* Better handling of debug

= 1.6.6 =
* Better button icon
* Added right text
* Added rich editing for mail action

= 1.6.5 =
* Fix error on settings page

= 1.6.4 =
* Sanitize all filters

= 1.6.3 =
* Fix search params

= 1.6.2 =
* Fix sql escaping
* Better handling of submissions form

= 1.6.1 =
* Fix sql escaping

= 1.6.0 =
* Fix sorting
* Better handling of table forms

= 1.5.9 =
* Fix button icons
* Added logging

= 1.5.8 =
* Fix button display

= 1.5.7 =
* Simplify loading icon
* Css reduction

= 1.5.6 =
* Added better debug output
* Fix error in case of empty form

= 1.5.5 =
* Fix block.json load

= 1.5.4 =
* Fix css
* Increase speed
* Optimize code

= 1.5.3 =
* Fiw group wrapper
* FIx honeypot

= 1.5.2 =
* Simplify css

= 1.5.1 =
* Fix bottom padding
* Remove default block link class

= 1.4.8 =
* Fix lock on button

= 1.4.7 =
* Minor fix

= 1.4.6 =
* Minor fix

= 1.4.5 =
* Code reduction
* Better handling of hidden input field
* Added tools page
* Better notification on settings
* Added dynamic value to fields
* Code reorganization
* Speed improvement
* Async task
* Better usability

= 1.4.4 =
* Better handling of button
* Code optimization
* Added CSS for conditional fields

= 1.4.3 =
* Fix margin on forms table
* Fix settings save submission

= 1.4.2 =
* Better settings page
* Fix all data merge tags

= 1.4.1 =
* Fix email action

= 1.4.0 =
* Fix textarea
* Better handling of select options

= 1.3.9 =
* Fix icon on select

= 1.3.8 =
* Better UI for select options

= 1.3.7 =
* Fix small bugs on settings page
* convert button to clickable
* addon images added

= 1.3.6 =
* Fix small bugs on recaptcha

= 1.3.5 =
* Better handling of form submission

= 1.3.4 =
* Fix small bugs

= 1.3.3 =
* Fix bug preventing storing submisison

= 1.3.2 =
* Switched all blocks to api version 2
* Better handling of backend CSS
* COde reduction

= 1.3.1 =
* Added license settings
* Fix settings
* Fix debugging

= 1.3.0 =
* Added Freemius addon
* Fix settings
* Fix debugging

= 1.2.9 =
* Fix input with group label
* Fix new hook block category

= 1.2.8 =
* Minor fix to match new WP 5.8 requirements

= 1.2.7 =
* Show submission by last inserted
* Minor fixes
* Code reduction

= 1.2.6 =
* Better handling of submissions
* Fix pagination on tables
* Fix DB tables

= 1.2.5 =
* Small fixes

= 1.2.4 =
* Fixed submission view
* Added starred column
* Better handling back button
* ID on table hidden by default
* Fix errors in submissions table


= 1.2.3 =
* Better handling of form fields
* Simplify submissions table with code reduction
* Added logic to disable actions if not active
* Fixed spinner on modal
* Added column to tables
* Fixed column show/hide in submissions table
* Removed css on editor

= 1.2.2 =
* Fixes for WP 5.8

= 1.2.1 =
* Fix button for WP 5.8

= 1.2.0 =
* Fix actions filter

= 1.1.9 =
* Better handling of actions
* Code reduction and simplify action generation
* Added debug for admi

= 1.1.8 =
* Code reduction
* Better handling of grouped input

= 1.1.6 =
* Small fixes 

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
