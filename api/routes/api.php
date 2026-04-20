<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ToolController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/tools', [ToolController::class, 'index']);
Route::get('/tools/{slug}', [ToolController::class, 'show']);
Route::get('/plans', [PlanController::class, 'index']);

// Stripe webhook (no auth — Stripe calls this)
Route::post('/stripe/webhook', [SubscriptionController::class, 'webhook']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Subscription
    Route::get('/subscription', [SubscriptionController::class, 'getSubscription']);
    Route::post('/subscription/checkout', [SubscriptionController::class, 'createCheckoutSession']);
    Route::post('/subscription/portal', [SubscriptionController::class, 'customerPortal']);
});
