<?php
// This file is generated. Do not modify it manually.
return array(
	'kalendarz-static' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'kalendarz-static/kalendarz-static',
		'version' => '0.1.0',
		'title' => 'Kalendarz statyczny',
		'category' => 'widgets',
		'icon' => 'calendar-alt',
		'description' => 'Blok generujący kalendarz na wybrany miesiąc z wydarzeniami.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'year' => array(
				'type' => 'number',
				'default' => 2026
			),
			'month' => array(
				'type' => 'number',
				'default' => 1
			),
			'events' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object'
				)
			)
		),
		'textdomain' => 'kalendarz-static',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	)
);
