import {ImageResponse} from 'next/og'

export const size={width:128,height:128}
export const contentType='image/png'

export default function Icon(){
  return new ImageResponse(<div style={{width:128,height:128,display:'flex',alignItems:'center',justifyContent:'center',background:'transparent'}}>
    <div style={{width:96,height:106,display:'flex',flexDirection:'column',gap:7,padding:10,border:'7px solid #e7dfd1',borderRadius:15,background:'#181714',filter:'drop-shadow(0 5px 4px rgba(0,0,0,.35))'}}>
      {[0,1,2].map(row=><div key={row} style={{height:24,display:'flex',alignItems:'center',padding:'0 8px',border:'3px solid #e7dfd1',borderRadius:4}}><div style={{width:38,height:3,background:'#e7dfd1',opacity:.48}}/><div style={{width:8,height:8,marginLeft:'auto',borderRadius:999,background:row===2?'#f0c86f':'#9cffbe'}}/></div>)}
    </div>
  </div>,size)
}
