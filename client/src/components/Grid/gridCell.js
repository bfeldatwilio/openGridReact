import React, { useEffect, useState } from "react";

export default function GridCell({ cellKey, cellValue, highlights }) {
	const [cellClass, setCellClass] = useState();

	useEffect(() => {
		let myHighlights = highlights.filter((highlight) => highlight.fieldName === cellKey);
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
	}, [highlights]);

	const calculateHighlight = (highlight) => {
		let operatorStr = "";
		if (highlight.value.includes(" ")) {
			operatorStr = `"${cellValue}" ${highlight.operatorValue} "${highlight.value}"`;
		} else if (highlight.fieldType === "date") {
			let cellDate = Date.parse(cellValue);
			let highlightDate = Date.parse(highlight.value);
			operatorStr = `${cellDate} ${highlight.operatorValue} ${highlightDate}`;
		} else {
			operatorStr = `${cellValue} ${highlight.operatorValue} ${highlight.value}`;
		}
		return eval(operatorStr);
	};

	return (
		<td className={`slds-cell_action-mode ${cellClass}`} role="gridcell">
			<div className="slds-truncate">{cellValue}</div>
		</td>
	);
}
