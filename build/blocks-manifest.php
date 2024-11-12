<?php
// This file is generated. Do not modify it manually.
return array(
	'button' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'formello/button',
		'title' => 'Button',
		'description' => 'A block to display form button.',
		'category' => 'formello',
		'icon' => 'button',
		'ancestor' => array(
			'formello/form'
		),
		'textdomain' => 'formello',
		'usesContext' => array(
			'formello/settings'
		),
		'attributes' => array(
			'text' => array(
				'type' => 'string',
				'source' => 'text',
				'selector' => 'span',
				'default' => 'Submit'
			),
			'alignment' => array(
				'type' => 'string',
				'default' => 'left'
			),
			'noWrapper' => array(
				'type' => 'boolean'
			),
			'type' => array(
				'type' => 'string',
				'default' => 'Loading'
			),
			'style' => array(
				'type' => 'object',
				'default' => array(
					'color' => array(
						'background' => '#000000',
						'text' => '#ffffff'
					),
					'padding' => array(
						'top' => '10'
					)
				)
			)
		),
		'selectors' => array(
			'root' => '.wp-block-formello-button',
			'color' => array(
				'background' => '.wp-block-formello-button > button',
				'text' => '.wp-block-formello-button > button'
			),
			'typography' => array(
				'root' => '.wp-block-formello-button > button',
				'text-decoration' => '.wp-block-formello-button > button'
			)
		),
		'supports' => array(
			'html' => false,
			'lock' => false,
			'multiple' => false,
			'reusable' => false,
			'inserter' => true,
			'color' => array(
				'background' => true,
				'text' => true,
				'gradients' => true,
				'__experimentalSkipSerialization' => true
			),
			'spacing' => array(
				'padding' => true,
				'margin' => true
			),
			'__experimentalBorder' => array(
				'radius' => true,
				'width' => true,
				'color' => true,
				'style' => true
			),
			'typography' => array(
				'fontSize' => true
			)
		),
		'example' => array(
			'attributes' => array(
				'text' => 'Submit'
			)
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'fieldset' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'formello/fieldset',
		'title' => 'Fieldset',
		'ancestor' => array(
			'formello/form'
		),
		'description' => 'A block to display form fieldset.',
		'category' => 'formello',
		'textdomain' => 'formello',
		'attributes' => array(
			'showLegend' => array(
				'type' => 'boolean',
				'default' => true
			),
			'legend' => array(
				'type' => 'string',
				'source' => 'text',
				'selector' => 'legend',
				'default' => 'Legend'
			)
		),
		'supports' => array(
			'anchor' => true,
			'html' => false,
			'color' => array(
				'text' => true
			),
			'spacing' => array(
				'padding' => true
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			),
			'__experimentalLayout' => array(
				'allowSwitching' => false,
				'allowInheriting' => false,
				'allowSizingOnChildren' => true,
				'default' => array(
					'type' => 'flex',
					'justifyContent' => 'stretch',
					'orientation' => 'vertical',
					'flexWrap' => 'nowrap'
				)
			)
		),
		'example' => array(
			'attributes' => array(
				'legend' => 'Preferences'
			),
			'innerBlocks' => array(
				array(
					'name' => 'formello/input',
					'attributes' => array(
						'label' => 'Job'
					)
				),
				array(
					'name' => 'formello/textarea',
					'attributes' => array(
						'label' => 'Description'
					)
				)
			)
		),
		'editorScript' => 'file:./index.js'
	),
	'form' => array(
		'$schema' => 'https://json.schemastore.org/block.json',
		'apiVersion' => 3,
		'name' => 'formello/form',
		'title' => 'Form',
		'description' => 'A block collection to build forms.',
		'category' => 'formello',
		'textdomain' => 'formello',
		'keywords' => array(
			'form',
			'forms',
			'formello'
		),
		'allowedBlocks' => array(
			'core/paragraph',
			'core/heading',
			'core/columns',
			'core/group',
			'core/separator',
			'formello/input',
			'formello/textarea',
			'formello/button',
			'formello/output',
			'formello/fieldset',
			'formello/select',
			'formello/multichoices'
		),
		'providesContext' => array(
			'formello/requiredText' => 'requiredText'
		),
		'attributes' => array(
			'action' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'form',
				'attribute' => 'action'
			),
			'requiredText' => array(
				'type' => 'string',
				'default' => '*'
			),
			'autoComplete' => array(
				'enum' => array(
					'on',
					'off'
				),
				'source' => 'attribute',
				'selector' => 'form',
				'attribute' => 'autocomplete'
			),
			'noValidate' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'form',
				'attribute' => 'novalidate',
				'default' => true
			)
		),
		'styles' => array(
			array(
				'name' => 'regular',
				'label' => 'Default',
				'isDefault' => true
			),
			array(
				'name' => 'modern',
				'label' => 'Modern'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'input' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'formello/input',
		'title' => 'Text Input',
		'ancestor' => array(
			'formello/form'
		),
		'usesContext' => array(
			'formello/requiredText'
		),
		'category' => 'formello',
		'textdomain' => 'formello',
		'attributes' => array(
			'type' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'type',
				'default' => 'text'
			),
			'id' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'id'
			),
			'name' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'name'
			),
			'label' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => 'label span:not(.required)',
				'default' => 'Label',
				'role' => 'content'
			),
			'hideLabel' => array(
				'type' => 'boolean',
				'selector' => 'label.hide',
				'default' => false
			),
			'placeholder' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'placeholder',
				'role' => 'content'
			),
			'value' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'value'
			),
			'validation' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'data-bouncer-message',
				'default' => ''
			),
			'enableMismatch' => array(
				'type' => 'boolean',
				'default' => false
			),
			'mismatchMessage' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'data-bouncer-mismatch-message',
				'default' => ''
			),
			'match' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'data-bouncer-match'
			),
			'required' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'required',
				'default' => false
			),
			'requiredText' => array(
				'type' => 'string',
				'source' => 'text',
				'selector' => 'label span.required',
				'default' => '*'
			),
			'enableAutoComplete' => array(
				'type' => 'boolean',
				'default' => false
			),
			'autocomplete' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'autocomplete',
				'default' => 'off'
			),
			'disabled' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'disabled',
				'default' => false
			),
			'readonly' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'readonly',
				'default' => false
			),
			'checked' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'checked',
				'default' => false
			),
			'multiple' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'multiple',
				'default' => false
			),
			'showHelp' => array(
				'type' => 'boolean',
				'default' => false
			),
			'help' => array(
				'type' => 'string',
				'default' => ''
			),
			'minlength' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'minlength'
			),
			'maxlength' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'maxlength'
			),
			'pattern' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'pattern'
			),
			'min' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'min'
			),
			'max' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'max'
			),
			'noWrapper' => array(
				'type' => 'boolean',
				'default' => false
			),
			'step' => array(
				'type' => 'number',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'step'
			),
			'dateFormat' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'data-date-format'
			),
			'minDate' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'data-min-date'
			),
			'timeFormat' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'input',
				'attribute' => 'data-time-format'
			),
			'enableTime' => array(
				'type' => 'boolean'
			),
			'inlineCalendar' => array(
				'type' => 'boolean'
			),
			'mode' => array(
				'type' => 'string',
				'source' => 'attribute',
				'attribute' => 'data-mode'
			),
			'advanced' => array(
				'type' => 'boolean'
			)
		),
		'supports' => array(
			'lock' => false,
			'anchor' => false,
			'html' => false,
			'inserter' => true,
			'className' => true,
			'reusable' => false,
			'color' => array(
				'background' => true,
				'text' => true,
				'__experimentalSkipSerialization' => true,
				'__experimentalSelector' => 'input'
			),
			'spacing' => array(
				'padding' => true,
				'__experimentalSkipSerialization' => true
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalSkipSerialization' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			)
		),
		'selectors' => array(
			'root' => '.wp-block-formello-input',
			'color' => array(
				'background' => '.wp-block-formello-input > input',
				'text' => '.wp-block-formello-input'
			),
			'spacing' => array(
				'root' => '.wp-block-formello-input',
				'padding' => '.wp-block-formello-input > input'
			),
			'border' => array(
				'root' => '.wp-block-formello-input > input'
			)
		),
		'example' => array(
			'attributes' => array(
				'label' => 'Name'
			)
		),
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'library' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'formello/library',
		'title' => 'Form Library',
		'description' => 'A block to display or create forms.',
		'category' => 'formello',
		'textdomain' => 'formello',
		'attributes' => array(
			'ref' => array(
				'type' => 'number'
			)
		),
		'supports' => array(
			'html' => false,
			'lock' => false,
			'reusable' => false,
			'inserter' => true,
			'interactivity' => true
		),
		'editorScript' => 'file:./index.js',
		'viewScriptModule' => 'file:./view.js'
	),
	'multichoices' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'formello/multichoices',
		'title' => 'Multi choices',
		'ancestor' => array(
			'formello/form'
		),
		'category' => 'formello',
		'textdomain' => 'formello',
		'attributes' => array(
			'name' => array(
				'type' => 'string',
				'default' => 'my_choice',
				'role' => 'content'
			),
			'type' => array(
				'enum' => array(
					'radio',
					'checkbox'
				),
				'default' => 'checkbox'
			),
			'required' => array(
				'type' => 'boolean'
			),
			'options' => array(
				'type' => 'array',
				'source' => 'query',
				'selector' => 'div.wp-block-formello-input',
				'query' => array(
					'value' => array(
						'type' => 'string',
						'selector' => 'input',
						'source' => 'attribute',
						'attribute' => 'value'
					),
					'label' => array(
						'type' => 'string',
						'selector' => 'label',
						'source' => 'html'
					),
					'selected' => array(
						'type' => 'boolean',
						'selector' => 'input',
						'source' => 'attribute',
						'attribute' => 'checked'
					)
				),
				'default' => array(
					array(
						'value' => '1',
						'label' => 'One'
					),
					array(
						'value' => '2',
						'label' => 'Two'
					),
					array(
						'value' => '3',
						'label' => 'Three'
					)
				)
			)
		),
		'supports' => array(
			'anchor' => true,
			'html' => false,
			'spacing' => array(
				'padding' => true,
				'blockGap' => true
			),
			'inserter' => true,
			'__experimentalBorder' => true,
			'layout' => array(
				'allowSwitching' => true,
				'allowInheriting' => false,
				'allowSizingOnChildren' => false,
				'allowEditing' => true,
				'allowCustomContentAndWideSize' => false,
				'allowJustification' => false,
				'default' => array(
					'type' => 'flex',
					'justifyContent' => 'stretch',
					'orientation' => 'vertical',
					'flexWrap' => 'nowrap'
				)
			)
		),
		'example' => array(
			'attributes' => array(
				'options' => array(
					array(
						'label' => 'Windows'
					),
					array(
						'label' => 'MacOS'
					),
					array(
						'label' => 'Linux'
					)
				)
			)
		),
		'editorScript' => 'file:./index.js'
	),
	'output' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'formello/output',
		'title' => 'Output',
		'description' => 'A block to display number output.',
		'category' => 'formello',
		'ancestor' => array(
			'formello/form'
		),
		'icon' => 'number',
		'textdomain' => 'formello',
		'attributes' => array(
			'text' => array(
				'type' => 'string',
				'source' => 'text',
				'selector' => 'span',
				'default' => ''
			)
		),
		'supports' => array(
			'html' => false,
			'lock' => false,
			'reusable' => false,
			'inserter' => true,
			'color' => array(
				'background' => true,
				'text' => true
			),
			'spacing' => array(
				'padding' => array(
					'left',
					'right'
				),
				'margin' => array(
					'left',
					'right'
				)
			),
			'__experimentalBorder' => array(
				'radius' => true,
				'width' => true,
				'color' => true,
				'style' => true
			),
			'typography' => array(
				'fontSize' => true
			)
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css'
	),
	'select' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'formello/select',
		'title' => 'Select',
		'ancestor' => array(
			'formello/form'
		),
		'usesContext' => array(
			'formello/requiredText'
		),
		'description' => 'Dropdown select.',
		'category' => 'formello',
		'textdomain' => 'formello',
		'attributes' => array(
			'id' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'select',
				'attribute' => 'id'
			),
			'name' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'select',
				'attribute' => 'name'
			),
			'label' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => 'label span:not(.required)',
				'default' => 'My input'
			),
			'hideLabel' => array(
				'type' => 'boolean',
				'selector' => 'label.hide',
				'default' => false
			),
			'options' => array(
				'type' => 'array',
				'source' => 'query',
				'selector' => 'option',
				'query' => array(
					'value' => array(
						'type' => 'string',
						'source' => 'attribute',
						'attribute' => 'value'
					),
					'label' => array(
						'type' => 'string',
						'source' => 'text'
					),
					'selected' => array(
						'type' => 'boolean',
						'source' => 'attribute',
						'attribute' => 'selected'
					)
				),
				'default' => array(
					array(
						'value' => '',
						'label' => 'Select an option'
					),
					array(
						'value' => '1',
						'label' => 'One'
					),
					array(
						'value' => '2',
						'label' => 'Two'
					),
					array(
						'value' => '3',
						'label' => 'Three'
					)
				)
			),
			'multiple' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'select',
				'attribute' => 'multiple'
			),
			'required' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'select',
				'attribute' => 'required'
			),
			'requiredText' => array(
				'type' => 'string',
				'source' => 'text',
				'selector' => 'label span.required',
				'default' => '*'
			),
			'disabled' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'select',
				'attribute' => 'disabled'
			),
			'readonly' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'select',
				'attribute' => 'readonly'
			),
			'showHelp' => array(
				'type' => 'boolean',
				'default' => false
			),
			'help' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => 'small',
				'default' => ''
			),
			'advanced' => array(
				'type' => 'boolean'
			)
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'color' => array(
				'background' => true,
				'text' => true,
				'__experimentalSkipSerialization' => true
			),
			'spacing' => array(
				'padding' => true,
				'__experimentalSkipSerialization' => true
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalSkipSerialization' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			)
		),
		'selectors' => array(
			'root' => '.wp-block-formello-select',
			'color' => array(
				'background' => '.wp-block-formello-select > select',
				'text' => '.wp-block-formello-select'
			),
			'spacing' => array(
				'root' => '.wp-block-formello-select',
				'padding' => '.wp-block-formello-select > select'
			),
			'border' => array(
				'root' => '.wp-block-formello-select > select'
			)
		),
		'example' => array(
			'attributes' => array(
				'label' => 'Your OS',
				'options' => array(
					array(
						'label' => 'Windows'
					),
					array(
						'label' => 'MacOS'
					),
					array(
						'label' => 'Linux'
					)
				)
			)
		),
		'style' => 'file:./style-index.css',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'textarea' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'formello/textarea',
		'title' => 'Textarea',
		'ancestor' => array(
			'formello/form'
		),
		'usesContext' => array(
			'formello/requiredText'
		),
		'description' => 'Textarea field.',
		'category' => 'formello',
		'textdomain' => 'formello',
		'attributes' => array(
			'id' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'id'
			),
			'name' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'name'
			),
			'label' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => 'label span:not(.required)',
				'default' => 'My textarea'
			),
			'hideLabel' => array(
				'type' => 'boolean',
				'selector' => 'label.hide',
				'default' => false
			),
			'placeholder' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'placeholder',
				'default' => ''
			),
			'value' => array(
				'type' => 'string',
				'source' => 'text',
				'selector' => 'textarea',
				'default' => ''
			),
			'validation' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'data-bouncer-message',
				'default' => ''
			),
			'enableMismatch' => array(
				'type' => 'boolean',
				'default' => false
			),
			'mismatchMessage' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'data-bouncer-mismatch-message',
				'default' => ''
			),
			'match' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'data-bouncer-match',
				'default' => ''
			),
			'required' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'required',
				'default' => false
			),
			'autocomplete' => array(
				'enum' => array(
					'on',
					'off'
				),
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'autocomplete',
				'default' => 'off'
			),
			'requiredText' => array(
				'type' => 'string',
				'source' => 'text',
				'selector' => 'label span.required',
				'default' => '*'
			),
			'disabled' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'disabled',
				'default' => false
			),
			'readonly' => array(
				'type' => 'boolean',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'readonly',
				'default' => false
			),
			'showHelp' => array(
				'type' => 'boolean',
				'default' => false
			),
			'help' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => 'small',
				'default' => ''
			),
			'cols' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'cols'
			),
			'rows' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'rows'
			),
			'minlength' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'minlength'
			),
			'maxlength' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'maxlength'
			),
			'pattern' => array(
				'type' => 'string',
				'source' => 'attribute',
				'selector' => 'textarea',
				'attribute' => 'pattern'
			),
			'advanced' => array(
				'type' => 'boolean',
				'selector' => 'textarea.formello-rft'
			)
		),
		'supports' => array(
			'html' => false,
			'inserter' => true,
			'reusable' => false,
			'color' => array(
				'background' => true,
				'text' => true,
				'__experimentalSkipSerialization' => true
			),
			'spacing' => array(
				'padding' => true,
				'__experimentalSkipSerialization' => true
			),
			'__experimentalBorder' => array(
				'color' => true,
				'radius' => true,
				'style' => true,
				'width' => true,
				'__experimentalSkipSerialization' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true,
					'style' => true,
					'width' => true
				)
			)
		),
		'selectors' => array(
			'root' => '.wp-block-formello-textarea',
			'color' => array(
				'background' => '.wp-block-formello-textarea > textarea',
				'text' => '.wp-block-formello-textarea'
			),
			'spacing' => array(
				'root' => '.wp-block-formello-textarea',
				'padding' => '.wp-block-formello-textarea > textarea'
			),
			'border' => array(
				'root' => '.wp-block-formello-textarea > textarea'
			)
		),
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	)
);
