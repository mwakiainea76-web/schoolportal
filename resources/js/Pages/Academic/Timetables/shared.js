export const STUDY_SLOTS = [
    {
        id: "08:00|10:00",
        label: "08:00 - 10:00",
        start_time: "08:00",
        end_time: "10:00",
        helper: "Morning study slot",
    },
    {
        id: "11:00|13:00",
        label: "11:00 - 13:00",
        start_time: "11:00",
        end_time: "13:00",
        helper: "After break",
    },
    {
        id: "14:00|16:00",
        label: "14:00 - 16:00",
        start_time: "14:00",
        end_time: "16:00",
        helper: "After lunch",
    },
];

export const assignmentMatchesForm = (assignment, data, session) =>
    String(assignment.trainer_staff_id || "") ===
        String(data.trainer_staff_id || "") &&
    String(assignment.lecture_room_id || "") ===
        String(data.lecture_room_id || "") &&
    String(assignment.day_of_week || "") ===
        String(session.day_of_week || "") &&
    String(assignment.start_time || "") === String(session.start_time || "") &&
    String(assignment.end_time || "") === String(session.end_time || "");

export const collectMatchingMergedUnits = (
    curriculumUnits,
    selectedUnit,
    data,
) => {
    if (
        !selectedUnit ||
        !data.trainer_staff_id ||
        !data.lecture_room_id ||
        !data.sessions.length
    ) {
        return [];
    }

    return curriculumUnits
        .filter((unit) => unit.id !== selectedUnit.id)
        .filter((unit) => (unit.assigned_timetables || []).length > 0)
        .filter((unit) =>
            data.sessions.every((session) =>
                (unit.assigned_timetables || []).some((assignment) =>
                    assignmentMatchesForm(assignment, data, session),
                ),
            ),
        );
};

export const hasExactOccupiedSlot = (curriculumUnits, selectedUnit, data) =>
    Boolean(selectedUnit) &&
    Boolean(data.trainer_staff_id) &&
    Boolean(data.lecture_room_id) &&
    data.sessions.length > 0 &&
    curriculumUnits.some(
        (unit) =>
            unit.id !== selectedUnit.id &&
            (unit.assigned_timetables || []).length > 0 &&
            data.sessions.every((session) =>
                (unit.assigned_timetables || []).some((assignment) =>
                    assignmentMatchesForm(assignment, data, session),
                ),
            ),
    );
