import React from 'react';
import ListItem from '../ListItem/ListItem';
import './ListContainer.css';
import NewListItem from '../NewListItem/NewListItem';
import { getActiveTabID, getTabByID, getTasksByTabID } from '../../selectors';

function ListContainer(props) {
  const activeTab = getActiveTabID();
  const tasks = getTasksByTabID(activeTab);

  return (
    <div id="container">
      {tasks.map(p =>
        <ListItem 
          key={p.id}
          {...p}
        />)}
      <NewListItem onAddNewTask={props.onAddNewTask}/>
    </div>
  )
}

export default ListContainer;