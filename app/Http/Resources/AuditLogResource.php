<?php

namespace App\Http\Resources;

use App\Support\AuditLogDisplay;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return AuditLogDisplay::toArray($this->resource, true, null);
    }
}
