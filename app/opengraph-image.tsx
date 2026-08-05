import{ImageResponse}from'next/og'
export const dynamic='force-static'
export const size={width:1200,height:630}
export const contentType='image/png'
export default function Image(){return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:72,background:'#11110f',color:'#f2f0ea',fontFamily:'sans-serif'}}><div style={{display:'flex',fontSize:25}}>FERNANDO FORASTIERI</div><div style={{display:'flex',fontSize:76,lineHeight:1.04,letterSpacing:'-4px'}}>Engenharia com intenção.<br/>Design com propósito.</div><div style={{display:'flex',fontSize:23,color:'#b9ff62'}}>Software engineer · Product builder</div></div>,size)}
