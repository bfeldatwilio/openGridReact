import React, { useState } from "react";
import Dropdown from "./dropdown";
import FieldFilterCmp from "./fieldFilterCmp";
const OPERATORS = [
	{ label: "Equal to", value: "eq" },
	{ label: "Not Equal to", value: "ne" },
	{ label: "Greater Than or Equal", value: "gte" },
	{ label: "Less Than or Equal", value: "lte" },
];
const FIELDTYPES = {
	STRING: "string",
	DATE: "date",
	PERCENT: "percent",
	PICKLIST: "picklist",
	CURRENCY: "currency",
	INT: "int",
};
export default function AddFilterCmp({ fields, onFilterSet }) {
	const [filterField, setFilterField] = useState();
	const [filterOperator, setFilterOperator] = useState(OPERATORS[0]);
	const [filterValue, setFilterValue] = useState();
	const [fieldType, setFieldType] = useState(FIELDTYPES.STRING);
	const [showPopover, setShowPopover] = useState(false);

	const addFilterClickHandler = (e) => {
		e.preventDefault();
		let filter = {
			fieldLabel: filterField.label,
			fieldName: filterField.name,
			fieldType: filterField.type,
			operatorLabel: filterOperator.label,
			operatorValue: filterOperator.value,
			value: filterValue,
		};
		onFilterSet(filter);
		setShowPopover(false);
	};

	const fieldSelectClickHandler = (fieldLabel) => {
		let fieldObject = fields.find((fieldObj) => fieldObj.label === fieldLabel);
		console.log(fieldObject);
		if (fieldObject.type === FIELDTYPES.PICKLIST) {
			fieldObject.picklistValueLabels = fieldObject.picklistValues.map(
				(picklistItem) => picklistItem.label
			);
		}
		setFilterField(fieldObject);
		setFieldType(fieldObject.type);
	};

	const operatorSelectClickHandler = (operatorLabel) => {
		let operatorObject = OPERATORS.find((operatorobj) => operatorobj.label === operatorLabel);
		setFilterOperator(operatorObject);
	};

	const valueSelectClickHandler = (valueLabel) => {
		setFilterValue(valueLabel);
	};

	return (
		<div className="slds-filters__footer slds-grid slds-shrink-none add-btn-footer">
			<button
				onClick={() => setShowPopover(true)}
				className="slds-button_reset slds-text-link">
				Add Filter
			</button>
			{showPopover && (
				<div className="filterPopoverContainer">
					<section
						aria-label="Edit Filter"
						aria-describedby="popover-body-id"
						className="slds-popover slds-nubbin_right-bottom"
						role="dialog">
						<div
							onClick={() => setShowPopover(false)}
							className="slds-button slds-button_icon slds-button_icon slds-button_icon-small slds-float_right slds-popover__close"
							title="Close dialog">
							<svg className="slds-button__icon" aria-hidden="true">
								<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
							</svg>
							<span className="slds-assistive-text">Close dialog</span>
						</div>
						<div id="popover-body-id" className="slds-popover__body">
							<form className="slds-form">
								<Dropdown
									label="Field"
									placeholder="Choose Field"
									onItemSelected={fieldSelectClickHandler}
									options={fields.map((field) => field.label)}></Dropdown>
								<Dropdown
									label="Operator"
									placeholder="Choose Operator"
									onItemSelected={operatorSelectClickHandler}
									options={OPERATORS.map(
										(operator) => operator.label
									)}></Dropdown>
								{fieldType === FIELDTYPES.PICKLIST && (
									<Dropdown
										label="Value"
										placeholder="Choose Picklist Item"
										onItemSelected={valueSelectClickHandler}
										options={filterField.picklistValueLabels}></Dropdown>
								)}
								{fieldType !== FIELDTYPES.PICKLIST && (
									<div className="slds-form-element slds-form-element_stacked">
										<label
											className="slds-form-element__label"
											for="form-element-01">
											Filter Value
										</label>
										<div className="slds-form-element__control">
											<input
												type="text"
												id="form-element-01"
												placeholder="Placeholder text…"
												className="slds-input"
												onChange={(e) => setFilterValue(e.target.value)}
											/>
										</div>
									</div>
								)}
								<div className="slds-form-element slds-form-element_stacked">
									<button
										onClick={addFilterClickHandler}
										class="slds-button slds-button_brand">
										Add Filter
									</button>
								</div>
							</form>
						</div>
					</section>
				</div>
			)}
		</div>
	);
}
