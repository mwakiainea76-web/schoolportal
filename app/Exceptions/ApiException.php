<?php

namespace App\Exceptions;

use Exception;

class ApiException extends Exception
{
    public function __construct(
        string $errorCode,
        string $message,
        protected int $status = 422,
        protected array $details = []
    ) {
        parent::__construct($message);
        $this->code = 0;
        $this->errorCode = $errorCode;
    }

    protected string $errorCode;

    public function errorCode(): string
    {
        return $this->errorCode;
    }

    public function status(): int
    {
        return $this->status;
    }

    public function details(): array
    {
        return $this->details;
    }
}
