import React from 'react';
import ListItem from '../ListItem/ListItem';
import './ListContainer.css';
import NewListItem from '../NewListItem/NewListItem';

function ListContainer(props) {
  return (
    <div id="container">
      {props.items.map(p =>
        <ListItem 
          key={p.id}
          onChangeField={props.onChangeField} 
          onToggleItemCompleted={props.onToggleItemCompleted}
          onDeleteById={props.onDeleteById}
          {...p}
        />)}
      <NewListItem onAddNewTask={props.onAddNewTask}/>
    </div>
  )
}

export default ListContainer;