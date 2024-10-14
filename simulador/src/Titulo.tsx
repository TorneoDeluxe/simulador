function Titulo() {
  const nombre = 'Fede';
  if(nombre){
    return <h1>Hola {nombre}</h1>;
  }
  return <p>No hay nombre!!!</p>
}

export default Titulo;