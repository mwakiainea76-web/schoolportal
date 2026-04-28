## Fee Model Resolution Logic

### Overview

The Finance Module uses a hierarchical scope system to automatically resolve the most appropriate fee model for a student enrollment. This ensures that:

- Specific curriculum-level fees override department-level fees
- Department-level fees override global fees
- Higher priority models override lower priority models within the same scope

### Resolution Hierarchy

```
Priority Order (resolved in this sequence):
1. CURRICULUM SCOPE (Highest Specificity)
   - Filters: scope='curriculum' AND curricula_id={student_curriculum} AND academic_session_id={session}
   - Ordered by: priority DESC, sort_order ASC, created_at DESC

2. DEPARTMENT SCOPE (Medium Specificity)
   - Filters: scope='department' AND department_id={curriculum_department} AND academic_session_id={session}
   - Ordered by: priority DESC, sort_order ASC, created_at DESC

3. GLOBAL SCOPE (Lowest Specificity - Fallback)
   - Filters: scope='global' AND academic_session_id={session}
   - Ordered by: priority DESC, sort_order ASC, created_at DESC
```

### Usage Example

#### Method 1: Using the FeeResolutionService (Recommended)

```php
use App\Services\FeeResolutionService;

$feeService = new FeeResolutionService();

// Resolve fee model for an enrollment in a specific session
$enrollment = Enrollment::find(1);
$session = AcademicSession::find(1);
$feeModel = $feeService->resolveFeeModel($enrollment, $session);

// Resolve with debug information (shows hierarchy path)
$result = $feeService->resolveFeeModelWithPath($enrollment, $session);
// Returns: ['resolved_model' => FeeModel, 'hierarchy_path' => 'curriculum:5 → global']
```

#### Method 2: Manual Query Using Model Scopes

```php
// For curriculum scope
$model = FeeModel::where('scope', 'curriculum')
    ->where('curricula_id', $curriculum_id)
    ->forSession($session_id)
    ->active()
    ->validForDate()
    ->ordered()
    ->first();

// If not found, try department scope
if (!$model) {
    $model = FeeModel::forDepartment($department_id)
        ->forSession($session_id)
        ->active()
        ->validForDate()
        ->ordered()
        ->first();
}

// If still not found, try global scope
if (!$model) {
    $model = FeeModel::global()
        ->forSession($session_id)
        ->active()
        ->validForDate()
        ->ordered()
        ->first();
}
```

### Database Fields Used in Resolution

- `fee_models.scope` - Defines the scope level: 'global', 'department', or 'curriculum'
- `fee_models.priority` - Numeric priority (60, 70, 80). Higher values take precedence within scope
- `fee_models.curricula_id` - References the curriculum for curriculum-scope models
- `fee_models.department_id` - References the department for department-scope models
- `fee_models.academic_session_id` - Session for which this model applies
- `fee_models.is_active` - Must be true for a model to be considered
- `fee_models.valid_from` - Model is valid from this date (inclusive)
- `fee_models.valid_until` - Model is valid until this date (inclusive), NULL = no end date

### Priority Ordering Within Scopes

When multiple fee models exist at the same scope level, they are ordered by:

1. **Priority DESC** - Higher numeric priority (80 > 70 > 60) wins
2. **sort_order ASC** - Lower sort_order (0 = first)
3. **created_at DESC** - Most recently created (if priority and sort_order are equal)

### Related Services & Models

- `App\Services\FeeResolutionService` - Main service for fee model resolution
- `App\Models\FeeModel` - Fee model definition
- `App\Models\Enrollment` - Student enrollment linking student to curriculum
- `App\Models\Curriculum` - Curriculum with department reference

### Notes

- The resolution service caches nothing - it queries fresh each time
- All queries apply the `validForDate()` scope to ensure date-based validity
- The `active()` scope ensures only `is_active=true` models are considered
- The service returns `null` if no valid fee model exists for the enrollment
