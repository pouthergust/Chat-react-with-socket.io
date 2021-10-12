import React, {useEffect, useState} from 'react';
import socketIOClient from 'socket.io-client';

let socket;

function App() {

  const ENDPOINT = "http://localhost:8080/";

  const [logado, setLogado] = useState(false);
  const [nome, setNome] =  useState('');
  const [sala, setSala] =  useState('');

  const [mensagem, setMensagem] =  useState('');
  const [listaMensagem, setListaMensagem] =  useState([]);

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);
  },[])

  useEffect(() => {
    socket.on('receber_mensagem', (dados) => {
      setListaMensagem([...listaMensagem, dados])
    })
  })

  const conectarSala = () => {
    console.log(`Acessou a sala ${sala} com o usario ${nome}`);
    setLogado(true);
    socket.emit('sala_conectar', sala);
  }

  const enviarMensagem = async () => {
    console.log("Mensagem: " + mensagem)
    const conteudoMensagem = {
      sala,
      conteudo: {
        nome,
        mensagem
      },
    }

    console.log(conteudoMensagem);

    await socket.emit('enviar_mensagem', conteudoMensagem);
    setListaMensagem([...listaMensagem, conteudoMensagem.conteudo]);
    setMensagem('');
  }

  return (
    <div>
      <h1>chat</h1>
      {!logado ?
      <>
        <label htmlFor="">Nome: </label>
        <input
          type="text"
          name="nome"
          value={nome}
          placeholder="nome"
          onChange={(text) => {setNome(text.target.value)}}
          />

        <br /><br />

        <label htmlFor="">Sala: </label>
        {/* <input
          type="text"
          name="sala"
          value={sala}
          placeholder="Sala"
          onChange={(text) => {setSala(text.target.value)}}
          /> */}

          <select name="sala" value={sala} onChange={(texto) => {setSala(texto.target.value)}}>
            <option value="">Selecione</option>
            <option value="1">Node.js</option>
            <option value="2">React</option>
            <option value="3">React Native</option>
            <option value="4">PHP</option>
          </select>

          <br /><br />

        <button onClick={conectarSala}>Acessar</button>
      </>
       :
       <>
       {listaMensagem.map((msg, key) => {
         return (
            <div key={key}>
              {msg.nome} : {msg.mensagem}
            </div>
         )
       })}
        <input
          type="text"
          name="mensagem"
          value={mensagem}
          placeholder="Mensagem..."
          onChange={(texto) => {setMensagem(texto.target.value)}} />

          <button onClick={enviarMensagem}>Enviar</button>
       </>
       }
    </div>
  );
}

export default App;
