<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admission Letter - {{ $student->admission_number }}</title>
    <style>
        :root {
            color-scheme: light;
            --ink: #0f172a;
            --muted: #475569;
            --line: #cbd5e1;
            --soft: #f8fafc;
            --brand: #14532d;
            --brand-soft: #dcfce7;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 24px;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--ink);
            background: #e2e8f0;
        }

        .page {
            max-width: 920px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px;
            box-shadow: 0 18px 60px rgba(15, 23, 42, 0.12);
        }

        .toolbar {
            max-width: 920px;
            margin: 0 auto 16px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        .toolbar a,
        .toolbar button {
            border: 0;
            background: var(--brand);
            color: #ffffff;
            padding: 10px 16px;
            border-radius: 999px;
            text-decoration: none;
            font-size: 14px;
            cursor: pointer;
        }

        .heading {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            border-bottom: 2px solid var(--line);
            padding-bottom: 20px;
            margin-bottom: 28px;
        }

        .heading h1 {
            margin: 0 0 8px;
            font-size: 30px;
            letter-spacing: 0.02em;
        }

        .eyebrow {
            margin: 0 0 10px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            font-size: 12px;
            color: var(--muted);
        }

        .meta {
            text-align: right;
            font-size: 14px;
            color: var(--muted);
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            margin: 24px 0 32px;
        }

        .card {
            border: 1px solid var(--line);
            background: var(--soft);
            border-radius: 14px;
            padding: 18px;
        }

        .card h2 {
            margin: 0 0 14px;
            font-size: 16px;
        }

        .grid {
            display: grid;
            grid-template-columns: 180px 1fr;
            gap: 8px 14px;
            font-size: 14px;
        }

        .grid .label {
            color: var(--muted);
            font-weight: 600;
        }

        .notice {
            border: 1px solid #86efac;
            background: var(--brand-soft);
            border-radius: 14px;
            padding: 18px;
            margin: 28px 0;
        }

        .notice h2 {
            margin: 0 0 10px;
            font-size: 17px;
        }

        .notice p,
        .body p {
            margin: 0 0 12px;
            line-height: 1.65;
            font-size: 15px;
        }

        .credentials {
            margin-top: 16px;
            border-top: 1px dashed #86efac;
            padding-top: 16px;
        }

        .credentials code {
            background: rgba(255, 255, 255, 0.75);
            padding: 2px 6px;
            border-radius: 6px;
            font-size: 14px;
        }

        .signoff {
            margin-top: 36px;
            padding-top: 24px;
            border-top: 1px solid var(--line);
        }

        .signoff strong {
            display: block;
            margin-bottom: 6px;
        }

        @media print {
            body {
                padding: 0;
                background: #ffffff;
            }

            .toolbar {
                display: none;
            }

            .page {
                max-width: none;
                box-shadow: none;
                margin: 0;
                padding: 28px;
            }
        }
    </style>
</head>

<body>
    <div class="toolbar">
        <a href="{{ route('students.edit', $student) }}">Back to Student</a>
        <button type="button" onclick="window.print()">Print Letter</button>
    </div>

    <main class="page">
        <section class="heading">
            <div>
                <p class="eyebrow">{{ config('app.name') }}</p>
                <h1>Admission Letter</h1>
                <p style="margin: 0; color: var(--muted);">Official confirmation of student admission and onboarding
                    guidance.</p>
            </div>
            <div class="meta">
                <div><strong>Date:</strong> {{ now()->format('F j, Y') }}</div>
                <div><strong>Reference:</strong> {{ $student->admission_number }}</div>
                <div><strong>Status:</strong> {{ ucfirst($student->enrollment_status) }}</div>
            </div>
        </section>

        <section class="body">
            <p>Dear {{ trim(($student->first_name ?? '').' '.($student->last_name ?? '')) }},</p>
            <p>
                We are pleased to confirm your admission to {{ config('app.name') }}.
                This letter serves as your official admission notice and confirms your onboarding details.
            </p>
        </section>

        <section class="summary">
            <article class="card">
                <h2>Student Details</h2>
                <div class="grid">
                    <div class="label">Full Name</div>
                    <div>{{ trim(($student->first_name ?? '').' '.($student->other_name ?? '').' '.($student->last_name
                        ?? ''))
                        }}</div>
                    <div class="label">admission No.</div>
                    <div>{{ $student->admission_number }}</div>
                    <div class="label">Email</div>
                    <div>{{ $student->email ?? 'Not set' }}</div>
                    <div class="label">Phone</div>
                    <div>{{ $student->phone_number ?? 'Not set' }}</div>
                    <div class="label">Admission Date</div>
                    <div>{{ \Illuminate\Support\Carbon::parse($student->created_at)->format('F j, Y') }}</div>
                    <div class="label">Current Module</div>
                    <div>{{ $student->current_module }}</div>
                </div>
            </article>

            <article class="card">
                <h2>Course Details</h2>
                <div class="grid">
                    <div class="label">Course</div>
                    <div>{{ $course?->name ?? 'Not assigned' }}</div>
                    <div class="label">Version</div>
                    <div>{{ $curriculum?->name ?? 'Not assigned' }}</div>
                    <div class="label">Department</div>
                    <div>{{ $department?->name ?? 'Not assigned' }}</div>
                    <div class="label">Level</div>
                    <div>{{ $certificationLevel?->name ?? 'Not assigned' }}</div>
                    <div class="label">Course Code</div>
                    <div>{{ $course?->code ?? 'Not assigned' }}</div>
                </div>
            </article>
        </section>

        <section class="notice">
            <h2>Student Portal Access</h2>
            <p>The student portal account is managed separately for security. Share access details with the student
                through the approved onboarding channel.</p>
            <div class="credentials">
                <p><strong>Portal URL:</strong> <code>{{ route('login') }}</code></p>
                <p><strong>Important:</strong> Do not print or disclose default passwords in admission letters.</p>
            </div>
        </section>

        <section class="body">
            <p>
                Kindly keep this letter for your records. You will use the student portal to view your academic
                sessions,
                course units, and billing information.
            </p>
            <p>
                If you need help accessing your portal, please contact the admissions or ICT office for assistance.
            </p>
        </section>

        <section class="signoff">
            <strong>Admissions Office</strong>
            <div>{{ config('app.name') }}</div>
        </section>
    </main>
</body>

</html>