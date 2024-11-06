import { db, auth } from "./firebaseConnection";
import { useState, useEffect } from "react";
import {
  doc,
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot
} from 'firebase/firestore'

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged
} from "firebase/auth"; 

import "./index.css"



function App() {


  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})

  const [post, setPost] = useState([])


  
  useEffect( () => {
    
    async function loadPosts(){
      
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = []

        snapshot.forEach((doc)=>{
          listaPost.push({
            id:doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })
  
        setPost(listaPost)
        
      })
    }
    loadPosts()
  }, [])

  useEffect ( () => {
    async function permanecerLogado(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          //se estiver logado
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          //se NÃO estiver logado
          setUser(false)
          setUserDetail({})
        }
      })
    }

    permanecerLogado();
  }, [])


  async function handleApp(){
    /*await setDoc(doc(db, "posts", "123456"), {
      titulo: titulo,
      autor: autor,
    })
    .then(()=>{
      alert("registrado no banco de dados")
    })
    .catch((error)=>{
      alert(`Não cadastrado. Erro: ${error}`)
    })*/

    await addDoc(collection(db, "posts"),{
      titulo: titulo,
      autor: autor,
    })
    .then(()=>{
      setAutor('')
      setTitulo('')
    })
    .catch((error)=>{
      alert("Não foi possicel registrar. Erro: " + error)
    })


  }

  async function buscarPost(){
    const postRef = collection(db, "posts")

    await getDocs(postRef)
    .then((snapshot)=>{
      let lista = []
      snapshot.forEach((doc)=>{
        lista.push({
          id:doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        })
      })

      setPost(lista)
      
    })
    .catch(()=>{
      alert("Deu Erro")
    })
  }

  async function excluirPost(id){
    const docRef = doc(db, "posts", id)
    
    await deleteDoc(docRef)
    .then(alert("post deletado com sucesso. ID do post: " + id))
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then((value)=>{
        console.log(value)
        setEmail('')
        setSenha('')
      })
    .catch( (error) => {

      if( error.code === 'auth/weak-password') {
        alert('senha muito fraca')
      }else if ( error.code === "auth/email-already-in-use"){
        alert("Esse email já existe")
      }
      
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword (auth, email, senha)
    .then( (value) => {
      alert('Logado')
      console.log(value.user)

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email
      })

      setUser(true)

      setEmail('')
      setSenha('')
    })
    .catch((error)=>{
      alert('ERRO')
    })
  }

  async function logOut(){
    await signOut(auth)
    .then(()=>{
      alert('Deslogado')
      setUser(false)
    })
    .catch( () => {
      alert('ERRO! CONTA CONTINUA CONECTADA')
    })
  }


  return (
    <div>
      <h1>Usando React + FIREBASE</h1>

      { user && (
        <div>
          <strong>Seja bem vindo(a)! Você está logado(a).</strong> <br/>
          <span>UID: {userDetail.uid} - Email: {userDetail.email}</span><br/>
          <button onClick={logOut}>Sair</button>
        </div>
      )}

      <div className="container">
        <h2>Usuário</h2>
        <label>Email</label>
        <input
        placeholder="Digite um email"
        value={email}
        onChange={ (e) => setEmail(e.target.value )}
        /><br/>

        <label>Senha</label>
        <input
        placeholder="Digite sua senha"
        value={senha}
        onChange={ (e) => setSenha(e.target.value )}
        /> <br/>
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Entrar</button>
      </div>
      <br/><br/>
      <hr/>

      <div className="container">
        <h2>Posts</h2>
        <label>TÍTULO:</label>
        <textarea
          type="text"
          placeholder="Digite seu titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>AUTOR</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={ handleApp }>Cadastrar</button>
        <button onClick={buscarPost}>Buscar Post</button> <br/>

        <ul>
          {post.map((post)=> {
            return(
              <li key={post.id}>
                <strong>id: {post.id}</strong> <br/>
                <span>Título: {post.titulo}</span> <br/>
                <span>Autor: {post.autor} </span> <br/>
                <button onClick={() => excluirPost(post.id)}>Excluir</button>  <br/>
                <br/>

              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
