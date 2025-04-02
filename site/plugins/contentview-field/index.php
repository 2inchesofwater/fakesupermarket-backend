<?php

file_put_contents(__DIR__ . '/debug.log', 'Plugin loaded at ' . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

/**
 * Contentview Field for Kirby CMS
 * 
 * @version 0.0.1
 * @author Dan Gilmore, 2 Inches of Water
 * @license MIT
 */

// Register the plugin with Kirby
Kirby::plugin('2inchesofwater/contentview-field', [
    'fields' => [
        'contentview' => [
            // Field properties and methods
            'props' => [
                /**
                 * Content to display in the field
                 */
                'value' => function ($value = '') {
                    return $value;
                },
                
                /**
                 * Whether to preserve HTML/Kirbytext formatting
                 */
                'formatted' => function (bool $formatted = true) {
                    return $formatted;
                },
                
                /**
                 * Additional CSS classes for the field
                 */
                'class' => function (string $class = null) {
                    return $class;
                }
            ]
        ]
    ],
    
    // Add the required JS files for the Panel
    'api' => [
        'routes' => [
            [
                'pattern' => 'fields/contentview/render',
                'method' => 'POST',
                'action' => function () {
                    $request = kirby()->request();
                    $content = $request->get('content');
                    $formatted = $request->get('formatted', true);
                    
                    if ($formatted) {
                        return kirbytext($content);
                    }
                    
                    return strip_tags($content);
                }
            ]
        ]
    ]
]);