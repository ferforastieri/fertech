import {ImageResponse} from 'next/og'
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {siteContent} from '@/messages/site-content'

export const alt=`${siteContent.identity.name} — ${siteContent.metadata.description}`
export const size={width:1200,height:630}
export const contentType='image/png'

export default async function OpenGraphImage(){
  const portraitFile=await readFile(join(process.cwd(),'public/assets/fernando.png'))
  const portrait=portraitFile.buffer.slice(portraitFile.byteOffset,portraitFile.byteOffset+portraitFile.byteLength) as ArrayBuffer
  return new ImageResponse(<div style={{display:'flex',position:'relative',width:'100%',height:'100%',overflow:'hidden',background:'#111b17',color:'#f1eadf',fontFamily:'sans-serif'}}>
  <img src={portrait as unknown as string} alt="" width="630" height="630" style={{position:'absolute',left:285,top:0,width:630,height:630,objectFit:'cover'}}/>
  <div style={{display:'flex',position:'absolute',inset:0,background:'linear-gradient(90deg,#111b17 0%,rgba(17,27,23,.96) 25%,rgba(17,27,23,.12) 52%,rgba(17,27,23,.92) 77%,#111b17 100%)'}}/>
  <div style={{display:'flex',position:'absolute',inset:0,opacity:.1,backgroundImage:'linear-gradient(#f1eadf 1px, transparent 1px), linear-gradient(90deg,#f1eadf 1px,transparent 1px)',backgroundSize:'72px 72px'}}/>

  <div style={{display:'flex',position:'absolute',left:64,top:58,alignItems:'center',gap:18}}>
    <svg width="80" height="58" viewBox="0 0 72 52" fill="none"><path fill="currentColor" d="M4 5h29v9H15v9h15v9H15v15H4V5Zm35 0h29v9H50v9h15v9H50v15H39V5Z"/><path d="M10 5V1M25 27h8v12h6M45 47v4M59 9h9V2" stroke="currentColor" strokeWidth="1.5"/></svg>
    <span style={{fontSize:20,letterSpacing:5,textTransform:'uppercase',opacity:.7}}>{siteContent.identity.brand}</span>
  </div>

  <div style={{display:'flex',position:'absolute',left:64,bottom:54,width:205,flexDirection:'column'}}>
    <span style={{fontSize:13,letterSpacing:2,textTransform:'uppercase',color:'#8fd6b3'}}>Portfólio profissional</span>
    <h1 style={{margin:'12px 0 12px',fontSize:43,lineHeight:.95,letterSpacing:-2.5}}>{siteContent.identity.name}</h1>
    <p style={{margin:0,fontSize:19,lineHeight:1.25,opacity:.82}}>{siteContent.identity.jobTitle}</p>
  </div>

  <div style={{display:'flex',position:'absolute',right:58,top:58,width:220,justifyContent:'flex-end',fontSize:19,letterSpacing:1,opacity:.7}}>fer.tec.br</div>
  <div style={{display:'flex',position:'absolute',right:58,bottom:62,width:225,flexDirection:'column',gap:13}}>
    {['Design systems','Infraestrutura','Experiências digitais'].map(item=><div key={item} style={{display:'flex',alignItems:'center',gap:10,fontSize:19}}><span style={{display:'flex',width:7,height:7,borderRadius:999,background:'#8fd6b3'}}/>{item}</div>)}
  </div>
</div>,size)}
