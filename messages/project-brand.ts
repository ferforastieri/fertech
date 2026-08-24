const logos:Record<string,string>={
  valk:'/assets/projects/valk.png',leoplus:'/assets/projects/leoplus.png',
  fertec:'/assets/projects/fertech.svg',atacte:'/assets/projects/atacte.png',dashboard:'/assets/projects/dashlab.svg',mimelie:'/assets/projects/mimelie.png',miraj:'/assets/projects/miraj.png',miriam:'/assets/projects/miriam.png',familia:'/assets/projects/familia.png',
  clienterei:'/assets/projects/clienterei.svg',gabriel:'/assets/projects/gabriel.png',imperio:'/assets/projects/imperio.png',morelli:'/assets/projects/morelli.png',rehau:'/assets/projects/rehau.svg',smart:'/assets/projects/smart.svg','sw-platform':'/assets/projects/sw-platform.png',pintor:'/assets/projects/pintor.png',recomenda:'/assets/projects/recomenda.png',vendedor:'/assets/projects/vendedor.png','vendedor-ia':'/assets/projects/vendedor-ia.png',parceiro:'/assets/projects/parceiro.svg',
}

export function getProjectLogo(id:string){return logos[id]}
