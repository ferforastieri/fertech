import { ImageResponse } from 'next/og'

export const size={width:128,height:128}
export const contentType='image/png'

export default function Icon(){return new ImageResponse(<div style={{width:'128px',height:'128px',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0)'}}><div style={{width:'116px',height:'88px',display:'flex',position:'relative',filter:'drop-shadow(0 3px 2px rgba(0,0,0,.18))'}}><div style={{width:'58px',height:'84px',display:'flex',alignItems:'center',justifyContent:'center',border:'5px solid #181714',background:'#e7dfd1',borderRadius:'14px 2px 3px 10px',transform:'skewY(8deg)',color:'#181714',fontSize:'49px',fontFamily:'serif'}}>F</div><div style={{width:'58px',height:'84px',display:'flex',alignItems:'center',justifyContent:'center',border:'5px solid #181714',background:'#e7dfd1',borderRadius:'2px 14px 10px 3px',transform:'skewY(-8deg)',color:'#181714',fontSize:'49px',fontFamily:'serif'}}>F</div><div style={{position:'absolute',top:'5px',bottom:'2px',left:'56px',width:'4px',borderRadius:'4px',background:'#181714'}}/></div></div>,size)}
