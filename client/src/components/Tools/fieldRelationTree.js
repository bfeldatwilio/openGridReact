import React, { useEffect, useState } from "react";
import { ajaxCallGET } from "../../utils/canvasUtil";

export default function FieldRelationTree({ relationship, references, onFieldSelected, sr }) {
	const [relatedFields, setRelatedFields] = useState([]);

	const fetchObject = async () => {
		let query = `${sr.client.instanceUrl}${sr.context.links.sobjectUrl}${relationship}/describe`;
		let res = await ajaxCallGET(sr, query);
		console.log(res.fields);
		setRelatedFields(res.fields);
	};
	return (
		<button onClick={fetchObject} className="slds-button">
			{relationship} ({references[0]})
		</button>
	);
}
