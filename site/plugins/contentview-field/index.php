<?php

use Kirby\Cms\App as Kirby;

@include_once __DIR__.'/vendor/autoload.php';

Kirby::plugin('2inchesofwater/contentview-field', [
    'fields' => [
        'contentview' => [
            'props' => [
                'reference' => function ($reference = null) {
                    return $reference;
                }
            ],
            'computed' => [
                'value' => function () {
                    if (!$this->reference) {
                        return null;
                    }
                    return $this->model()->content()->get($this->reference)->value();
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