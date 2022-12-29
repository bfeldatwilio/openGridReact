import React, { useEffect, useState } from "react";

export default function FieldSelectItem(props) {
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		let imAlreadySelected =
			props.selected.filter((selectedField) => selectedField.name === props.field.name)
				.length > 0;
		setChecked(imAlreadySelected);
	}, []);

	const fieldChangeHandler = (event) => {
		let isChecked = event.target.checked;
		setChecked(isChecked);
		let changeObj = {
			field: props.field,
			added: isChecked,
		};
		props.onChange(changeObj);
	};
	return (
		<div className="slds-form-element">
			<div className="slds-form-element__control">
				<div className="slds-checkbox">
					<input
						type="checkbox"
						name="options"
						id={`${props.field.label}_chk`}
						value={props.field.name}
						onChange={fieldChangeHandler}
						checked={checked}
					/>
					<label className="slds-checkbox__label" htmlFor={`${props.field.label}_chk`}>
						<span className="slds-checkbox_faux"></span>
						<span className="slds-form-element__label">{props.field.label}</span>
					</label>
				</div>
			</div>
		</div>
	);
}
