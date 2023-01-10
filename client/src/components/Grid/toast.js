import React from "react";
import "./toast.css";

export default function Toast({ message, onCloseToast }) {
	return (
		<div className="slds-notify_container slds-is-relative errorContainer">
			<div className="slds-notify slds-notify_toast slds-theme_error" role="status">
				<span className="slds-assistive-text">error</span>
				<span
					className="slds-icon_container slds-icon-utility-error slds-m-right_small slds-no-flex slds-align-top"
					title="Description of icon when needed">
					<svg className="slds-icon slds-icon_small" aria-hidden="true">
						<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#error"></use>
					</svg>
				</span>
				<div className="slds-notify__content">
					<h2 className="slds-text-heading_small ">{message}</h2>
				</div>
				<div className="slds-notify__close">
					<button
						onClick={onCloseToast}
						className="slds-button slds-button_icon slds-button_icon-inverse"
						title="Close">
						<svg
							className="slds-button__icon slds-button__icon_large"
							aria-hidden="true">
							<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
						</svg>
						<span className="slds-assistive-text">Close</span>
					</button>
				</div>
			</div>
		</div>
	);
}
