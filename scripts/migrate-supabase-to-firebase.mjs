import { applicationDefault, cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const supabaseUrl=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const projectId=process.env.FIREBASE_PROJECT_ID||process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const assetsOnly=process.argv.includes('--assets-only')
if(!supabaseUrl||!supabaseKey||(!assetsOnly&&!projectId))throw new Error('Defina SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e FIREBASE_PROJECT_ID.')

const db=assetsOnly?null:getFirestore(initializeApp({credential:process.env.FIREBASE_SERVICE_ACCOUNT?cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)):applicationDefault(),projectId}))
const repositoryRoot=join(dirname(fileURLToPath(import.meta.url)),'..')
const tables=['profile','home_content','site_content','project_groups','projects','articles','resume_experiences','resume_roles','resume_education','resume_technologies','resume_settings']
const ids={profile:()=> 'main',home_content:()=> 'main',site_content:()=> 'main',resume_settings:()=> 'main',articles:row=>row.slug}

async function read(table){
  const rows=[]
  for(let start=0;;start+=1000){
    const response=await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`,{headers:{apikey:supabaseKey,Authorization:`Bearer ${supabaseKey}`,Range:`${start}-${start+999}`}})
    if(!response.ok)throw new Error(`${table}: ${response.status} ${await response.text()}`)
    const page=await response.json();rows.push(...page)
    if(page.length<1000)return rows
  }
}

const migratedFiles=new Map()
async function migrateValue(value){
  if(Array.isArray(value))return Promise.all(value.map(migrateValue))
  if(value&&typeof value==='object')return Object.fromEntries(await Promise.all(Object.entries(value).map(async([key,item])=>[key,await migrateValue(item)])))
  if(typeof value!=='string'||!value.startsWith(`${supabaseUrl}/storage/v1/object/public/`))return value
  if(migratedFiles.has(value))return migratedFiles.get(value)
  const sourcePath=decodeURIComponent(new URL(value).pathname.split('/object/public/')[1])
  const safePath=sourcePath.split('/').map(part=>part.replace(/[^a-zA-Z0-9._-]/g,'-')).filter(part=>part&&part!=='.'&&part!=='..').join('/')
  if(!safePath)throw new Error(`Caminho inválido no Storage: ${sourcePath}`)
  const publicPath=`/media/supabase-migration/${safePath}`
  const destination=join(repositoryRoot,'public',publicPath)
  const response=await fetch(value,{headers:{apikey:supabaseKey,Authorization:`Bearer ${supabaseKey}`}})
  if(!response.ok)throw new Error(`Storage ${sourcePath}: ${response.status}`)
  await mkdir(dirname(destination),{recursive:true})
  await writeFile(destination,Buffer.from(await response.arrayBuffer()))
  migratedFiles.set(value,publicPath)
  console.log(`arquivo local: ${publicPath}`)
  return publicPath
}

for(const table of tables){
  const rows=await Promise.all((await read(table)).map(migrateValue))
  if(assetsOnly){console.log(`${table}: ${rows.length} registro(s) verificado(s)`);continue}
  for(let start=0;start<rows.length;start+=450){
    const batch=db.batch()
    rows.slice(start,start+450).forEach((row,index)=>{
      const resolveId=ids[table]
      const id=String(resolveId?resolveId(row):row.id??`${start+index}`)
      batch.set(db.collection(table).doc(id),row)
    })
    await batch.commit()
  }
  console.log(`${table}: ${rows.length} documento(s) migrado(s)`)
}

console.log(assetsOnly?'Download dos arquivos concluído.':'Migração concluída.')
