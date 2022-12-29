import React, { useEffect, useState } from "react";
import { ajaxCallGET } from "../../utils/canvasUtil";
import ObjectListItem from "./objectListItem";

export default function ObjectAddCmp({ placeholder, activeObject, sr, onItemChosen, searchurl }) {
	let getObjectsTimeoutFn;
	const [selectedObject, setSelectedObject] = useState({ Label: placeholder });
	const [searchResults, setSearchResults] = useState([]);
	const [inSearchMode, setInSearchMode] = useState(false);

	useEffect(() => {
		if (activeObject) {
			setSelectedObject(activeObject);
		}
	}, [activeObject]);

	const searchChangeHandler = (event) => {
		clearTimeout(getObjectsTimeoutFn);
		getObjectsTimeoutFn = setTimeout(() => {
			const searchTerm = event.target.value;
			if (searchTerm !== null && searchTerm.length >= 3) {
				fetchObjects(searchTerm);
			}
		}, 300);
	};

	const fetchObjects = async (searchTerm) => {
		let query = `${sr.client.instanceUrl}${searchurl}${searchTerm}`;
		let res = await ajaxCallGET(sr, query);
		setSearchResults(res);
	};

	const itemSelectedHandler = (object) => {
		setInSearchMode(false);
		onItemChosen(object);
	};

	return (
		<>
			{inSearchMode && (
				<div className="slds-form-element">
					<div className="slds-form-element__control">
						<div className="slds-combobox_container">
							<div
								className={`slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ${
									searchResults.length > 0 ? "slds-is-open" : ""
								}`}>
								<div
									className="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right"
									role="none">
									<input
										type="text"
										className="slds-input slds-combobox__input"
										id="combobox-id-1"
										aria-autocomplete="list"
										aria-controls="listbox-id-1"
										aria-expanded={searchResults.length > 0}
										aria-haspopup="listbox"
										autoComplete="off"
										role="combobox"
										autoFocus="true"
										onChange={searchChangeHandler}
										placeholder="Search..."
									/>
									<button
										onClick={() => setInSearchMode(false)}
										class="slds-button slds-button_icon slds-input__icon slds-input__icon_right"
										title="Clear">
										<svg
											class="slds-button__icon slds-icon-text-light"
											aria-hidden="true">
											<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#clear"></use>
										</svg>
										<span class="slds-assistive-text">Clear</span>
									</button>
								</div>
								<div
									id="listbox-id-1"
									className="slds-dropdown slds-dropdown_length-with-icon-7 slds-dropdown_fluid"
									role="listbox">
									<ul
										className="slds-listbox slds-listbox_vertical"
										role="presentation">
										{searchResults.map((result) => (
											<ObjectListItem
												onItemSelected={itemSelectedHandler}
												item={result}></ObjectListItem>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{!inSearchMode && (
				<div>
					<button
						onClick={() => setInSearchMode(true)}
						className="slds-button slds-button_neutral">
						{selectedObject.Label}
					</button>
				</div>
			)}
		</>
	);
}
