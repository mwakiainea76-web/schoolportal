<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHostelRequest;
use App\Http\Requests\UpdateHostelRequest;
use App\Models\Hostel;
use App\Models\HostelBed;
use App\Models\HostelRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class HostelController extends Controller
{
    public function index(Request $request)
    {
        $hostels = Hostel::query()
            ->with(['rooms' => fn ($query) => $query->orderBy('name')])
            ->withCount('rooms')
            ->withCount(['allocations as active_allocations_count' => fn ($query) => $query->where('status', 'active')])
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = $request->string('search')->toString();
                $query->where(function ($builder) use ($term) {
                    $builder
                        ->where('name', 'like', "%{$term}%")
                        ->orWhere('code', 'like', "%{$term}%")
                        ->orWhere('location', 'like', "%{$term}%");
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $hostels->through(fn (Hostel $hostel) => $this->transformHostel($hostel));

        return inertia('Hostels/Index', [
            'hostels' => $hostels,
            'filters' => [
                'search' => $request->string('search')->toString(),
            ],
        ]);
    }

    public function create()
    {
        return inertia('Hostels/Create');
    }

    public function store(StoreHostelRequest $request)
    {
        DB::transaction(function () use ($request) {
            $hostel = Hostel::create([
                'name' => $request->string('name')->toString(),
                'code' => $request->string('code')->toString(),
                'session_fee_amount' => $request->input('session_fee_amount'),
                'gender' => $request->input('gender'),
                'location' => $request->input('location'),
                'description' => $request->input('description'),
                'is_active' => $request->boolean('is_active', true),
            ]);

            $this->syncRooms($hostel, $request->input('rooms', []));
        });

        return to_route('hostels.index')->with('success', 'Hostel created successfully.');
    }

    public function edit(Hostel $hostel)
    {
        $hostel->load(['rooms.beds' => fn ($query) => $query->orderBy('bed_number')]);

        return inertia('Hostels/Edit', [
            'hostel' => $this->transformHostel($hostel, true),
        ]);
    }

    public function update(UpdateHostelRequest $request, Hostel $hostel)
    {
        $roomIds = collect($request->input('rooms', []))
            ->pluck('id')
            ->filter()
            ->all();

        $duplicateRoom = HostelRoom::query()
            ->whereIn('id', $roomIds)
            ->where(function ($query) use ($request, $roomIds) {
                foreach ($request->input('rooms', []) as $room) {
                    if (! empty($room['id'])) {
                        $query->orWhere(function ($builder) use ($room) {
                            $builder
                                ->where('code', $room['code'])
                                ->where('id', '!=', $room['id']);
                        });
                    } else {
                        $query->orWhere('code', $room['code']);
                    }
                }
            })
            ->exists();

        if ($duplicateRoom) {
            throw ValidationException::withMessages([
                'rooms' => 'Each room code must be unique across the hostel inventory.',
            ]);
        }

        DB::transaction(function () use ($request, $hostel) {
            $hostel->update([
                'name' => $request->string('name')->toString(),
                'code' => $request->string('code')->toString(),
                'session_fee_amount' => $request->input('session_fee_amount'),
                'gender' => $request->input('gender'),
                'location' => $request->input('location'),
                'description' => $request->input('description'),
                'is_active' => $request->boolean('is_active'),
            ]);

            $this->syncRooms($hostel, $request->input('rooms', []));
        });

        return to_route('hostels.index')->with('success', 'Hostel updated successfully.');
    }

    public function destroy(Hostel $hostel)
    {
        if ($hostel->allocations()->exists()) {
            return to_route('hostels.index')->with('error', 'This hostel already has bed allocations and cannot be deleted.');
        }

        DB::transaction(function () use ($hostel) {
            foreach ($hostel->rooms as $room) {
                $room->beds()->forceDelete();
            }

            $hostel->rooms()->forceDelete();
            $hostel->forceDelete();
        });

        return to_route('hostels.index')->with('success', 'Hostel deleted successfully.');
    }

    protected function syncRooms(Hostel $hostel, array $rooms): void
    {
        $existingRooms = $hostel->rooms()->with(['beds.allocations'])->get()->keyBy('id');
        $submittedRoomIds = collect($rooms)->pluck('id')->filter()->map(fn ($id) => (int) $id)->all();

        foreach ($rooms as $roomData) {
            $room = ! empty($roomData['id']) && $existingRooms->has((int) $roomData['id'])
                ? $existingRooms[(int) $roomData['id']]
                : new HostelRoom(['hostel_id' => $hostel->id]);

            $room->fill([
                'hostel_id' => $hostel->id,
                'name' => $roomData['name'],
                'code' => $roomData['code'],
                'floor' => $roomData['floor'] ?? null,
                'bed_count' => (int) $roomData['bed_count'],
                'is_active' => (bool) ($roomData['is_active'] ?? true),
            ]);
            $room->save();

            $this->syncBeds($room, (int) $roomData['bed_count']);
        }

        foreach ($existingRooms as $existingRoom) {
            if (in_array($existingRoom->id, $submittedRoomIds, true)) {
                continue;
            }

            $hasAllocations = $existingRoom->beds->contains(
                fn ($bed) => $bed->allocations->isNotEmpty()
            );

            if ($hasAllocations) {
                throw ValidationException::withMessages([
                    'rooms' => "Room {$existingRoom->name} cannot be removed because it already has hostel allocations.",
                ]);
            }

            $existingRoom->beds()->forceDelete();
            $existingRoom->forceDelete();
        }
    }

    protected function syncBeds(HostelRoom $room, int $bedCount): void
    {
        $existingBeds = HostelBed::withTrashed()
            ->where('hostel_room_id', $room->id)
            ->withCount('allocations')
            ->orderBy('bed_number')
            ->get()
            ->keyBy('bed_number');

        for ($bedNumber = 1; $bedNumber <= $bedCount; $bedNumber++) {
            $bed = $existingBeds->get($bedNumber) ?: new HostelBed([
                'hostel_room_id' => $room->id,
                'bed_number' => $bedNumber,
            ]);

            $bed->fill([
                'hostel_room_id' => $room->id,
                'bed_number' => $bedNumber,
                'label' => $room->code.'-BED-'.str_pad((string) $bedNumber, 2, '0', STR_PAD_LEFT),
                'is_active' => true,
            ]);
            $bed->save();

            if (method_exists($bed, 'restore') && $bed->trashed()) {
                $bed->restore();
            }
        }

        foreach ($existingBeds as $bedNumber => $bed) {
            if ($bedNumber <= $bedCount) {
                continue;
            }

            if ((int) $bed->allocations_count > 0) {
                throw ValidationException::withMessages([
                    'rooms' => "Bed {$bed->label} cannot be removed because it already has hostel allocations.",
                ]);
            }

            $bed->forceDelete();
        }
    }

    protected function transformHostel(Hostel $hostel, bool $includeRooms = false): array
    {
        $data = [
            'id' => $hostel->id,
            'name' => $hostel->name,
            'code' => $hostel->code,
            'session_fee_amount' => (float) $hostel->session_fee_amount,
            'gender' => $hostel->gender,
            'location' => $hostel->location,
            'description' => $hostel->description,
            'is_active' => (bool) $hostel->is_active,
            'rooms_count' => $hostel->rooms_count ?? $hostel->rooms->count(),
            'beds_count' => $hostel->rooms->sum(fn ($room) => $room->bed_count ?? $room->beds->count()),
            'active_allocations_count' => $hostel->active_allocations_count ?? 0,
        ];

        if ($includeRooms) {
            $data['rooms'] = $hostel->rooms
                ->sortBy('name')
                ->map(fn (HostelRoom $room) => [
                    'id' => $room->id,
                    'name' => $room->name,
                    'code' => $room->code,
                    'floor' => $room->floor,
                    'bed_count' => (int) $room->bed_count,
                    'is_active' => (bool) $room->is_active,
                    'beds_count' => $room->beds->count(),
                ])
                ->values()
                ->all();
        }

        return $data;
    }
}
