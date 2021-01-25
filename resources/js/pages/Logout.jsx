import React from "react";
import ContextWrapper from "../context/ContextWrapper";

const Logout = ({ auth }) => {
    React.useEffect(() => {
        localStorage.removeItem("session_token");
        localStorage.removeItem("user");
        auth.user = {};
        auth.token = null;
        location.href = "/login";
    }, []);
    return <div>Logging out...</div>;
};

export default ContextWrapper(Logout);
