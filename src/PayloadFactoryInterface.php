<?php declare(strict_types = 1);

namespace WebChemistry\Payload;

use Nette\Application\UI\Form;

interface PayloadFactoryInterface
{

	public function create(): PayloadInterface;

	public function createFormPayload(Form $form): PayloadInterface;

}
