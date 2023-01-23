import React from "react";

export default function GridColumn({ field, onOrderChanged }) {
	const onOrderClicked = (e) => {
		e.preventDefault();
		field.sortOrder = field.sortOrder === "ASC" ? "DESC" : "ASC";
		onOrderChanged(field);
	};

	return (
		<th
			aria-label="Name"
			aria-sort="ascending"
			className="slds-is-resizable slds-is-sortable slds-is-sorted slds-is-sorted_asc slds-cell_action-mode"
			scope="col">
			<a
				className="slds-th__action slds-text-link_reset"
				href="#"
				onClick={onOrderClicked}
				role="button"
				tabIndex="0">
				<span className="slds-assistive-text">Sort by: </span>
				<div className="slds-grid slds-grid_vertical-align-center slds-has-flexi-truncate">
					<span className="slds-truncate" title="Name">
						{field.referencedFromName
							? `${field.referencedFromName}: ${field.label}`
							: field.label}
					</span>
					{field.activeSort && (
						<span className="slds-icon_container slds-icon-utility-arrowdown">
							<svg
								className="slds-icon slds-icon-text-default slds-is-sortable__icon "
								aria-hidden="true">
								<use
									xlinkHref={`/assets/icons/utility-sprite/svg/symbols.svg#${
										field.sortOrder === "ASC" ? "arrowdown" : "arrowup"
									}`}></use>
							</svg>
						</span>
					)}
				</div>
			</a>
			<span className="slds-assistive-text" aria-live="polite" aria-atomic="true">
				Sorted ascending
			</span>
			<div className="slds-resizable">
				<input
					type="range"
					aria-label="Name column width"
					className="slds-resizable__input slds-assistive-text"
					id="cell-resize-handle-533"
					max="1000"
					min="20"
					tabIndex="0"
				/>
				<span className="slds-resizable__handle">
					<span className="slds-resizable__divider"></span>
				</span>
			</div>
		</th>
	);
}
