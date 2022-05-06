import React from 'react';
import ListItem from '../ListItem/ListItem';
import './ListContainer.css';
import NewListItem from '../NewListItem/NewListItem';
import { getActiveTabID, getTasksByTabID, getSortOrder, getShowCompleted } from '../../selectors';
import { isLoaded, isEmpty } from 'react-redux-firebase';

function ListContainer(props) {
  const activeTab = getActiveTabID();
  const sortOrder = getSortOrder();
  const tasks = getTasksByTabID(activeTab, sortOrder);
  const showCompleted = getShowCompleted();

  if (!activeTab) {
    return <p>no tab selected</p>
  }
 
  if (!isLoaded(tasks)) {
    return <p>Loading</p>
  }

  function renderItem([id, task]) {
    if (showCompleted || !task.isCompleted) {
      return <ListItem 
          key={id}
          {...task}
        />
    }
    return 
  }

  return (
    <div id="container">
      {(isEmpty(tasks))?'':Object.entries(tasks).map(renderItem)}
      <NewListItem/>
    </div>
  )
}

export default ListContainer;