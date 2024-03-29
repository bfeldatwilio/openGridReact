import React, { useEffect, useState } from "react";
import { ajaxCallGET, ajaxCall } from "../../utils/canvasUtil";
import ObjectAddCmp from "./objectAddCmp";
import FieldAddCmp from "./fieldAddCmp";
import "./tools.css";
import FieldFilterCmp from "./fieldFilterCmp";
import ChatgptCmp from "./chatgptCmp";
import FieldHighlightCmp from "./fieldHighlightCmp";
import BulkEditCmp from "./bulkEditCmp";

const OBJECTSEARCHURL = "/services/apexrest/entityDefinitions/";

export default function Tools({
  activeObject,
  loadedFields,
  filters,
  highlights,
  sr,
  onFieldsSaved,
  onObjectSaved,
  onFilterChanged,
  onHighlightChanged,
  onBulkEditSaved,
  selectedRows,
  gridData,
}) {
  const [sourceObj, setSourceObj] = useState();
  const [objectFields, setObjectFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [highlightModalVisible, setHighlightModalVisible] = useState(false);
  const [bulkEditModalVisible, setBulkEditModalVisible] = useState(false);
  const [chatgptModalVisible, setChatgptModalVisible] = useState(false);

  const [disableFieldSelect, setDisableFieldSelect] = useState(true);
  const [disableFieldFilter, setDisableFieldFilter] = useState(true);
  const [disableComputed, setDisableComputed] = useState(true);
  const [disableHighlight, setDisableHighlight] = useState(true);
  const [disableBulkEdit, setDisableBulkEdit] = useState(true);

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

  useEffect(() => {
    let noRowsSelected = selectedRows.length === 0;
    setDisableBulkEdit(noRowsSelected);
  }, [selectedRows]);

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
        referencedFromLabel: field.referencedFromLabel,
        referencedFromName: field.referencedFromName,
        picklistValues: field.picklistValues,
        picklistValueLabels: field.picklistValueLabels,
        sortOrder: "ASC",
        activeSort: index === 0,
      };
    });
    onFieldsSaved(gridFields);
  };

  const bulkEditSaveClickHandler = async (editObj) => {
    let updateObj = {
      allOrNone: false,
      records: [],
    };
    editObj.records.forEach((record) => {
      let recordUpdateObj = {
        attributes: { type: sourceObj.QualifiedApiName },
        id: record.Id,
      };
      recordUpdateObj[editObj.field.name] = editObj.newValue;
      updateObj.records.push(recordUpdateObj);
    });
    onBulkEditSaved(updateObj);
    setBulkEditModalVisible(false);
  };

  const computedToolClickHandler = () => {
    console.log("computed clicked");
  };

  return (
    <section className="toolsContainer">
      <div>
        <button
          onClick={() => setBulkEditModalVisible(true)}
          disabled={disableBulkEdit}
          className="slds-button slds-button_neutral"
        >
          Bulk Edit
        </button>
      </div>
      <div className="divider"></div>
      <div>
        <ObjectAddCmp
          placeholder="Set Object"
          activeObject={sourceObj}
          searchurl={OBJECTSEARCHURL}
          sr={sr}
          onItemChosen={onObjectSaved}
        ></ObjectAddCmp>
      </div>
      <div>
        <button
          onClick={() => setFieldModalVisible(true)}
          disabled={disableFieldSelect}
          className="slds-button slds-button_neutral"
        >
          Fields ({selectedFields.length})
        </button>
      </div>
      <div>
        <button
          onClick={() => setFilterModalVisible(true)}
          disabled={disableFieldFilter}
          className="slds-button slds-button_neutral"
        >
          Filter ({filters.length})
        </button>
      </div>
      {/* <div>
				<button
					onClick={computedToolClickHandler}
					disabled={disableComputed}
					className="slds-button slds-button_neutral">
					Computed Field
				</button>
			</div> */}
      <div>
        <button
          onClick={() => setHighlightModalVisible(true)}
          disabled={disableHighlight}
          className="slds-button slds-button_neutral"
        >
          Highlight ({highlights.length})
        </button>
      </div>
      {/* <div>
				<button
					onClick={() => setChatgptModalVisible(true)}
					className="slds-button slds-button_neutral">
					Insights
				</button>
			</div> */}
      {fieldModalVisible && (
        <>
          {/* TODO refactor below into a component like the rest of them */}
          <section
            role="dialog"
            tabindex="-1"
            aria-modal="true"
            aria-labelledby="modal-heading-01"
            className="slds-modal slds-fade-in-open"
          >
            <div className="slds-modal__container">
              <button
                onClick={() => setFieldModalVisible(false)}
                className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse"
              >
                <svg
                  className="slds-button__icon slds-button__icon_large"
                  aria-hidden="true"
                >
                  <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
                </svg>
                <span className="slds-assistive-text">Cancel and close</span>
              </button>
              <div className="slds-modal__header">
                <h1
                  id="modal-heading-01"
                  className="slds-modal__title slds-hyphenate"
                >
                  Select Fields
                </h1>
              </div>
              <div
                className="slds-modal__content slds-p-around_medium"
                id="modal-content-id-1"
              >
                <FieldAddCmp
                  sr={sr}
                  onSelectionChange={setSelectedFields}
                  activeFields={selectedFields}
                  fields={objectFields}
                ></FieldAddCmp>
              </div>
              <div className="slds-modal__footer">
                <button
                  className="slds-button slds-button_neutral"
                  onClick={() => setFieldModalVisible(false)}
                  aria-label="Cancel and close"
                >
                  Cancel
                </button>
                <button
                  onClick={fieldSaveClickHandler}
                  className="slds-button slds-button_brand"
                >
                  Save
                </button>
              </div>
            </div>
          </section>
          <div
            className="slds-backdrop slds-backdrop_open"
            role="presentation"
          ></div>
        </>
      )}
      {filterModalVisible && (
        <FieldFilterCmp
          activeFields={selectedFields}
          filters={filters}
          onFilterChange={onFilterChanged}
          onCancel={() => setFilterModalVisible(false)}
        ></FieldFilterCmp>
      )}
      {highlightModalVisible && (
        <FieldHighlightCmp
          onHighlightChange={onHighlightChanged}
          activeFields={selectedFields}
          highlights={highlights}
          onCancel={() => setHighlightModalVisible(false)}
        ></FieldHighlightCmp>
      )}
      {bulkEditModalVisible && (
        <BulkEditCmp
          onBulkEditSaved={bulkEditSaveClickHandler}
          onCancel={() => setBulkEditModalVisible(false)}
          fields={selectedFields}
          selectedRows={selectedRows}
        ></BulkEditCmp>
      )}
      {chatgptModalVisible && (
        <ChatgptCmp
          gridData={gridData}
          onCancel={() => setChatgptModalVisible(false)}
        ></ChatgptCmp>
      )}
    </section>
  );
}
