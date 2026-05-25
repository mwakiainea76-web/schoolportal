<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLectureRoomRequest;
use App\Http\Requests\UpdateLectureRoomRequest;
use App\Models\Department;
use App\Models\LectureRoom;
use Illuminate\Http\Request;

class LectureRoomController extends Controller
{
    public function index(Request $request)
    {
        $query = LectureRoom::query()->with('department:id,name');

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->integer('department_id'));
        }

        if ($request->filled('search')) {
            $term = $request->string('search')->toString();
            $query->where(function ($builder) use ($term) {
                $builder
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('code', 'like', "%{$term}%")
                    ->orWhere('location', 'like', "%{$term}%");
            });
        }

        $lectureRooms = $query
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return inertia('LectureRooms/Index', [
            'lecture_rooms' => $lectureRooms,
            'departments' => $this->departmentOptions(),
            'filters' => [
                'department_id' => $request->filled('department_id') ? (string) $request->integer('department_id') : '',
                'search' => $request->string('search')->toString(),
            ],
        ]);
    }

    public function create()
    {
        return inertia('LectureRooms/Create', [
            'departments' => $this->departmentOptions(),
        ]);
    }

    public function store(StoreLectureRoomRequest $request)
    {
        LectureRoom::create([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return to_route('lecture-rooms.index')->with('success', 'Lecture room created successfully.');
    }

    public function edit(LectureRoom $lecture_room)
    {
        return inertia('LectureRooms/Edit', [
            'lecture_room' => $lecture_room,
            'departments' => $this->departmentOptions(),
        ]);
    }

    public function update(UpdateLectureRoomRequest $request, LectureRoom $lecture_room)
    {
        $lecture_room->update([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active'),
        ]);

        return to_route('lecture-rooms.index')->with('success', 'Lecture room updated successfully.');
    }

    public function destroy(LectureRoom $lecture_room)
    {
        if ($lecture_room->academicTimetables()->exists()) {
            return to_route('lecture-rooms.index')->with('error', 'This lecture room is already used in the timetable and cannot be deleted.');
        }

        $lecture_room->delete();

        return to_route('lecture-rooms.index')->with('success', 'Lecture room deleted successfully.');
    }

    protected function departmentOptions(): array
    {
        return Department::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Department $department) => [
                'id' => (string) $department->id,
                'name' => $department->name,
            ])
            ->values()
            ->all();
    }
}
