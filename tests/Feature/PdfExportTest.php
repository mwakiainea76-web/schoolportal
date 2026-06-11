<?php

use App\Models\Department;
use App\Models\User;

it('exports departments as a pdf download', function () {
    $user = User::factory()->create();

    Department::factory()->create([
        'name' => 'Applied Sciences',
        'code' => 'SCI',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('export.resource', [
            'resource' => 'departments',
            'search' => 'SCI',
            'sort' => 'code',
            'direction' => 'asc',
        ]));

    $response
        ->assertOk()
        ->assertHeader('Content-Type', 'application/pdf')
        ->assertHeader('Content-Disposition', 'attachment; filename="departments_'.now()->format('Y_m_d').'.pdf"');

    expect($response->getContent())->toStartWith('%PDF');
});

it('exports departments as a csv download', function () {
    $user = User::factory()->create();

    Department::factory()->create([
        'name' => 'Applied Sciences',
        'code' => 'SCI',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('export.resource', [
            'resource' => 'departments',
            'format' => 'csv',
            'search' => 'SCI',
            'sort' => 'code',
            'direction' => 'asc',
        ]));

    $response
        ->assertOk()
        ->assertHeader('Content-Type', 'text/csv; charset=UTF-8')
        ->assertHeader('Content-Disposition', 'attachment; filename="departments_'.now()->format('Y_m_d').'.csv"');

    expect($response->getContent())
        ->toContain('S/N,Code,Name,HOD,Created')
        ->toContain('SCI')
        ->toContain('Applied Sciences');
});

it('exports departments as an excel download', function () {
    $user = User::factory()->create();

    Department::factory()->create([
        'name' => 'Applied Sciences',
        'code' => 'SCI',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('export.resource', [
            'resource' => 'departments',
            'format' => 'excel',
            'search' => 'SCI',
            'sort' => 'code',
            'direction' => 'asc',
        ]));

    $response
        ->assertOk()
        ->assertHeader('Content-Type', 'application/vnd.ms-excel; charset=UTF-8')
        ->assertHeader('Content-Disposition', 'attachment; filename="departments_'.now()->format('Y_m_d').'.xls"');

    expect($response->getContent())
        ->toContain("S/N\tCode\tName\tHOD\tCreated")
        ->toContain('SCI')
        ->toContain('Applied Sciences');
});
