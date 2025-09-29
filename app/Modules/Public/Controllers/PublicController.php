<?php

namespace App\Modules\Public\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

/**
 * Base controller for Public module
 * Handles all public-facing pages and functionality
 */
class PublicController extends Controller
{
    /**
     * Display the public homepage
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Public/Home', [
            'title' => 'Welcome to AirDrop Jamaica'
        ]);
    }

    /**
     * Display about page
     *
     * @return \Inertia\Response
     */
    public function about()
    {
        return Inertia::render('Public/About', [
            'title' => 'About Us'
        ]);
    }

    /**
     * Display contact page
     *
     * @return \Inertia\Response
     */
    public function contact()
    {
        return Inertia::render('Public/Contact', [
            'title' => 'Contact Us'
        ]);
    }
}
