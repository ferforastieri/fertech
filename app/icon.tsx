import {ImageResponse} from 'next/og'
import {TechMonogram} from '@/app/components/ui/tech-monogram'

export const size={width:128,height:128}
export const contentType='image/png'

export default function Icon(){
  return new ImageResponse(<div style={{width:128,height:128,display:'flex',alignItems:'center',justifyContent:'center'}}>
    <TechMonogram style={{width:104,height:76,color:'#f5e6d2'}}/>
  </div>,size)
}
