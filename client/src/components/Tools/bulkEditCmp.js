import React, { useEffect, useState } from "react";
import Dropdown from "./dropdown";
import { FIELDTYPES } from "../../utils/constants";

export default function BulkEditCmp({ onBulkEditSaved, selectedRows, onCancel, fields }) {
	const [fieldType, setFieldType] = useState(FIELDTYPES.STRING);
	const [field, setField] = useState();
	const [newValue, setNewValue] = useState();

	const bulkEditSaveHandler = () => {
		let bulkEditSaveObj = {
			field: field,
			newValue: newValue,
			records: selectedRows,
		};
		onBulkEditSaved(bulkEditSaveObj);
	};

	const fieldSelectHandler = (fieldLabel) => {
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
		setField(fieldObject);
		setFieldType(FIELDTYPES[fieldObject.type.toUpperCase()]);
	};

	return (
		<>
			<section
				role="dialog"
				tabindex="-1"
				aria-modal="true"
				aria-labelledby="bulk edit modal"
				className="slds-modal slds-fade-in-open slds-modal_large">
				<div className="slds-modal__container">
					<button
						onClick={onCancel}
						className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
						<svg
							className="slds-button__icon slds-button__icon_large"
							aria-hidden="true">
							<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
						</svg>
						<span className="slds-assistive-text">Cancel and close</span>
					</button>
					<div className="slds-modal__header">
						<h1 id="modal-heading-01" className="slds-modal__title slds-hyphenate">
							Bulk Edit
						</h1>
					</div>
					<div
						className="slds-modal__content slds-p-around_medium"
						id="modal-content-id-1">
						<Dropdown
							label="Field"
							id="bulkFormField"
							onItemSelected={fieldSelectHandler}
							options={fields.map((field) =>
								field.referencedFromName
									? `${field.referencedFromName}: ${field.label}`
									: field.label
							)}
							placeholder="Choose a Field to Edit"></Dropdown>
						{fieldType.value === FIELDTYPES.PICKLIST.value && (
							<Dropdown
								label="Value"
								placeholder="Choose Picklist Item"
								onItemSelected={(value) => setNewValue(value)}
								options={field.picklistValueLabels}></Dropdown>
						)}
						{fieldType.value !== FIELDTYPES.PICKLIST.value && (
							<div className="slds-form-element slds-form-element_stacked">
								<label className="slds-form-element__label" for="form-element-01">
									New Value
								</label>
								<div className="slds-form-element__control">
									<input
										type={fieldType.inputType}
										id="form-element-01"
										placeholder="Placeholder text…"
										className="slds-input"
										onChange={(e) => setNewValue(e.target.value)}
									/>
								</div>
							</div>
						)}
						<table
							aria-multiselectable="true"
							className="slds-table slds-table_bordered slds-table_fixed-layout slds-table_resizable-colsslds-table slds-table_cell-buffer slds-no-row-hover slds-table_bordered"
							role="grid"
							aria-label="Example advanced table of Opportunities in actionable mode with ascending column sorting">
							<tbody>
								{selectedRows.map((record) => (
									<tr aria-selected="false" className="slds-hint-parent">
										{Object.keys(record).map((key, index) => (
											<>
												{index <= 3 && key !== "Id" && (
													<td className="slds-truncate" role="gridcell">
														{record[key]}
													</td>
												)}
											</>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="slds-modal__footer">
						<button
							className="slds-button slds-button_neutral"
							onClick={onCancel}
							aria-label="Cancel and close">
							Cancel
						</button>
						<button
							onClick={bulkEditSaveHandler}
							className="slds-button slds-button_brand">
							Save
						</button>
					</div>
				</div>
			</section>
			<div className="slds-backdrop slds-backdrop_open" role="presentation"></div>
		</>
	);
}
