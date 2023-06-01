import React, { useState } from "react";
import Dropdown from "./dropdown";
import { FIELDTYPES } from "../../utils/constants";
import "./addHighlightCmp.css";

const COLORS = ["red", "orange", "yellow", "green", "blue", "violet"];
const OPERATORS = [
	{ label: "Equal to", value: "===" },
	{ label: "Not Equal to", value: "!==" },
	{ label: "Greater Than or Equal", value: ">=" },
	{ label: "Less Than or Equal", value: "<=" },
];

export default function AddHighlightCmp({ fields, onHighlightSet }) {
	const [highlightField, setHighlightField] = useState();
	const [highlightOperator, setHighlightOperator] = useState(OPERATORS[0]);
	const [highlightValue, setHighlightValue] = useState();
	const [fieldType, setFieldType] = useState(FIELDTYPES.STRING);
	const [showPopover, setShowPopover] = useState(false);
	const [highlightColor, setHighlightColor] = useState();

	const addHighlightClickHandler = (e) => {
		e.preventDefault();
		let highlight = {
			fieldLabel: highlightField.label,
			fieldName: highlightField.name,
			fieldType: highlightField.type,
			operatorLabel: highlightOperator.label,
			operatorValue: highlightOperator.value,
			value: highlightValue,
			color: highlightColor,
			referencedFromName: highlightField.referencedFromName,
		};
		onHighlightSet(highlight);
		setShowPopover(false);
	};

	const fieldSelectClickHandler = (fieldLabel) => {
		let referenceFromName;
		let fieldObject;
		if (fieldLabel.includes(": ")) {
			let fieldNameArr = fieldLabel.split(": ");
			referenceFromName = fieldNameArr[0];
			fieldLabel = fieldNameArr[1];
			fieldObject = fields.find((fieldObj) => {
				return (
					fieldObj.label === fieldLabel &&
					referenceFromName === fieldObj.referencedFromName
				);
			});
		} else {
			fieldObject = fields.find((fieldObj) => fieldObj.label === fieldLabel);
		}
		console.log(fieldObject);
		setHighlightField(fieldObject);
		setFieldType(FIELDTYPES[fieldObject.type.toUpperCase()]);
	};

	const operatorSelectClickHandler = (operatorLabel) => {
		let operatorObject = OPERATORS.find((operatorobj) => operatorobj.label === operatorLabel);
		setHighlightOperator(operatorObject);
	};

	const valueSelectClickHandler = (valueLabel) => {
		setHighlightValue(valueLabel);
	};
	return (
		<div className="slds-filters__footer slds-grid slds-shrink-none add-btn-footer">
			<button
				onClick={() => setShowPopover(true)}
				className="slds-button_reset slds-text-link">
				Add Highlight
			</button>
			{showPopover && (
				<div className="filterPopoverContainer">
					<section
						aria-label="Edit Filter"
						aria-describedby="popover-body-id"
						className="slds-popover slds-nubbin_right"
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
									options={fields.map((field) =>
										field.referencedFromName
											? `${field.referencedFromName}: ${field.label}`
											: field.label
									)}></Dropdown>
								<Dropdown
									label="Operator"
									placeholder="Choose Operator"
									onItemSelected={operatorSelectClickHandler}
									options={OPERATORS.map(
										(operator) => operator.label
									)}></Dropdown>
								{fieldType.value === FIELDTYPES.PICKLIST.value && (
									<Dropdown
										label="Value"
										placeholder="Choose Picklist Item"
										onItemSelected={valueSelectClickHandler}
										options={highlightField.picklistValueLabels}></Dropdown>
								)}
								{fieldType.value !== FIELDTYPES.PICKLIST.value && (
									<div className="slds-form-element slds-form-element_stacked">
										<label
											className="slds-form-element__label"
											for="form-element-01">
											Filter Value
										</label>
										<div className="slds-form-element__control">
											<input
												type={fieldType.inputType}
												id="form-element-01"
												placeholder="Placeholder text…"
												className="slds-input"
												onChange={(e) => setHighlightValue(e.target.value)}
											/>
										</div>
									</div>
								)}
								<div className="slds-form-element slds-form-element_stacked">
									<label
										className="slds-form-element__label"
										for="form-element-01">
										Highlight Color
									</label>
									<div className="colorPicker">
										{COLORS.map((color) => (
											<div
												onClick={() => setHighlightColor(color)}
												className={`${color} ${
													highlightColor === color ? "selected" : ""
												}`}></div>
										))}
									</div>
								</div>
								<div className="slds-form-element slds-form-element_stacked">
									<button
										disabled={
											!(
												highlightField &&
												highlightOperator &&
												highlightValue &&
												highlightColor
											)
										}
										onClick={addHighlightClickHandler}
										className="slds-button slds-button_brand">
										Add Highlight
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
