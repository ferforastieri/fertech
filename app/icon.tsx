import { ImageResponse } from 'next/og'

export const size={width:128,height:128}
export const contentType='image/png'

export default function Icon(){return new ImageResponse(<div style={{width:'128px',height:'128px',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0)'}}><div style={{width:'124px',height:'102px',display:'flex',position:'relative',filter:'drop-shadow(0 3px 3px rgba(0,0,0,.32))'}}><div style={{width:'62px',height:'96px',display:'flex',alignItems:'center',justifyContent:'center',border:'6px solid #e7dfd1',background:'#181714',borderRadius:'15px 2px 3px 11px',transform:'skewY(8deg)',color:'#e7dfd1',fontSize:'56px',fontFamily:'serif'}}>F</div><div style={{width:'62px',height:'96px',display:'flex',alignItems:'center',justifyContent:'center',border:'6px solid #e7dfd1',background:'#181714',borderRadius:'2px 15px 11px 3px',transform:'skewY(-8deg)',color:'#e7dfd1',fontSize:'56px',fontFamily:'serif'}}>F</div><div style={{position:'absolute',top:'5px',bottom:'2px',left:'60px',width:'4px',borderRadius:'4px',background:'#e7dfd1'}}/></div></div>,size)}
