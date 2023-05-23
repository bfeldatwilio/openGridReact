import React, { useEffect, useState } from "react";
import GridCell from "./gridCell";

export default function GridRow({
	record,
	fields,
	highlights,
	disableUpdating,
	onRecordUpdated,
	onRowSelectChange,
	selectedRows,
}) {
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		let IAmSelected = selectedRows.find((row) => row.Id === record.Id);
		setChecked(IAmSelected);
	}, [selectedRows]);

	useEffect(() => {
		setChecked(false);
	}, [record]);

	const rowSelectChangeHandler = (e) => {
		let isChecked = e.target.checked;
		let rowChangeObject = {
			added: isChecked,
			record: record,
		};
		onRowSelectChange(rowChangeObject);
	};

	return (
		<tr aria-selected="false" className="slds-hint-parent">
			<td className="slds-text-align_right slds-cell_action-mode" role="gridcell">
				<div className="slds-checkbox">
					<input
						type="checkbox"
						disabled={disableUpdating}
						name="rowSelections"
						id={`${record.Id}_chk`}
						onChange={rowSelectChangeHandler}
						checked={checked}
					/>
					<label
						className="slds-checkbox__label"
						for={`${record.Id}_chk`}
						id={`${record.Id}_chkLbl`}>
						<span className="slds-checkbox_faux"></span>
						<span className="slds-form-element__label slds-assistive-text">
							Select {record.Id}
						</span>
					</label>
				</div>
			</td>
			{Object.keys(record).map((key, index) => (
				<GridCell
					highlights={highlights}
					disableInlineEdit={disableUpdating}
					cellKey={key}
					onRecordUpdated={onRecordUpdated}
					field={fields[index]}
					record={record}></GridCell>
			))}
		</tr>
	);
}
