import './Tab.css';
import React from 'react';

export function Tab(props) {
    const classNames = ["tab-list-item"];
    if (props.activeTab === props.id) {
        classNames.push("tab-list-active");
    }
    return <li className={classNames.join(" ")}
        onClick={() => {props.onClickTab(props.id)
        console.log(props)}}>
        {props.label}
        <div onClick={() => {props.deleteTab(props.id)}}>Delete</div>
    </li>
}