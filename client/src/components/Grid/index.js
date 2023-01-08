import React, { useEffect, useState } from "react";
import { graphQLPOST, getRefreshSignedRequest, decode } from "../../utils/canvasUtil";
import "@salesforce/canvas-js-sdk";
import Tools from "../Tools";
import GridTable from "./gridTable";
import "./grid.css";

const PREFIX = "opengrid_";
const GRIDCOUNT = "200";

export default function Grid() {
	const [sr, setSr] = useState();
	const [loadedFields, setLoadedFields] = useState([]);
	// const [openGridJSONObject, setOpenGridJSONObject] = useState();
	const [activeFields, setActiveFields] = useState([]);
	const [activeFilters, setActiveFilters] = useState([]);
	const [activeHighlights, setActiveHighlights] = useState([]);
	const [activeObject, setActiveObject] = useState();
	const [gridData, setGridData] = useState();

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
		let graphStr = graphStringFromObjects(object, fields, filters);
		let gridData = await graphqlQuery(sr, graphStr, object.QualifiedApiName);
		let formedData = formData(gridData);
		setGridData(formedData);
	};
	//TODO add empty nodes
	const formData = (data) => {
		let formed = data.edges.map((edge) => {
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
			let { object, fields, filters, highlights } = gridObjectJSON;
			setActiveObject(object);
			setLoadedFields(fields);
			setActiveFields(fields);
			setActiveFilters(filters);
			setActiveHighlights(highlights);
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
		console.log(sortByField);
		if (sortByField.referencedFromName) {
			filterQueryStr += `, orderBy: { ${sortByField.name}: {${sortByField.referencedFromName}: {order: ${sortByField.sortOrder}}}}`;
		} else {
			filterQueryStr += `, orderBy: { ${sortByField.name}: {order: ${sortByField.sortOrder}}}`;
		}
		if (filters.length > 0) {
			filterQueryStr += `, where: { and: [ `;
			filters.forEach((filter) => {
				const valueStr =
					filter.fieldType === "date"
						? `{value: "${filter.value}"}`
						: `"${filter.value}"`;
				filterQueryStr += `{ ${filter.fieldName}: {${filter.operatorValue}: ${valueStr} }}, `;
			});
			filterQueryStr += `] })`;
		} else {
			filterQueryStr = filterQueryStr += ")";
		}
		// TODO ending ) above closes out the modifiers.  Gotta get the orderBy in there by
		// grabbing the sorted field and adding it's data in before closing it out
		fields.forEach((field) => {
			if (field.referencedFromName) {
				if (field.type === "id") {
					fieldQueryStr += `${field.referencedFromName} { Id }`;
				} else {
					fieldQueryStr += `${field.referencedFromName} { ${field.name} { value } }`;
				}
			} else {
				if (field.type === "id") {
					fieldQueryStr += `Id `;
				} else {
					fieldQueryStr += `${field.name} { value } `;
				}
			}
		});
		let graph = `query openGrid {
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
		console.log(fields);
		setActiveFields(fields);
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
						onFieldsSaved={setActiveFields}
						onHighlightChanged={(highlights) => setActiveHighlights(highlights)}
						onObjectSaved={setActiveObject}
						activeObject={activeObject}
						loadedFields={loadedFields}
						filters={activeFilters}
						highlights={activeHighlights}
						onFilterChanged={(filters) => setActiveFilters(filters)}
						sr={sr}
					/>
				)}
				<div className="gridContainer">
					<GridTable
						highlights={activeHighlights}
						fields={activeFields}
						onColumnFieldChanged={columnFieldChangeHandler}
						data={gridData}></GridTable>
				</div>
			</div>
		</article>
	);
}
