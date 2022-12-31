import React, { useState } from "react";

export default function Dropdown({ label, placeholder, options, enabled, onItemSelected }) {
	const [showOptions, setShowOptions] = useState(false);
	const [selectedOption, setSelectedOption] = useState(placeholder);

	const optionSelectedHandler = (option) => {
		setSelectedOption(option);
		onItemSelected(option);
		setShowOptions(false);
	};

	return (
		<div className="slds-form-element slds-form-element_stacked">
			<label
				className="slds-form-element__label"
				for="combobox-id-2"
				id="combobox-label-id-131">
				{label}
			</label>
			<div className="slds-form-element__control">
				<div className="slds-combobox_container">
					<div className="slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open">
						<div
							className="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right"
							role="none">
							<button
								onClick={() => setShowOptions(!showOptions)}
								type="button"
								className="slds-input_faux slds-combobox__input slds-has-focus"
								aria-labelledby="combobox-label-id-131 combobox-id-2-selected-value"
								id="combobox-id-2-selected-value"
								aria-controls="listbox-id-4"
								aria-expanded="true"
								aria-haspopup="listbox">
								<span className="slds-truncate" id="combobox-value-id-94">
									{selectedOption}
								</span>
							</button>
							<span className="slds-icon_container slds-icon-utility-down slds-input__icon slds-input__icon_right">
								<svg
									className="slds-icon slds-icon slds-icon_x-small slds-icon-text-default"
									aria-hidden="true">
									<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>
								</svg>
							</span>
						</div>
						{showOptions && (
							<div
								id="listbox-id-4"
								className="slds-dropdown slds-dropdown_length-5 slds-dropdown_fluid"
								role="listbox">
								<ul
									className="slds-listbox slds-listbox_vertical"
									role="presentation">
									{options.map((option) => (
										<li
											onClick={() => optionSelectedHandler(option)}
											role="presentation"
											className="slds-listbox__item">
											<div
												id={`${option}_option`}
												className="slds-media slds-listbox__option slds-listbox__option_plain slds-media_small"
												role="option">
												<span className="slds-media__figure slds-listbox__option-icon"></span>
												<span className="slds-media__body">
													<span className="slds-truncate" title={option}>
														{option}
													</span>
												</span>
											</div>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
