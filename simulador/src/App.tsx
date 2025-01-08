import Card, { CardBody } from './components/Card.tsx';
import List from './components/List.tsx'
import Score from './components/Score.tsx';
import React from 'react';
//import Select from './components/Select.tsx'

function App() {
  //const list: string[] = ['Goku', 'Messi', 'Batman'];
  return (
    <>
    <Score />
    {/* 3 Selects para liga, división y club*/}
{/*       <Card>
        <CardBody title='Título de esto' text='Valur'/>
        {list.length !== 0  ? (
          <List data={list} />
        ) : (
          <p>No hay elementos</p>
        )}
      </Card> */}
    </>
  ) 
}

export default App;