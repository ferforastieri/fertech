import { ImageResponse } from 'next/og'

export const size={width:64,height:64}
export const contentType='image/png'

export default function Icon(){return new ImageResponse(<div style={{width:'64px',height:'64px',display:'flex',alignItems:'center',justifyContent:'center',background:'#181714'}}><div style={{width:'46px',height:'36px',display:'flex',position:'relative'}}><div style={{width:'23px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #e7dfd1',borderRadius:'7px 1px 1px 5px',transform:'skewY(8deg)',color:'#e7dfd1',fontSize:'21px',fontFamily:'serif'}}>F</div><div style={{width:'23px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #e7dfd1',borderRadius:'1px 7px 5px 1px',transform:'skewY(-8deg)',color:'#e7dfd1',fontSize:'21px',fontFamily:'serif'}}>F</div></div></div>,size)}
