import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protección por contraseña del panel completo.
 *
 * En local, si no hay credenciales definidas el panel queda abierto para poder
 * trabajar cómodamente. En cualquier despliegue de Vercel el comportamiento es
 * el contrario: sin credenciales se deniega el acceso. La página contiene
 * información económica y personal, así que nunca debe quedar expuesta por
 * haber olvidado configurar una variable de entorno.
 */
export function middleware(request: NextRequest) {
  const usuario = process.env.DASHBOARD_USUARIO;
  const password = process.env.DASHBOARD_PASSWORD;
  const desplegado = Boolean(process.env.VERCEL);

  if (!usuario || !password) {
    if (!desplegado) return NextResponse.next();
    return new NextResponse(
      "Este despliegue no tiene configuradas DASHBOARD_USUARIO y DASHBOARD_PASSWORD.",
      { status: 503 },
    );
  }

  const cabecera = request.headers.get("authorization");

  if (cabecera?.startsWith("Basic ")) {
    const descifrado = atob(cabecera.slice(6));
    const separador = descifrado.indexOf(":");
    const u = descifrado.slice(0, separador);
    const p = descifrado.slice(separador + 1);
    if (u === usuario && p === password) return NextResponse.next();
  }

  return new NextResponse("Acceso restringido", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Casa Mayorga", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
