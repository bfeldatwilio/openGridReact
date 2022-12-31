import React, { useEffect, useState } from "react";
import "./fieldFilterCmp.css";
import AddFilterCmp from "./addFilterCmp";

export default function FieldFilterCmp({ activeFields, onCancel, onFilterChange, filters }) {
	useEffect(() => {
		console.log(activeFields);
	}, []);

	const filterSetHandler = (filter) => {
		onFilterChange([...filters, filter]);
	};

	const removeFilterClickHandler = (index) => {
		let remainingFilters = filters.filter((_, filterIndex) => filterIndex !== index);
		console.log(remainingFilters);
		onFilterChange(remainingFilters);
	};

	return (
		<div
			className="filterContainer slds-panel slds-size_medium slds-panel_docked slds-panel_docked-right slds-panel_drawer slds-is-open"
			aria-hidden="false"
			id="example-unique-id-11">
			<div className="slds-panel__header">
				<h2
					className="slds-panel__header-title slds-text-heading_small slds-truncate"
					title="Filter">
					Filter
				</h2>
				<div className="slds-panel__header-actions">
					<button
						onClick={() => onCancel()}
						className="slds-button slds-button_icon slds-button_icon-small slds-panel__close"
						title="Collapse Filter">
						<svg className="slds-button__icon" aria-hidden="true">
							<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
						</svg>
						<span className="slds-assistive-text">Collapse Filter</span>
					</button>
				</div>
			</div>
			<div className="slds-panel__body">
				<div className="slds-filters">
					<ol className="slds-list_vertical slds-list_vertical-space">
						<li className="slds-item slds-hint-parent">
							<div className="slds-filters__item slds-grid slds-grid_vertical-align-center">
								<button className="slds-button_reset slds-grow slds-has-blur-focus">
									<span className="slds-assistive-text">Edit filter:</span>
									<span className="slds-show slds-text-body_small">Show Me</span>
									<span className="slds-show">All Products</span>
								</button>
							</div>
						</li>
					</ol>
					<h3 className="slds-text-body_small slds-m-vertical_x-small">
						Matching all these filters
					</h3>
					<ol className="slds-list_vertical slds-list_vertical-space">
						{filters.map((filter, index) => (
							<li className="slds-item slds-hint-parent">
								<div className="slds-filters__item slds-grid slds-grid_vertical-align-center">
									<button className="slds-button_reset slds-grow slds-has-blur-focus">
										<span className="slds-show slds-text-body_small">
											{filter.fieldName}
										</span>
										<span className="slds-show">
											{filter.operatorLabel} {filter.value}
										</span>
									</button>
									<button
										onClick={() => removeFilterClickHandler(index)}
										className="slds-button slds-button_icon slds-button_icon slds-button_icon-small"
										title="Remove equals THIS WEEK">
										<svg
											className="slds-button__icon slds-button__icon_hint"
											aria-hidden="true">
											<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#delete"></use>
										</svg>
										<span className="slds-assistive-text">
											Remove filter: {filter.fieldName} {filter.operatorLabel}{" "}
											{filter.value}
										</span>
									</button>
								</div>
							</li>
						))}
					</ol>
					<AddFilterCmp
						fields={activeFields}
						onFilterSet={filterSetHandler}></AddFilterCmp>
				</div>
			</div>
		</div>
	);
}
