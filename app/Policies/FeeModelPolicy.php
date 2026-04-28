<?php

namespace App\Policies;

use App\Models\FeeModel;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FeeModelPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view fee models');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, FeeModel $feeModel): bool
    {
        return $user->hasPermissionTo('view fee models');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create fee models');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, FeeModel $feeModel): bool
    {
        return $user->hasPermissionTo('update fee models');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, FeeModel $feeModel): bool
    {
        return $user->hasPermissionTo('delete fee models');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, FeeModel $feeModel): bool
    {
        return $user->hasPermissionTo('restore fee models');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, FeeModel $feeModel): bool
    {
        return $user->hasPermissionTo('force delete fee models');
    }
}
