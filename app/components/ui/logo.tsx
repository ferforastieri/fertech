export function Logo({withName=true}:{withName?:boolean}){return <span className="brand-logo" aria-label="Fertec">
  <span className="brand-mark" aria-hidden="true"><i><b>F</b></i><i><b>F</b></i></span>
  {withName&&<strong>Fertec</strong>}
</span>}
