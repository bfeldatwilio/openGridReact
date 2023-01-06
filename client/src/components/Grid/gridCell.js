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
