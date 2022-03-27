import './Header.css';
import React from 'react';
import { useState } from 'react';
import Dropdown from 'react-dropdown';
import Select, { Components } from 'react-select';
import { FaRegTrashAlt, FaRegEye, FaRegEyeSlash, FaSortAmountDown } from 'react-icons/fa';

function Header(props) {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const options = [
    { value: 'Date Created', label: 'Date Created' },
    { value: 'Name', label: 'Name' },
    { value: 'Priority', label: 'Priority' }]
  const defaultOption = options[0]

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
            setShowSortMenu(!showSortMenu)
            console.log("set showsortmenu", showSortMenu)
          }}>
            <FaSortAmountDown></FaSortAmountDown>
          </button>
          {showSortMenu && <div className="dropdown">
            <ul>
              <li>
                <button onClick={(e) => {
                  props.sortByDate()
                  console.log('sorting by date')
                }}>Date Created
                </button>
              </li>
              <li>
                <button onClick={(e) => {
                  props.sortByName()
                  console.log('sorting by name')
                }}>Name
                </button>
              </li>
              <li>
                <button onClick={(e) => {
                  props.sortByPriority()
                  console.log('sorting by priority')
                }}>Priority
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