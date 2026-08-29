import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protección por contraseña del panel completo.
 *
 * Se activa sólo si existen las variables de entorno DASHBOARD_USUARIO y
 * DASHBOARD_PASSWORD. Sin ellas el panel queda abierto, lo que sirve para
 * desarrollo local pero no debería usarse en producción: la página contiene
 * información económica y personal.
 */
export function middleware(request: NextRequest) {
  const usuario = process.env.DASHBOARD_USUARIO;
  const password = process.env.DASHBOARD_PASSWORD;

  if (!usuario || !password) return NextResponse.next();

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
