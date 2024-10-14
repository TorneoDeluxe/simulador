import Titulo from './Titulo.tsx';
import Card, { CardBody } from './components/Card.tsx';
import List from './components/List.tsx'

function App() {
  const list = ['Goku', 'Messi', 'Batman']
  return (
    <>
      <Titulo/>
      <Card>
        <CardBody title='Título de esto' text='Valur'/>
        <List data={list} />
      </Card>
    </>
  ) 
}

export default App;