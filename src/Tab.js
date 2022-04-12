import './Tab.css';
import React from 'react';
import { FaWindowClose } from 'react-icons/fa';

export function Tab(props) {
    const modalOptions = {
        show: true,
        onClose: () => (props.setModal({show:false})),
        onCancel: () => (props.setModal({show:false})),
        cancelText: "Cancel",
        onConfirm: () => props.deleteTab(props.id),
        confirmText: "OK",
        children: `Delete ${props.label} tab?`
      }

    const classNames = ["tab-list-item"];
    if (props.activeTab === props.id) {
        classNames.push("tab-list-active");
    }
    return <li tabindex={0} className={classNames.join(" ")}
        onClick={() => {
            props.onClickTab(props.id)
        }}>
        <div className="tab-name">{props.label}
        </div>
        <button aria-label='delete tab' className="icon-button" onClick={() => { props.setModal(modalOptions) }}>
            <FaWindowClose />
        </button>
    </li>
}