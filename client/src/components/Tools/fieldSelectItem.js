import React, { useEffect, useState } from "react";
import FieldRelationTree from "./fieldRelationTree";

export default function FieldSelectItem({ selected, field, onChange, sr }) {
	const [checked, setChecked] = useState(false);
	const [relationship, setRelationship] = useState();

	useEffect(() => {
		let imAlreadySelected =
			selected.filter((selectedField) => selectedField.name === field.name).length > 0;
		setChecked(imAlreadySelected);
		if (field.type === "reference") {
			setRelationship(field.relationshipName);
		}
	}, []);

	const fieldChangeHandler = (event) => {
		let isChecked = event.target.checked;
		console.log(field);
		setChecked(isChecked);
		let changeObj = {
			field: field,
			added: isChecked,
		};
		onChange(changeObj);
	};

	const relatedFieldSelectHandler = ({ adding, relatedField }) => {
		relatedField.referencedFromName = field.relationshipName;
		relatedField.referencedFromLabel = field.label;
		let changeObj = {
			field: relatedField,
			added: adding,
		};
		onChange(changeObj);
	};
	return (
		<div className="slds-form-element">
			<div className="slds-form-element__control">
				{relationship ? (
					<FieldRelationTree
						sr={sr}
						relationship={relationship}
						onFieldSelected={relatedFieldSelectHandler}
						field={field}></FieldRelationTree>
				) : (
					<div className="slds-checkbox">
						<input
							type="checkbox"
							name="options"
							id={`${field.label}_chk`}
							value={field.name}
							onChange={fieldChangeHandler}
							checked={checked}
						/>
						<label className="slds-checkbox__label" htmlFor={`${field.label}_chk`}>
							<span className="slds-checkbox_faux"></span>
							<span className="slds-form-element__label">{field.label}</span>
						</label>
					</div>
				)}
			</div>
		</div>
	);
}
