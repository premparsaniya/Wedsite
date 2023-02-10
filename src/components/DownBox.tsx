
import React from 'react'
import { NavLink } from 'react-router-dom'
type props = {
    text: any,
    linkName: any,
    page: any,
    className: any
}
const DownBox = ({ text, linkName, page, className }: props) => {
    return (
        <div className={className}>
            <p> {text}
                <span style={{ marginLeft: '2px' }}>
                    <NavLink to={page} style={{ textDecoration: "underline", color: "white" }} >   {linkName}    </NavLink>
                </span>
            </p>
        </div>

    )
}

export default DownBox