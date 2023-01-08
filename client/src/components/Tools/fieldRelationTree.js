import React, { useEffect, useState } from "react";
import { ajaxCallGET } from "../../utils/canvasUtil";
import "./fieldRelationshipTree.css";
import FieldRelationTreeItem from "./fieldRelationTreeItem";

export default function FieldRelationTree({
	relationship,
	relationshipName,
	selected,
	fieldName,
	onFieldSelected,
	sr,
}) {
	const [relatedFields, setRelatedFields] = useState();
	const [popoverVisible, setPopoverVisible] = useState(false);

	const buttonClickHandler = () => {
		setPopoverVisible(!popoverVisible);
		if (!relatedFields) {
			fetchObject();
		}
	};

	// TODO Got the name to match but it's matching for all related objects
	const fetchObject = async () => {
		let query = `${sr.client.instanceUrl}${sr.context.links.sobjectUrl}${relationship}/describe`;
		let res = await ajaxCallGET(sr, query);
		setRelatedFields(res.fields);
	};
	return (
		<div className="fieldRelationshipTreeContainer">
			<button onClick={buttonClickHandler} className="slds-button">
				{relationshipName} ({relationship})
			</button>
			{popoverVisible && (
				<section
					aria-label="Dialog title"
					aria-describedby="popover-body-id"
					className="slds-popover slds-nubbin_left popoverContainer"
					role="dialog">
					<button
						onClick={() => setPopoverVisible(false)}
						className="slds-button slds-button_icon slds-button_icon slds-button_icon-small slds-float_right slds-popover__close"
						title="Close dialog">
						<svg className="slds-button__icon" aria-hidden="true">
							<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
						</svg>
						<span className="slds-assistive-text">Close dialog</span>
					</button>
					<div
						id="popover-body-id"
						className="slds-popover__body relatedFieldPopoverBody">
						{relatedFields &&
							relatedFields.map((relatedField) => (
								<FieldRelationTreeItem
									fieldName={fieldName}
									allRelatedSelected={selected}
									onFieldSelected={onFieldSelected}
									relatedField={relatedField}></FieldRelationTreeItem>
							))}
					</div>
				</section>
			)}
		</div>
	);
}
