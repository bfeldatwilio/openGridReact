import React from "react";

export default function ObjectListItem(props) {
	const handleObjectSelected = () => {
		props.onItemSelected(props.item);
	};
	return (
		<li role="presentation" className="slds-listbox__item">
			<div
				onClick={handleObjectSelected}
				className="slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta"
				role="option">
				<span className="slds-media__body">
					<span className="slds-listbox__option-text slds-listbox__option-text_entity">
						{props.item.Label}
					</span>
				</span>
			</div>
		</li>
	);
}
