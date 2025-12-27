const map = {
  "https://":"h~","http://":"p~","www.":"w~",
  ".com":".c",".org":".o",".net":".n"
};

function norm(u){
  return u.trim()
    .replace(/^https?:\/\//,"")
    .replace(/^www\./,"")
    .replace(/\/+$/,"")
    .toLowerCase();
}

function enc(u){
  u = norm(u);
  for(const [k,v] of Object.entries(map)) u = u.replaceAll(k,v);
  return btoa(u).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}

function dec(s){
  let u = atob(s.replace(/-/g,"+").replace(/_/g,"/"));
  for(const [k,v] of Object.entries(map)) u = u.replaceAll(v,k);
  if(!/^https?:\/\//.test(u)) u = "https://" + u;
  return u;
}

function sanitizeRedirectUrl(u){
  try {
    const url = new URL(u);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch (e) {
    // Invalid URL
  }
  return null;
}

function gen(u){
  const short = `${location.origin}${location.pathname}?c=${enc(u)}`;
  console.log("Short:", short);
  return short;
}

(()=>{
  const p = new URLSearchParams(location.search);
  const c = p.get("c");

  if (c) {
    const u = dec(c);
    const safeUrl = sanitizeRedirectUrl(u);
    if (safeUrl) {
      console.log("→ redirect:", safeUrl);
      location.replace(safeUrl);
    } else {
      console.warn("Invalid redirect URL, no redirect performed.");
    }
    return;
  }

  console.warn("No redirect performed (no ?c=).");
})();