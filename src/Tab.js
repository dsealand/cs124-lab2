import './Tab.css';
import React from 'react';
import { FaWindowClose } from 'react-icons/fa';

export function Tab(props) {
    const classNames = ["tab-list-item"];
    if (props.activeTab === props.id) {
        classNames.push("tab-list-active");
    }
    return <li className={classNames.join(" ")}
        onClick={() => {
            props.onClickTab(props.id)
        }}>
        <div className="tab-name">{props.label}
        </div>
        <button className="icon-button" onClick={() => { props.deleteTab(props.id) }}>
            <FaWindowClose />
        </button>
    </li>
}