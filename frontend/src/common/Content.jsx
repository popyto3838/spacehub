import {Outlet} from "react-router-dom";

const Content = () => {
    return (
        <div className="content">
            <Outlet/>
        </div>
    )
}
export default Content;