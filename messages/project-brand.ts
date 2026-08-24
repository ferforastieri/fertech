const logos:Record<string,string>={
  valk:'/assets/projects/trimmed/valk.png',leoplus:'/assets/projects/trimmed/leoplus.png',
  fertec:'/assets/projects/fertech.svg',atacte:'/assets/projects/trimmed/atacte.png',dashboard:'/assets/projects/dashlab.svg',mimelie:'/assets/projects/trimmed/mimelie.png',miraj:'/assets/projects/trimmed/miraj.png',miriam:'/assets/projects/trimmed/miriam.png',familia:'/assets/projects/trimmed/familia.png',
  clienterei:'/assets/projects/clienterei.svg',gabriel:'/assets/projects/trimmed/gabriel.png',imperio:'/assets/projects/trimmed/imperio.png',morelli:'/assets/projects/trimmed/morelli.png',rehau:'/assets/projects/rehau.svg',smart:'/assets/projects/smart.svg','sw-platform':'/assets/projects/trimmed/sw-platform.png',pintor:'/assets/projects/trimmed/pintor.png',recomenda:'/assets/projects/trimmed/recomenda.png',vendedor:'/assets/projects/trimmed/vendedor.png','vendedor-ia':'/assets/projects/trimmed/vendedor-ia.png',parceiro:'/assets/projects/parceiro.svg',
}

export function getProjectLogo(id:string){return logos[id]}
