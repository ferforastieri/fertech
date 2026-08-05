'use client'

import { FormEvent, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firebaseApp, firestore } from '@/lib/firebase'

export default function Admin(){
  const [user,setUser]=useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [json,setJson]=useState('')
  const [status,setStatus]=useState('')
  const auth=getAuth(firebaseApp)
  useEffect(()=>onAuthStateChanged(auth,current=>setUser(Boolean(current))),[auth])
  async function login(event:FormEvent){event.preventDefault();try{await signInWithEmailAndPassword(auth,email,password);setStatus('')}catch(error){setStatus(error instanceof Error?error.message:'Falha ao entrar.')}}
  async function load(){try{const snapshot=await getDoc(doc(firestore,'profile','main'));if(!snapshot.exists())throw new Error('Perfil não encontrado.');setJson(JSON.stringify(snapshot.data(),null,2));setStatus('')}catch(error){setStatus(error instanceof Error?error.message:'Falha ao carregar.')}}
  async function save(){try{await setDoc(doc(firestore,'profile','main'),JSON.parse(json));setStatus('Salvo com sucesso.')}catch(error){setStatus(error instanceof Error?error.message:'JSON inválido.')}}
  if(!user)return <main className="admin"><form onSubmit={login}><p className="eyebrow">Área restrita</p><h1>Conteúdo</h1><input type="email" placeholder="E-mail" value={email} onChange={event=>setEmail(event.target.value)} required/><input type="password" placeholder="Senha" value={password} onChange={event=>setPassword(event.target.value)} required/><button>Entrar</button><p>{status}</p></form></main>
  return <main className="admin editor"><header><h1>Perfil</h1><button onClick={load}>Carregar do Firebase</button></header><textarea value={json} onChange={event=>setJson(event.target.value)} spellCheck={false}/><footer><span>{status}</span><button onClick={save}>Salvar</button></footer></main>
}
