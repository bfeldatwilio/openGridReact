import React, { useEffect } from "react";

export default function FieldPills({ fields }) {
	return (
		<div className="slds-pill_container">
			{fields.map((field) => (
				<span className="slds-pill slds-pill_link">
					<a
						href="#"
						className="slds-pill__action"
						title="Full pill label verbiage mirrored here">
						<span className="slds-pill__label">{field.name}</span>
					</a>
					<button
						className="slds-button slds-button_icon slds-button_icon slds-pill__remove"
						title="Remove">
						<svg className="slds-button__icon" aria-hidden="true">
							<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
						</svg>
						<span className="slds-assistive-text">Remove</span>
					</button>
				</span>
			))}
		</div>
	);
}
