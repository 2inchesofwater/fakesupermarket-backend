<?php

return [
    'debug' => true,
    'api' => [
        'allowOrigin' => ['http://localhost:8080'],
        /*'authentication' => false */
    ],
    'panel' => [
        'css' => 'assets/css/panel.css'
    ],
    
    // Custom permissions
    'permissions' => [
        // Override changeStatus permission for team role specifically for study pages
        'page.changeStatus' => function ($page, $status, $permissions) {
            // Get current user
            $user = kirby()->user();
            
            // If not logged in or not a team role, use default permissions
            if (!$user || $user->role()->name() !== 'team') {
                return $permissions;
            }
            
            // For study pages, team members can only change to 'draft' or 'unlisted' status
            if ($page->intendedTemplate()->name() === 'study') {
                return $status !== 'listed';
            }
            
            // For all other pages, use default permissions
            return $permissions;
        }
    ]
];