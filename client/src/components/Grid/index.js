import React, { useEffect, useState } from "react";
import { graphQLPOST, getRefreshSignedRequest, decode } from "../../utils/canvasUtil";
import "@salesforce/canvas-js-sdk";
import Tools from "../Tools";
import GridTable from "./gridTable";
import "./grid.css";

/*
	grid object in storage
	object
		Label
		QualifiedApiName
	graph
*/
const PREFIX = "opengrid_";

export default function Grid() {
	const [sr, setSr] = useState();
	const [loadedFields, setLoadedFields] = useState([]);
	// const [openGridJSONObject, setOpenGridJSONObject] = useState();
	const [activeFields, setActiveFields] = useState([]);
	const [activeObject, setActiveObject] = useState();
	const [gridData, setGridData] = useState();

	useEffect(() => {
		populateSignedRequest();
	}, []);

	useEffect(() => {
		if (sr) {
			getGridObjFromStorage();
		}
	}, [sr]);

	useEffect(() => {
		if (activeFields.length > 0) {
			fetchGridData(activeObject, activeFields);
			saveGridObjToStorage(activeObject, activeFields);
		}
	}, [activeFields]);

	const fieldSavedHandler = async (gridFields) => {
		setActiveFields(gridFields);
	};

	const fetchGridData = async (object, fields) => {
		let graphStr = graphStringFromObjects(object, fields);
		let gridData = await graphqlQuery(sr, graphStr, object.QualifiedApiName);
		setGridData(gridData);
	};

	const getGridObjFromStorage = () => {
		let page = sr.context.environment.locationUrl;
		let storageLocation = PREFIX + page;

		let gridObject = localStorage.getItem(storageLocation);
		if (gridObject) {
			let gridObjectJSON = JSON.parse(gridObject);
			let { object, fields } = gridObjectJSON;
			setActiveObject(object);
			setLoadedFields(fields);
			setActiveFields(fields);
		}
	};

	const saveGridObjToStorage = (obj, fields) => {
		let page = sr.context.environment.locationUrl;
		let storageLocation = PREFIX + page;
		let openGridJSONObj = {
			object: obj,
			fields: fields,
		};
		let openGridStorageStr = JSON.stringify(openGridJSONObj);
		localStorage.setItem(storageLocation, openGridStorageStr);
	};

	const graphStringFromObjects = (object, fields) => {
		let fieldQueryStr = "";
		fields.forEach((field) => {
			if (field.type === "id") {
				fieldQueryStr += `Id `;
			} else {
				fieldQueryStr += `${field.name} { value } `;
			}
		});
		let graph = `query openGrid {
			uiapi {
			  query {
				${object.QualifiedApiName} {
				  edges {
					node {
					  ${fieldQueryStr}
					}
				  }
				}
			  }
			}
		  }`;
		return graph;
	};

	const graphqlQuery = async (sr, graph, apiName) => {
		let res = await graphQLPOST(sr, graph);
		return res.data.uiapi.query[apiName];
	};

	const objectSavedHandler = (object) => {
		setActiveObject(object);
	};

	const populateSignedRequest = () => {
		getRefreshSignedRequest().then((data) => {
			let payload = data.payload.response;
			// TODO  Add in the validation.  Get the consumer key from env and decode the payload[0] to verify authenticity
			let part = payload.split(".")[1];
			let signedRequest = decode(part);
			let signedRequestJSON = JSON.parse(signedRequest);
			setSr(signedRequestJSON);
			console.log(signedRequestJSON);
		});
	};

	return (
		<article class="slds-card">
			<div class="slds-card__header slds-grid">
				<header class="slds-media slds-media_center slds-has-flexi-truncate">
					<div class="slds-media__figure">
						<span
							class="slds-icon_container slds-icon-standard-account"
							title="account">
							<svg class="slds-icon slds-icon_small" aria-hidden="true">
								<use xlinkHref="/assets/icons/standard-sprite/svg/symbols.svg#channel_programs"></use>
							</svg>
							<span class="slds-assistive-text">Open Grid</span>
						</span>
					</div>
					<div class="slds-media__body">
						<h2 class="slds-card__header-title">
							<a
								href="#"
								class="slds-card__header-link slds-truncate"
								title="Accounts">
								<span>Open Grid</span>
							</a>
						</h2>
					</div>
				</header>
			</div>
			<div class="slds-card__body slds-card__body_inner">
				{sr && (
					<Tools
						onFieldsSaved={fieldSavedHandler}
						onObjectSaved={objectSavedHandler}
						activeObject={activeObject}
						loadedFields={loadedFields}
						sr={sr}
					/>
				)}
				<div className="gridContainer">
					<GridTable fields={activeFields} data={gridData}></GridTable>
				</div>
			</div>
		</article>
	);
}
