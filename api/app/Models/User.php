<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'is_pro', 'stripe_customer_id', 'subscription_id', 'subscription_status', 'subscription_tier', 'plan_ends_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_pro' => 'boolean',
            'plan_ends_at' => 'datetime',
        ];
    }

    public function isSubscribed(): bool
    {
        return $this->is_pro && $this->plan_ends_at && $this->plan_ends_at->isFuture();
    }
}