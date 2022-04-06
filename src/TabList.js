import {Tab} from "./Tab";
import React from 'react';
import {useState} from "react";

function TabList(props) {
    const [activeTab, setActiveTab] = useState(props.children[0].key);

    return <div className="tabs">
        <ol className="tab-list">
            {props.children.map(child =>
                <Tab key={child.key}
                     label={child.key}
                     activeTab={activeTab}
                     onClickTab={(label) => setActiveTab(label)}/>)}
        </ol>
        {props.children.map(child => activeTab === child.key && child)}
    </div>;activeTab
}

export default TabList;