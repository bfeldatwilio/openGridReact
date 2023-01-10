import React, { useEffect, useState } from "react";
import FieldSelectItem from "./fieldSelectItem";
import { FIELDTYPES } from "../../utils/constants";

export default function FieldAddCmp({ onSelectionChange, fields, activeFields, sr }) {
	const [filteredFields, setFilteredFields] = useState([]);
	const [relatedSelected, setRelatedSelected] = useState([]);
	useEffect(() => {
		setFilteredFields(fields);
	}, []);

	useEffect(() => {
		findAndSetRelatedSelected(activeFields);
	}, [activeFields]);

	const findAndSetRelatedSelected = (selectedFields) => {
		let selectedRelated = selectedFields.filter((field) =>
			field.hasOwnProperty("referencedFromName")
		);
		setRelatedSelected(selectedRelated);
	};

	const fieldFilterChangeHandler = (event) => {
		const searchTerm = event.target.value;
		let filteredFields = fields.filter((field) =>
			field.label.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredFields(filteredFields);
	};

	const fieldCheckHandler = (fieldInfo) => {
		const { added, field } = fieldInfo;

		if (added) addFieldToSelectedFields(field);
		else if (!added) removeFieldFromSelectedFields(field);
	};

	const addFieldToSelectedFields = (addedField) => {
		if (addedField.type === FIELDTYPES.PICKLIST.value) {
			addedField.picklistValueLabels = addedField.picklistValues.map(
				(picklistItem) => picklistItem.label
			);
		}
		let fields = [...activeFields, addedField];
		onSelectionChange(fields);
	};

	const removeFieldFromSelectedFields = (removedField) => {
		let fields = activeFields.filter((field) => field.label !== removedField.label);
		onSelectionChange(fields);
	};

	return (
		<div>
			<div class="slds-form-element">
				<div class="slds-form-element__control slds-input-has-icon slds-input-has-icon_left">
					<svg
						class="slds-icon slds-input__icon slds-input__icon_left slds-icon-text-default"
						aria-hidden="true">
						<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
					</svg>
					<input
						type="text"
						id="text-input-id-92"
						placeholder="Search Fields"
						class="slds-input"
						onChange={fieldFilterChangeHandler}
					/>
				</div>
			</div>
			<section className="fields">
				{filteredFields.map((field) => (
					<FieldSelectItem
						sr={sr}
						key={field.name}
						selected={activeFields}
						relatedSelected={relatedSelected}
						field={field}
						onChange={fieldCheckHandler}></FieldSelectItem>
				))}
			</section>
		</div>
	);
}
