<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'stripe_id',
        'tier',
        'billing',
        'name',
        'price_monthly',
        'price_yearly',
        'description',
        'devices',
        'storage_gb',
        'max_file_size_mb',
        'team_seats',
        'api_access',
        'priority_support',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'price_monthly' => 'decimal:2',
        'price_yearly' => 'decimal:2',
        'api_access' => 'boolean',
        'priority_support' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get active plans, ordered by sort_order then price.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order')->orderBy('price_monthly');
    }

    /**
     * Get unique tiers (one per tier, not per billing cycle).
     */
    public function scopeTiers($query)
    {
        return $query->selectRaw('MIN(id) as id, tier, MIN(name) as name, MIN(price_monthly) as price_monthly, MIN(price_yearly) as price_yearly, MIN(description) as description, MIN(devices) as devices, MIN(storage_gb) as storage_gb, MIN(max_file_size_mb) as max_file_size_mb, MAX(team_seats) as team_seats, MAX(api_access) as api_access, MAX(priority_support) as priority_support, MIN(sort_order) as sort_order, MAX(is_active) as is_active')
            ->where('is_active', true)
            ->groupBy('tier')
            ->orderBy('sort_order');
    }
}
