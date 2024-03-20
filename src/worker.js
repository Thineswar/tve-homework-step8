import { parse } from "cookie";
import jwt from '@tsndr/cloudflare-worker-jwt';

export default {
  async fetch(request) {

    function getCookie(name){
      // Get CF_Authorization JWT token stored as cookie
      const cookie = parse(request.headers.get("Cookie") || "");
      if (cookie[name] != null) {
        return jwt.decode(cookie[name]);
      }
    }

    const parsedJwt = getCookie("CF_Authorization")

    const html = `
    <!DOCTYPE html>
    <head>
      <title>Cloudflare TVE Technical Project</title>
    </head>
		<body>
      <header>
        <h1>Cloudflare TVE Technical Project</h1>
      </header>
      <p>
        ${parsedJwt.payload.email} 
        authenticated at ${Date(parsedJwt.payload.iat)} 
        from <a href="https://tunnel.thineswar.com/secure/${parsedJwt.payload.country.toLowerCase()}" >${parsedJwt.payload.country}</a>.
      </p>
		</body>
    <footer> <b> By Thineswar </b> </footer>
    `;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};