// cSpell:Ignore obtem
import React, { useState, useEffect } from 'react';
import './App.css'
import { ReactComponent as Robot } from '../src/images/robot.svg'
//Gere o seu gif em https://loading.io/
import Carregando from '../src/images/carregando.gif'

function App() {

  const [pessoas, setPessoas] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [etnia, setEtnia] = useState('')
  const [idade, setIdade] = useState('')

  useEffect(() => {
    document.title = 'Gerador de Fotos com IA'
  }, [])

  async function obtemFoto() {
    setPessoas([])
    setCarregando(true)
    const filtraEtnia = etnia.length > 0 ? `&ethnicity=${etnia}` : ''
    const filtraIdade = idade.length > 0 ? `&age=${idade}` : ''
    let url = `https://api.generated.photos/api/v1/faces?api_key=${process.env.REACT_APP_API_KEY}${filtraEtnia}${filtraIdade}&order_by=random`
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        const uri = data.faces
        console.log(data.faces)
        uri && setPessoas(data.faces)
      })
      .catch(function (error) {
        console.error('Houve um problema ao efetuar a requisição: ' + error.message);
      });
    setCarregando(false)
  }



  function ListaPessoas(props) {
    const pessoas = props.pessoas
    const listagemPessoas = pessoas.map((pessoa) =>
      <img key={pessoa.id} src={pessoa.urls[4][512]} title={pessoa.meta.age[0] + ' ' + pessoa.meta.ethnicity[0]} alt="" />
    );
    return (
      <ul>{listagemPessoas}</ul>
    );
  }

  return (
    <div className="App">
      <h1>Gerador de Fotos com IA</h1>
      {pessoas.length > 0
        ? <ListaPessoas pessoas={pessoas} />
        : <Robot />
      }
      {carregando &&
        <>
          <p>Aguarde enquanto as faces são geradas...</p>
          <img src={Carregando} title="aguarde" alt="aguarde" />
        </>
      }
      <div className="opcoes">
        <label>Etnia:</label>
        <select onChange={e => setEtnia(e.target.value)}>
          <option value="">Todas</option>
          <option value="white">Branco</option>
          <option value="latino">Latino</option>
          <option value="asian">Asiático</option>
          <option value="black">Negro</option>
        </select>
        <label>Idade:</label>
        <select onChange={e => setIdade(e.target.value)}>
          <option value="">Todas</option>
          <option value="infant">Infantil</option>
          <option value="child">Criança</option>
          <option value="young-adult">Jovem</option>
          <option value="adult">Adulto</option>
          <option value="elderly">Idoso</option>
        </select>
      </div>
      <button type='button' onClick={obtemFoto}>
        Obter Imagens
      </button>
      {pessoas.length > 0 &&
        <button type='button' onClick={() => setPessoas([])}>
          Limpar Resultados
      </button>
      }
    </div>
  );
}

export default App;
