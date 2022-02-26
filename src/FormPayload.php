<?php declare(strict_types = 1);

namespace WebChemistry\Payload;

use Nette\Forms\Controls\BaseControl;
use Nette\Forms\Form;

final class FormPayload extends Payload
{

	public function __construct(Form $form, bool $debugMode = false)
	{
		parent::__construct($debugMode);

		if (!$form->isSuccess()) {
			foreach ($form->getOwnErrors() as $error) {
				$this->addClientError((string) $error);
			}

			/** @var BaseControl $control */
			foreach ($form->getControls() as $control) {
				foreach ($control->getErrors() as $error) {
					$this->addClientError(sprintf('%s: %s', (string) $control->caption, (string) $error));
				}
			}
		}
	}



}
