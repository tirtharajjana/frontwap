const getCookie = (cookieName)=>{
  const cookie = document.cookie;
  const allCookie = cookie.split(";");
  let cookieData = "";
  for(let data of allCookie)
  {
    let cookies = data.split("=");
    if(cookies[0].trim() == cookieName)
    {
      cookieData = cookies[1];
      break;
    }
  }
  return cookieData;
}
