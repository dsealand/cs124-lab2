import './Header.css';
import React from 'react';
import { useState } from 'react';
import { FaRegTrashAlt, FaRegEye, FaRegEyeSlash, FaSortAmountDown } from 'react-icons/fa';

function Header(props) {
  const [showSortMenu, setShowSortMenu] = useState(false);

  function handleSortClick(field) {
    props.setSortField(field);
    setShowSortMenu(false);  
  }

  return (
    <div id="header">
      <div className="header-icon">
        <div className="task-icon">
          <button className="icon-button" onClick={props.onToggleShowCompleted}>
            {(props.isShowCompleted) ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        </div>
      </div>
      <div className="header-sort">
        <div className="sort-icon">
          <button className="icon-button" onClick={(e) => {
            setShowSortMenu(!showSortMenu);
          }}>
            <FaSortAmountDown></FaSortAmountDown>
          </button>
          {showSortMenu && <div className="dropdown">
            <ul>
              <li>
                <button onClick={e => handleSortClick("updated")}>Date Updated
                </button>
              </li>
              <li>
                <button onClick={e => handleSortClick("text")}>Name
                </button>
              </li>
              <li>
                <button onClick={e => handleSortClick("priority")}>Priority
                </button>
              </li>
            </ul>
          </div>}
        </div>
      </div>
      <h3>Tasks</h3>
      <div className="spacing" />
      <div className="task-icon">
        <button className="icon-button" onClick={() => props.onToggleModal()}>
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  )
}

export default Header;