import React from "react";
import AddHighlightCmp from "./addHighlightCmp";

export default function FieldHighlightCmp({
	activeFields,
	highlights,
	onCancel,
	onHighlightChange,
}) {
	const highlightSetHandler = (highlight) => {
		onHighlightChange([...highlights, highlight]);
	};

	const removeHighlightClickHandler = (index) => {
		let remainingHighlights = highlights.filter(
			(_, highlightIndex) => highlightIndex !== index
		);
		onHighlightChange(remainingHighlights);
	};
	return (
		<div
			className="filterContainer slds-panel slds-size_medium slds-panel_docked slds-panel_docked-right slds-panel_drawer slds-is-open"
			aria-hidden="false"
			id="example-unique-id-11">
			<div className="slds-panel__header">
				<h2
					className="slds-panel__header-title slds-text-heading_small slds-truncate"
					title="Highlight">
					Highlights
				</h2>
				<div className="slds-panel__header-actions">
					<button
						onClick={() => onCancel()}
						className="slds-button slds-button_icon slds-button_icon-small slds-panel__close"
						title="Collapse Highlights">
						<svg className="slds-button__icon" aria-hidden="true">
							<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
						</svg>
						<span className="slds-assistive-text">Collapse Highlights</span>
					</button>
				</div>
			</div>
			<div className="slds-panel__body">
				<div className="slds-filters">
					<h3 className="slds-text-body_small slds-m-vertical_x-small">
						Showing all these Highlights
					</h3>
					<ol className="slds-list_vertical slds-list_vertical-space">
						{highlights.map((highlight, index) => (
							<li className="slds-item slds-hint-parent">
								<div
									className={`slds-filters__item slds-grid slds-grid_vertical-align-center ${highlight.color}`}>
									<button className="slds-button_reset slds-grow slds-has-blur-focus">
										<span className="slds-show slds-text-body_small">
											{highlight.fieldName}
										</span>
										<span className="slds-show">
											{highlight.operatorLabel} {highlight.value}
										</span>
									</button>
									<button
										onClick={() => removeHighlightClickHandler(index)}
										className="slds-button slds-button_icon slds-button_icon slds-button_icon-small"
										title="Remove equals THIS WEEK">
										<svg
											className="slds-button__icon slds-button__icon_hint"
											aria-hidden="true">
											<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#delete"></use>
										</svg>
										<span className="slds-assistive-text">
											Remove Highlight: {highlight.fieldName}{" "}
											{highlight.operatorLabel} {highlight.value}
										</span>
									</button>
								</div>
							</li>
						))}
					</ol>
					<AddHighlightCmp
						fields={activeFields}
						onHighlightSet={highlightSetHandler}></AddHighlightCmp>
				</div>
			</div>
		</div>
	);
}
