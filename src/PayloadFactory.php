<?php declare(strict_types = 1);

namespace WebChemistry\Payload;

use Nette\Application\UI\Form;

final class PayloadFactory implements PayloadFactoryInterface
{

	public function __construct(
		private bool $debugMode,
	)
	{
	}

	public function create(): Payload
	{
		return new Payload($this->debugMode);
	}

	public function createFormPayload(Form $form): FormPayload
	{
		return new FormPayload($form, $this->debugMode);
	}

}
