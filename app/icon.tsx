import {ImageResponse} from 'next/og'
import {TechMonogram} from '@/app/components/ui/tech-monogram'

export const size={width:128,height:128}
export const contentType='image/png'

export default function Icon(){
  return new ImageResponse(<div style={{width:128,height:128,display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',filter:'drop-shadow(0 2px 1px rgba(24,23,20,.95))'}}>
    <TechMonogram style={{width:104,height:76,color:'#e7dfd1'}}/>
  </div>,size)
}
