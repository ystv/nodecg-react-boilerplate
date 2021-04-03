import React from "react";
import ReactDOM from "react-dom";
import { useReplicantValue } from "common/useReplicant";

function Dashboard() {
	const [name, setName] = useReplicantValue("name", undefined, {
		defaultValue: "",
	});
	return (
		<>
			<label>
				Name
				<input
					type="text"
					value={name || ""}
					onChange={(e) => setName(e.target.value)}
				/>
			</label>
		</>
	);
}

ReactDOM.render(<Dashboard />, document.getElementById("root"));
