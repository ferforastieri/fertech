import {readdirSync,statSync,writeFileSync} from 'node:fs'
import {join,relative} from 'node:path'

const reposRoot='/work/repos'
const output=join(process.cwd(),'messages/project-trees.json')
const repositories={
  mimelie:'pessoal/Mimelie',atacte:'pessoal/atacte',dashboard:'pessoal/dashlab',fertec:'pessoal/fertech',miraj:'pessoal/miraj-of-icarus',miriam:'pessoal/mundo-de-miriam',familia:'pessoal/my-family',
  clienterei:'smart/clienterei',gabriel:'smart/gabrielpro',imperio:'smart/imperio-delivery',morelli:'smart/morelli',rehau:'smart/rehau',smart:'smart/smart','sw-platform':'smart/sw',pintor:'smart/sw-app',recomenda:'smart/sw-recomenda',vendedor:'smart/vendedor-gold','vendedor-ia':'smart/vendedor-gold-ia-backend',parceiro:'smart/wpp-parceirogold',
}
const ignoredDirectories=new Set(['.git','.next','.open-next','.turbo','.venv','venv','node_modules','vendor','dist','build','out','coverage','www','bin','obj','.dart_tool','.gradle','.angular','.expo','.idea','tmp','temp','cache','playwright-report','test-results','__pycache__','Pods'])
const ignoredAssetDirectories=new Set(['assets','public','resources','images','img','fonts','uploads','generated'])
const codeExtensions=new Set(['.ts','.tsx','.js','.jsx','.mjs','.cjs','.vue','.dart','.py','.cs','.cpp','.cc','.c','.h','.hpp','.prisma','.sql','.graphql','.proto','.yaml','.yml','.toml'])
const architectureFiles=new Set(['package.json','Dockerfile','docker-compose.yml','docker-compose.yaml','compose.yml','compose.yaml','turbo.json','pnpm-workspace.yaml','tsconfig.json','global.json','CMakeLists.txt','pubspec.yaml','README.md'])
const maxNodesPerRoot=Number.POSITIVE_INFINITY
const maxDepth=9

const extension=name=>{const index=name.lastIndexOf('.');return index<0?'':name.slice(index)}
const sensitive=name=>/(^\.env|secret|credential|private.?key|google-services|firebase-admin|AuthKey|\.p8$|\.pem$|\.keystore$|\.jks$)/i.test(name)
const relevantFile=name=>!sensitive(name)&&(architectureFiles.has(name)||codeExtensions.has(extension(name)))

function buildTree(root){
  const visit=(directory,depth,state)=>{
    if(depth>maxDepth)return[]
    const entries=readdirSync(directory,{withFileTypes:true}).sort((a,b)=>Number(b.isDirectory())-Number(a.isDirectory())||a.name.localeCompare(b.name))
    const result=[]
    for(const entry of entries){
      if(state.nodes>=maxNodesPerRoot){state.omitted++;continue}
      const path=join(directory,entry.name)
      if(entry.isSymbolicLink())continue
      if(entry.isDirectory()){
        if(ignoredDirectories.has(entry.name)||ignoredAssetDirectories.has(entry.name))continue
        const children=visit(path,depth+1,state)
        if(!children.length)continue
        result.push({name:entry.name,type:'folder',children});state.nodes++
      }else if(entry.isFile()&&relevantFile(entry.name)&&statSync(path).size<512_000){
        result.push({name:entry.name,type:'file'});state.nodes++
      }
    }
    return result
  }
  const tree=[]
  for(const entry of readdirSync(root,{withFileTypes:true}).sort((a,b)=>Number(b.isDirectory())-Number(a.isDirectory())||a.name.localeCompare(b.name))){
    const path=join(root,entry.name)
    if(entry.isDirectory()){
      if(ignoredDirectories.has(entry.name)||ignoredAssetDirectories.has(entry.name))continue
      const state={nodes:0,omitted:0}
      const children=visit(path,1,state)
      if(state.omitted)children.push({name:`… ${state.omitted} itens além do limite visual`,type:'file'})
      if(children.length)tree.push({name:entry.name,type:'folder',children})
    }else if(entry.isFile()&&relevantFile(entry.name)&&statSync(path).size<512_000)tree.push({name:entry.name,type:'file'})
  }
  return tree
}

const trees={}
for(const [id,repository] of Object.entries(repositories)){
  const root=join(reposRoot,repository)
  trees[id]=buildTree(root)
  process.stdout.write(`${id.padEnd(14)} ${String(trees[id].length).padStart(3)} raízes · ${relative(reposRoot,root)}\n`)
}
writeFileSync(output,`${JSON.stringify(trees,null,2)}\n`)
