import React from "react";
import ReactDOM from "react-dom";
import { useOnlyReplicantValue } from "common/useReplicant";

function Graphics() {
	const name = useOnlyReplicantValue("name", undefined, { defaultValue: "" });
	return (
		<>
			<h1>This is the graphics, but React.</h1>
			<h2>Name is {name}</h2>
		</>
	);
}

ReactDOM.render(<Graphics />, document.getElementById("root"));
