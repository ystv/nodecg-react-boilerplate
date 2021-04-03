import ReactDOM from "react-dom";
import { useOnlyReplicantValue } from "common/useReplicant";
import { Name } from "./Name";

function Graphics() {
	const name = useOnlyReplicantValue("name", undefined, { defaultValue: "" });
	return (
		<>
			<h1>This is the graphics, but React.</h1>
			<Name name={name || ""} />
		</>
	);
}

ReactDOM.render(<Graphics />, document.getElementById("root"));
