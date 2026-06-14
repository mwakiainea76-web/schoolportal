<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => $this->user ? [
                'id' => $this->user->id,
                'email' => $this->user->email,
                'login_id' => $this->user->login_id,
                'name' => $this->userDisplayLabel($this->user),
            ] : null,
            'school_id' => $this->school_id,
            'module' => $this->module,
            'action' => $this->action,
            'entity_type' => $this->entity_type,
            'entity_id' => $this->entity_id,
            'entity_label' => $this->entity_label,
            'old_values' => $this->old_values,
            'new_values' => $this->new_values,
            'metadata' => $this->metadata,
            'ip_address' => $this->ip_address,
            'user_agent_hash' => $this->user_agent_hash,
            'request_id' => $this->request_id,
            'created_at' => optional($this->created_at)->toDateTimeString(),
            'is_high_risk' => (bool) data_get($this->metadata, 'high_risk', false),
        ];
    }

    protected function userDisplayLabel(User $user): string
    {
        $roleLabel = $user->relationLoaded('roles')
            ? $user->roles->pluck('name')->filter()->map(fn ($role) => ucfirst((string) $role))->join(' / ')
            : '';

        $profile = $user->relationLoaded('student') && $user->student
            ? $user->student
            : (($user->relationLoaded('staff') && $user->staff) ? $user->staff : null);

        $name = $profile?->full_name
            ?: $user->login_id
            ?: $user->email;

        return trim(($roleLabel !== '' ? $roleLabel.' - ' : '').$name);
    }
}
