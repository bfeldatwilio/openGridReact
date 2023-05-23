import React, { useEffect, useState } from "react";
import Dropdown from "../Tools/dropdown";
import "./gridCell.css";

export default function GridCell({
	cellKey,
	record,
	highlights,
	field,
	disableInlineEdit,
	onRecordUpdated,
}) {
	const [cellClass, setCellClass] = useState();
	const [editEnabled, setEditEnabled] = useState(false);
	const [updatedValue, setUpdatedValue] = useState();

	const numberTypes = ["currency", "percent", "double", "int"];

	useEffect(() => {
		let myHighlights = highlights.filter((highlight) => {
			let referenceProp = field.referencedFromName
				? `${field.referencedFromName}.${highlight.fieldName}`
				: highlight.fieldName;
			return referenceProp === cellKey;
		});
		if (myHighlights.length > 0) {
			let highlightsToApply = myHighlights.filter((myHighlight) =>
				calculateHighlight(myHighlight)
			);
			if (highlightsToApply.length > 0) {
				setCellClass(highlightsToApply[0].color);
			} else {
				setCellClass("");
			}
		} else {
			setCellClass("");
		}
	}, [highlights, record]);

	const calculateHighlight = (highlight) => {
		let operatorStr = "";
		if (numberTypes.includes(highlight.fieldType)) {
			operatorStr = `${record[cellKey]} ${highlight.operatorValue} ${highlight.value}`;
		} else if (highlight.fieldType === "date") {
			let cellDate = Date.parse(record[cellKey]);
			let highlightDate = Date.parse(highlight.value);
			operatorStr = `${cellDate} ${highlight.operatorValue} ${highlightDate}`;
		} else {
			operatorStr = `"${record[cellKey]}" ${highlight.operatorValue} "${highlight.value}"`;
		}
		return eval(operatorStr);
	};

	const saveClickHandler = () => {
		let recordUpdateObj = {
			Id: record.Id,
			patchObj: {},
		};
		recordUpdateObj.patchObj[cellKey] = updatedValue;
		onRecordUpdated(recordUpdateObj);
		setEditEnabled(false);
	};

	return (
		<td className={`slds-cell-edit ${cellClass}`} role="gridcell">
			<span className="slds-grid slds-grid_align-spread">
				<span className="slds-truncate" title="30%">
					{record[cellKey]}
				</span>
				<button
					className="slds-button slds-button_icon slds-cell-edit__button slds-m-left_x-small"
					tabindex="-1"
					disabled={disableInlineEdit}
					onClick={() => setEditEnabled(true)}
					title={`Edit ${record[cellKey]}`}>
					<svg
						className="slds-button__icon slds-button__icon_hint slds-button__icon_edit slds-button__icon_small"
						aria-hidden="true">
						<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
					</svg>
					<span className="slds-assistive-text">Edit {record[cellKey]}</span>
				</button>
			</span>
			{editEnabled && (
				<div className="inline-edit-container">
					<section
						aria-describedby="dialog-body-id-14"
						className="slds-popover slds-popover_edit"
						role="dialog">
						<div className="slds-popover__body" id="dialog-body-id-14">
							<div className="slds-media">
								<div className="slds-media__body">
									<div className="slds-form-element slds-grid slds-wrap">
										<label
											className="slds-form-element__label slds-form-element__label_edit slds-no-flex"
											for={`inline-${record[cellKey]}`}>
											<span className="slds-assistive-text">{`inline-${record[cellKey]}`}</span>
										</label>
										<div className="slds-form-element__control slds-grow">
											{field.type === "picklist" && (
												<Dropdown
													placeholder="Choose Picklist Item"
													onItemSelected={(value) =>
														setUpdatedValue(value)
													}
													options={field.picklistValueLabels}></Dropdown>
											)}
											{field.type !== "picklist" && (
												<input
													onChange={(e) =>
														setUpdatedValue(e.target.value)
													}
													type={field.type}
													className="slds-input"
													id={`inline-${record[cellKey]}`}
													placeholder={record[cellKey]}
												/>
											)}
											<div className="inline-control-container">
												<button
													onClick={saveClickHandler}
													disabled={!updatedValue}
													className="slds-button slds-button_icon slds-button_icon-brand"
													title="Save">
													<svg
														className="slds-button__icon"
														aria-hidden="true">
														<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#check"></use>
													</svg>
													<span className="slds-assistive-text">
														Save
													</span>
												</button>
												<button
													onClick={() => setEditEnabled(false)}
													className="slds-button slds-button_icon slds-button_icon-border-filled"
													title="Cancel">
													<svg
														className="slds-button__icon"
														aria-hidden="true">
														<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
													</svg>
													<span className="slds-assistive-text">
														Close
													</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			)}
		</td>
	);
}
