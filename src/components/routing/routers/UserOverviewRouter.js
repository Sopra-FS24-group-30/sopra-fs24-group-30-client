import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import UserOverview from "../../views/UserOverview";
import PropTypes from "prop-types";

const UserOverviewRouter = () => {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Routes>

                <Route path="" element={<UserOverview/>}/>

                <Route path="dashboard" element={<UserOverview/>}/>

                <Route path="*" element={<Navigate to="dashboard" replace/>}/>

            </Routes>

        </div>
    );
};
/*
* Don't forget to export your component!
 */

UserOverviewRouter.propTypes = {
    base: PropTypes.string
}

export default UserOverviewRouter;
