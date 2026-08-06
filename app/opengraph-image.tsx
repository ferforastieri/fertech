import {ImageResponse} from 'next/og'
import {siteContent} from '@/messages/site-content'

export const alt=`${siteContent.identity.name} — ${siteContent.metadata.description}`
export const size={width:1200,height:630}
export const contentType='image/png'

export default function OpenGraphImage(){return new ImageResponse(<div style={{display:'flex',position:'relative',width:'100%',height:'100%',overflow:'hidden',alignItems:'flex-end',padding:'68px',background:'#04140a',color:'#f6fff8',fontFamily:'sans-serif'}}>
  <div style={{display:'flex',position:'absolute',inset:0,opacity:.18,backgroundImage:'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg,#00ff41 1px,transparent 1px)',backgroundSize:'72px 72px'}}/>
  <svg width="136" height="98" viewBox="0 0 72 52" fill="none" style={{position:'absolute',top:62,left:66}}><path fill="currentColor" d="M4 5h29v9H15v9h15v9H15v15H4V5Zm35 0h29v9H50v9h15v9H50v15H39V5Z"/><path d="M10 5V1M25 27h8v12h6M45 47v4M59 9h9V2" stroke="currentColor" strokeWidth="1.5"/></svg>
  <div style={{display:'flex',flexDirection:'column',maxWidth:950}}><span style={{fontSize:22,letterSpacing:6,textTransform:'uppercase',opacity:.58}}>{siteContent.identity.brand}</span><h1 style={{margin:'18px 0 12px',fontSize:88,lineHeight:.9,letterSpacing:-5}}>{siteContent.identity.name}</h1><p style={{margin:0,maxWidth:770,fontSize:25,lineHeight:1.45,opacity:.72}}>{siteContent.metadata.description}</p></div>
</div>,size)}
