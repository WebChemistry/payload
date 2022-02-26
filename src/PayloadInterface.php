<?php declare(strict_types = 1);

namespace WebChemistry\Payload;

use Nette\Application\UI\Presenter;

interface PayloadInterface
{

	/**
	 * @never
	 */
	public function sendPresenter(Presenter $presenter): void;

}
