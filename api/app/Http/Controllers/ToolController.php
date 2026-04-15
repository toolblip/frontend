<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;

class ToolController extends Controller
{
    public function index(): JsonResponse
    {
        $tools = File::json(resource_path('js/tools.json')) ?? [];

        return response()->json(['tools' => $tools]);
    }

    public function show(string $slug): JsonResponse
    {
        $tools = File::json(resource_path('js/tools.json')) ?? [];
        $tool = collect($tools)->firstWhere('slug', $slug);

        if (! $tool) {
            return response()->json(['error' => 'Tool not found'], 404);
        }

        return response()->json(['tool' => $tool]);
    }
}
