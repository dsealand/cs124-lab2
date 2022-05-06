import React from 'react';
import ListItem from '../ListItem/ListItem';
import './ListContainer.css';
import NewListItem from '../NewListItem/NewListItem';
import { getActiveTabID, getTabByID, getTasksByTabID } from '../../selectors';
import { isLoaded, isEmpty } from 'react-redux-firebase';

function ListContainer(props) {
  const activeTab = getActiveTabID();
  const tasks = getTasksByTabID(activeTab);
  if (!isLoaded(tasks)) {
    return <p>Loading</p>
  }

  if (!activeTab) {
    return <p>no tab selected</p>
  }
  

  return (
    <div id="container">
      {Object.entries(tasks).map(([id, task]) =>
        <ListItem 
          key={id}
          {...task}
        />)}
      <NewListItem onAddNewTask={props.onAddNewTask}/>
    </div>
  )
}

export default ListContainer;