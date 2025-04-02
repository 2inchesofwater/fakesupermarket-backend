<?php

use Kirby\Cms\App as Kirby;

@include_once __DIR__.'/vendor/autoload.php';

Kirby::plugin('2inchesofwater/contentview-field', [
    'fields' => [
        'contentview' => [
            'props' => [
                'text' => function ($value = null) {
                    return $value ? $value : 'No content provided';
                }
            ]
        ]
    ],
    'hooks' => [],
    'areas' => [
        'panel' => function ($kirby) {
            return [
                'js' => [
                    'contentview' => 'media/plugins/contentview-field/index.js'
                ]
            ];
        }
    ]
]);


?>