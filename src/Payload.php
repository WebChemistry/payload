<?php declare(strict_types = 1);

namespace WebChemistry\Payload;

use Nette\Application\UI\Presenter;

class Payload implements PayloadInterface
{

	public int $code = 200;

	/** @var mixed[] */
	public array $data = [];

	/** @var array<string|int, mixed>  */
	protected array $meta = [];

	/** @var array<int, array{ message: string, type: string }> */
	protected array $errors = [];

	public function __construct(
		protected bool $debugMode = false,
	)
	{
	}

	public function setMeta(string|int $key, mixed $value): self
	{
		$this->meta[$key] = $value;

		return $this;
	}

	public function addError(string $message, string $type, ?int $code = null): self
	{
		$this->errors[] = [
			'type' => $type,
			'message' => $message,
		];

		if ($code !== null && $this->code === 200) {
			$this->code = $code;
		}

		return $this;
	}

	public function addClientError(string $message): self
	{
		return $this->addError($message, 'client', 400);
	}

	public function addCriticalError(string $message, bool $sensitiveData = true): self
	{
		$this->code = 500;

		if ($sensitiveData && !$this->debugMode) {
			return $this;
		}

		$this->addError($message, 'critical', 500);

		return $this;
	}

	/**
	 * @never
	 */
	public function sendPresenter(Presenter $presenter): void
	{
		$payload = $presenter->getPayload();

		$payload->code = $this->code;
		$payload->meta = $this->meta;
		$payload->data = $this->data;
		$payload->errors = $this->errors;

		$presenter->sendPayload();
	}

}
