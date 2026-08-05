import { ImageResponse } from 'next/og'

export const size={width:64,height:64}
export const contentType='image/png'

export default function Icon(){return new ImageResponse(<div style={{width:'64px',height:'64px',display:'flex',alignItems:'center',justifyContent:'center',background:'transparent'}}><div style={{width:'50px',height:'40px',display:'flex',position:'relative'}}><div style={{width:'25px',height:'38px',display:'flex',alignItems:'center',justifyContent:'center',border:'3px solid #181714',borderRadius:'7px 1px 1px 5px',transform:'skewY(8deg)',color:'#181714',fontSize:'23px',fontFamily:'serif'}}>F</div><div style={{width:'25px',height:'38px',display:'flex',alignItems:'center',justifyContent:'center',border:'3px solid #181714',borderRadius:'1px 7px 5px 1px',transform:'skewY(-8deg)',color:'#181714',fontSize:'23px',fontFamily:'serif'}}>F</div></div></div>,size)}
