<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use Auditable, HasFactory;

    protected string $auditModule = 'invoice_items';

    protected $table = 'invoice_items';

    protected $fillable = [
        'student_invoice_id',
        'fee_plan_item_id',
        'description',
        'unit_amount',
        'quantity',
        'total_amount',
    ];

    protected $casts = [
        'unit_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function invoice()
    {
        return $this->belongsTo(StudentInvoice::class, 'student_invoice_id');
    }

    public function feePlanItem()
    {
        return $this->belongsTo(FeePlanItem::class, 'fee_plan_item_id');
    }
}
