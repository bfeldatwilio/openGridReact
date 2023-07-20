import React, { useEffect, useState } from "react";
import { graphQLPOST, getRefreshSignedRequest, decode, ajaxCall } from "../../utils/canvasUtil";
import "@salesforce/canvas-js-sdk";
import Tools from "../Tools";
import GridTable from "./gridTable";
import "./grid.css";
import Toast from "./toast";

const PREFIX = "opengrid_";
const GRIDCOUNT = 50;

export default function Grid() {
	const [sr, setSr] = useState();
	const [loading, setLoading] = useState(true);
	const [loadedFields, setLoadedFields] = useState([]);
	const [activeFields, setActiveFields] = useState([]);
	const [activeFilters, setActiveFilters] = useState([]);
	const [activeHighlights, setActiveHighlights] = useState([]);
	const [selectedRows, setSelectedRows] = useState([]);
	const [activeObject, setActiveObject] = useState();
	const [gridData, setGridData] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const [showToast, setShowToast] = useState(false);

	// TODO update highlights on filter as new data is fetched
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
			saveGridObjToStorage(activeObject, activeFields, activeFilters, activeHighlights);
		}
	}, [activeHighlights]);

	useEffect(() => {
		if (activeFields.length > 0) {
			fetchGridData(activeObject, activeFields, activeFilters);
			saveGridObjToStorage(activeObject, activeFields, activeFilters, activeHighlights);
		}
	}, [activeFields, activeFilters]);

	const fetchGridData = async (object, fields, filters) => {
		setLoading(true);
		let graphStr = graphStringFromObjects(object, fields, filters);
		let gridData = await graphqlQuery(sr, graphStr, object.QualifiedApiName);
		let formedData = formData(gridData);
		console.log(formData);
		setGridData(formedData);
		setLoading(false);
	};
	//TODO add empty nodes
	const formData = (data) => {
		let formed = data.edges.map((edge, index) => {
			let node = edge.node;
			let flattenedNode = flattenObj(node);
			return flattenedNode;
		});
		return formed;
	};

	const flattenObj = (ob) => {
		let result = {};
		for (const i in ob) {
			if (ob[i] !== null && typeof ob[i] === "object" && !Array.isArray(ob[i])) {
				const temp = flattenObj(ob[i]);
				for (const j in temp) {
					if (j === "value") {
						result[i] = temp[j];
					} else {
						result[i + "." + j] = temp[j];
					}
				}
			} else {
				result[i] = ob[i];
			}
		}
		return result;
	};

	const getGridObjFromStorage = () => {
		let page = sr.context.environment.locationUrl;
		let storageLocation = PREFIX + page;

		let gridObject = localStorage.getItem(storageLocation);
		if (gridObject) {
			let gridObjectJSON = JSON.parse(gridObject);
			console.log(gridObjectJSON);
			let { object, fields, filters, highlights } = gridObjectJSON;
			setActiveObject(object);
			setLoadedFields(fields);
			setActiveFields(fields);
			setActiveFilters(filters);
			setActiveHighlights(highlights);
		} else {
			setLoading(false);
		}
	};

	const saveGridObjToStorage = (obj, fields, filters, highlights) => {
		let page = sr.context.environment.locationUrl;
		let storageLocation = PREFIX + page;
		let openGridJSONObj = {
			object: obj,
			fields: fields,
			filters: filters,
			highlights: highlights,
		};
		let openGridStorageStr = JSON.stringify(openGridJSONObj);
		localStorage.setItem(storageLocation, openGridStorageStr);
	};

	const graphStringFromObjects = (object, fields, filters) => {
		let fieldQueryStr = "";
		let filterQueryStr = `(first:${GRIDCOUNT}`;
		let sortByField = fields.filter((field) => field.activeSort)[0];
		if (sortByField.referencedFromName) {
			filterQueryStr += `, orderBy: { ${sortByField.referencedFromName}: {${sortByField.name}: {order: ${sortByField.sortOrder}}}}`;
		} else {
			filterQueryStr += `, orderBy: { ${sortByField.name}: {order: ${sortByField.sortOrder}}}`;
		}
		if (filters.length > 0) {
			filterQueryStr += `, where: { and: [ `;
			filters.forEach((filter) => {
				if (filter.referencedFromName) {
					filterQueryStr += `{${filter.referencedFromName}: `;
				}
				const valueStr =
					filter.fieldType === "date"
						? `{value: "${filter.value}"}`
						: `"${filter.value}"`;
				filterQueryStr += `{ ${filter.fieldName}: {${filter.operatorValue}: ${valueStr} }}, `;
				if (filter.referencedFromName) {
					filterQueryStr += `}, `;
				}
			});
			filterQueryStr += `] })`;
		} else {
			filterQueryStr = filterQueryStr += ")";
		}
		fields.forEach((field) => {
			if (field.referencedFromName) {
				if (field.type === "id") {
					fieldQueryStr += `${field.referencedFromName} { Id } `;
				} else {
					fieldQueryStr += `${field.referencedFromName} { ${field.name} { value } } `;
				}
			} else {
				if (field.type === "id") {
					fieldQueryStr += `Id `;
				} else {
					fieldQueryStr += `${field.name} { value } `;
				}
			}
		});
		let graph = `{
			uiapi {
			  query {
				${object.QualifiedApiName}${filterQueryStr} {
				  edges {
					node {
					  ${fieldQueryStr}
					}
				  }
				}
			  }
			}	
		  }`;
		console.log(graph);
		return graph;
	};

	const graphqlQuery = async (sr, graph, apiName) => {
		let res = await graphQLPOST(sr, graph);
		return res.data.uiapi.query[apiName];
	};

	const columnFieldChangeHandler = (fields) => {
		setActiveFields(fields);
	};

	const recordUpdatedHandler = (recordUpdateObj) => {
		setLoading(true);
		const url = `${sr.client.instanceUrl}${sr.context.links.sobjectUrl}${activeObject.QualifiedApiName}/${recordUpdateObj.Id}`;
		ajaxCall(sr, "PATCH", url, recordUpdateObj.patchObj)
			.then((res) => {
				fetchGridData(activeObject, activeFields, activeFilters);
			})
			.catch((e) => {
				setLoading(false);
				handleError(e);
			});
	};

	const bulkEditSaveHandler = async (updateObj) => {
		setLoading(true);
		const query = `${sr.client.instanceUrl}${sr.context.links.restUrl}composite/sobjects`;
		ajaxCall(sr, "PATCH", query, updateObj)
			.then((res) => {
				fetchGridData(activeObject, activeFields, activeFilters);
			})
			.catch((e) => {
				setLoading(false);
				handleError(e);
			});
	};

	const fieldsSetHandler = (fields) => {
		console.log(fields);
		setActiveFields(fields);
	};

	const handleError = (error) => {
		let message = error[0].message;
		console.log(message);
		setErrorMessage(message);
		setLoading(false);
		setShowToast(true);
	};

	const populateSignedRequest = () => {
		getRefreshSignedRequest().then((data) => {
			let payload = data.payload.response;
			// TODO  Add in the validation.  Get the consumer key from env and decode the payload[0] to verify authenticity
			let part = payload.split(".")[1];
			let signedRequest = decode(part);
			let signedRequestJSON = JSON.parse(signedRequest);
			setSr(signedRequestJSON);
		});
	};

	return (
		<article className="slds-card">
			{showToast && (
				<Toast onCloseToast={() => setShowToast(false)} message={errorMessage}></Toast>
			)}
			<div className="slds-card__header slds-grid">
				<header className="slds-media slds-media_center slds-has-flexi-truncate">
					<div className="slds-media__figure">
						<span
							className="slds-icon_container slds-icon-standard-account"
							title="account">
							<svg className="slds-icon slds-icon_small" aria-hidden="true">
								<use xlinkHref="/assets/icons/standard-sprite/svg/symbols.svg#channel_programs"></use>
							</svg>
							<span className="slds-assistive-text">Open Grid</span>
						</span>
					</div>
					<div className="slds-media__body">
						<h2 className="slds-card__header-title">
							<a
								href="#"
								className="slds-card__header-link slds-truncate"
								title="Accounts">
								<span>Open Grid</span>
							</a>
						</h2>
					</div>
				</header>
			</div>
			<div className="slds-card__body slds-card__body_inner">
				{loading && (
					<div className="loadingContainer">
						<div className="slds-spinner_container">
							<div
								role="status"
								className="slds-spinner slds-spinner_medium slds-spinner_brand">
								<span className="slds-assistive-text">Loading</span>
								<div className="slds-spinner__dot-a"></div>
								<div className="slds-spinner__dot-b"></div>
							</div>
						</div>
					</div>
				)}
				{sr && (
					<Tools
						onFieldsSaved={(fields) => fieldsSetHandler(fields)}
						onHighlightChanged={(highlights) => setActiveHighlights(highlights)}
						onObjectSaved={setActiveObject}
						activeObject={activeObject}
						loadedFields={loadedFields}
						filters={activeFilters}
						highlights={activeHighlights}
						selectedRows={selectedRows}
						onBulkEditSaved={bulkEditSaveHandler}
						onFilterChanged={(filters) => setActiveFilters(filters)}
						gridData={gridData}
						sr={sr}
					/>
				)}
				<div className="gridContainer">
					<GridTable
						highlights={activeHighlights}
						fields={activeFields}
						onColumnFieldChanged={columnFieldChangeHandler}
						onRecordUpdated={recordUpdatedHandler}
						onRowSelectionChange={(rows) => setSelectedRows(rows)}
						data={gridData}></GridTable>
				</div>
			</div>
		</article>
	);
}
