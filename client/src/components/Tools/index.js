import React, { useEffect, useState } from "react";
import { ajaxCallGET } from "../../utils/canvasUtil";
import ObjectAddCmp from "./objectAddCmp";
import FieldAddCmp from "./fieldAddCmp";
import "./tools.css";
import FieldPills from "./fieldPills";

const OBJECTSEARCHURL = "/services/apexrest/entityDefinitions/";

export default function Tools({ activeObject, loadedFields, sr, onFieldsSaved, onObjectSaved }) {
	const [sourceObj, setSourceObj] = useState();
	const [objectFields, setObjectFields] = useState([]);
	const [selectedFields, setSelectedFields] = useState([]);
	const [fieldModalVisible, setFieldModalVisible] = useState(false);
	const [disableFieldSelect, setDisableFieldSelect] = useState(true);
	const [disableFieldFilter, setDisableFieldFilter] = useState(true);
	const [disableComputed, setDisableComputed] = useState(true);
	const [disableHighlight, setDisableHighlight] = useState(true);

	//input states: unfocused, focused, empty, typing, searching, results

	useEffect(() => {
		if (activeObject) {
			setSourceObj(activeObject);
			fetchObjectDescribe(activeObject);
			setDisableFieldSelect(false);
		}
	}, [activeObject]);

	useEffect(() => {
		if (loadedFields) {
			setSelectedFields(loadedFields);
		}
	}, [loadedFields]);

	useEffect(() => {
		if (selectedFields.length > 0) {
			setDisableComputed(false);
			setDisableHighlight(false);
			setDisableFieldFilter(false);
		}
	}, [selectedFields]);

	const fetchObjectDescribe = async (sourceObj) => {
		let query = `${sr.client.instanceUrl}${sr.context.links.sobjectUrl}${sourceObj.QualifiedApiName}/describe`;
		let res = await ajaxCallGET(sr, query);
		setObjectFields(res.fields);
	};

	const fieldSaveClickHandler = () => {
		setFieldModalVisible(false);
		let gridFields = selectedFields.map((field, index) => {
			return {
				label: field.label,
				type: field.type,
				name: field.name,
				columnOrder: index,
			};
		});
		onFieldsSaved(gridFields);
	};

	const fieldToolClickHandler = () => {
		setFieldModalVisible(true);
	};

	const filterToolClickHandler = () => {
		console.log("filter clicked");
	};

	const computedToolClickHandler = () => {
		console.log("computed clicked");
	};

	const highlightToolClickHandler = () => {
		console.log("highlight clicked");
	};

	const objectSelectedHandler = (object) => {
		onObjectSaved(object);
	};

	const selectedFieldChangeHandler = (fields) => {
		setSelectedFields(fields);
	};

	return (
		<section className="toolsContainer">
			<div>
				<ObjectAddCmp
					placeholder="Set Object"
					activeObject={sourceObj}
					searchurl={OBJECTSEARCHURL}
					sr={sr}
					onItemChosen={objectSelectedHandler}></ObjectAddCmp>
			</div>
			<div>
				<button
					onClick={fieldToolClickHandler}
					disabled={disableFieldSelect}
					className="slds-button slds-button_neutral">
					Fields
				</button>
			</div>
			<div>
				<button
					onClick={filterToolClickHandler}
					disabled={disableFieldFilter}
					className="slds-button slds-button_neutral">
					Filter
				</button>
			</div>
			<div>
				<button
					onClick={computedToolClickHandler}
					disabled={disableComputed}
					className="slds-button slds-button_neutral">
					Computed Field
				</button>
			</div>
			<div>
				<button
					onClick={highlightToolClickHandler}
					disabled={disableHighlight}
					className="slds-button slds-button_neutral">
					Highlight
				</button>
			</div>
			{/* <FieldPills fields={selectedFields}></FieldPills> */}
			{fieldModalVisible && (
				<>
					<section
						role="dialog"
						tabindex="-1"
						aria-modal="true"
						aria-labelledby="modal-heading-01"
						className="slds-modal slds-fade-in-open">
						<div className="slds-modal__container">
							<button
								onClick={() => setFieldModalVisible(false)}
								className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
								<svg
									className="slds-button__icon slds-button__icon_large"
									aria-hidden="true">
									<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
								</svg>
								<span className="slds-assistive-text">Cancel and close</span>
							</button>
							<div className="slds-modal__header">
								<h1
									id="modal-heading-01"
									className="slds-modal__title slds-hyphenate">
									Select Fields
								</h1>
							</div>
							<div
								className="slds-modal__content slds-p-around_medium"
								id="modal-content-id-1">
								<FieldAddCmp
									onSelectionChange={selectedFieldChangeHandler}
									activeFields={selectedFields}
									fields={objectFields}></FieldAddCmp>
							</div>
							<div className="slds-modal__footer">
								<button
									className="slds-button slds-button_neutral"
									onClick={() => setFieldModalVisible(false)}
									aria-label="Cancel and close">
									Cancel
								</button>
								<button
									onClick={fieldSaveClickHandler}
									className="slds-button slds-button_brand">
									Save
								</button>
							</div>
						</div>
					</section>
					<div className="slds-backdrop slds-backdrop_open" role="presentation"></div>
				</>
			)}
		</section>
	);
}
