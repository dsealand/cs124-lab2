import React from 'react';
import ListItem from '../ListItem/ListItem';
import './ListContainer.css';
import NewListItem from '../NewListItem/NewListItem';
import { getActiveTabID, getTasksByTabID, getSortOrder, getShowCompleted } from '../../selectors';
import { isLoaded, isEmpty } from 'react-redux-firebase';

function ListContainer(props) {
  const activeTab = getActiveTabID();
  const sortOrder = getSortOrder();
  const tasks = getTasksByTabID(activeTab);
  const showCompleted = getShowCompleted();

 
  if (!isLoaded(tasks)) {
    return <p>Loading</p>
  }

  const sortedTasks = [...tasks].sort((a,b) => {
    console.log(a,b)
    const up = sortOrder[1] === "asc"?1:-1;
    return (a[sortOrder[0]] > b[sortOrder[0]])? up : -1*up;
  });

  function renderItem([id, task]) {
    if (showCompleted || !task.isCompleted) {
      return <ListItem 
          key={id}
          activeTab={activeTab}
          {...task}
        />
    }
    return null
  }

  return (
    <div id="container">
      {(isEmpty(tasks))?'':Object.entries(sortedTasks).map(renderItem)}
      {activeTab?<NewListItem/>:<p>Select a tab below, or create a new one!</p>}
    </div>
  )
}

export default ListContainer;