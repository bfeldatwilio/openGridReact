import React, { useEffect, useState } from "react";

export default function FieldRelationTreeItem({
	allRelatedSelected,
	fieldName,
	relatedField,
	onFieldSelected,
}) {
	const [checked, setChecked] = useState();
	useEffect(() => {
		let imAlreadySelected = allRelatedSelected.some((selectedField) => {
			return (
				selectedField.referencedFromName === fieldName &&
				selectedField.name === relatedField.name
			);
		});
		setChecked(imAlreadySelected);
	}, []);

	const itemSelectedChangeHandler = (event) => {
		let checked = event.target.checked;
		setChecked(checked);
		onFieldSelected({ adding: checked, relatedField: relatedField });
	};

	return (
		<div className="slds-checkbox">
			<input
				type="checkbox"
				name="options"
				id={`${relatedField.label}_chk`}
				value={relatedField.name}
				onChange={itemSelectedChangeHandler}
				checked={checked}
			/>
			<label className="slds-checkbox__label" htmlFor={`${relatedField.label}_chk`}>
				<span className="slds-checkbox_faux"></span>
				<span className="slds-form-element__label">{relatedField.label}</span>
			</label>
		</div>
	);
}
