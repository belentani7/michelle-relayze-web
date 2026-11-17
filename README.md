# michelle-relayze-web

<p><img src="https://img.shields.io/badge/dependabot-enabled-025e8c?logo=dependabot&style=flat-square" alt="Dependabot">
  <img src="https://img.shields.io/website?url=https%3A%2F%2Fbelentani7.github.io%2Fmichelle-relayze-web%2F&label=demo&style=flat-square&color=2bb673" alt="demo live"></p>

Web personal de Michelle Relayze.

## Qué es

Un sitio de presentación profesional: quién es, qué hace y cómo contactar. Diseño cuidado y
carga rápida.

En línea: <https://michelle-relayze-web.vercel.app>

## Nota sobre el repositorio

Es la web de una persona distinta del titular de la cuenta. Se aloja aquí por comodidad de
despliegue; **no forma parte del universo artístico Belentani** y no debería enlazarse a él.

## Licencia

Sin licencia declarada.
---

## Ficha del proyecto

| Campo | Valor |
|---|---|
| Autor | Belentani / NOIACORE |
| Época de desarrollo | 2026 |
| Contacto | [belentani7studio@proton.me](mailto:belentani7studio@proton.me) |
| Código | https://github.com/belentani7/michelle-relayze-web |
| Demo desplegada | https://belentani7.github.io/michelle-relayze-web/ |

Quality baseline: CI + Dependabot + CodeQL + reglas de agentes por [premium-factory](https://github.com/belentani7/premium-factory-api).


## Producto
Véase `plataforma/OFERTA.md`, `plataforma/precios.json`, `plataforma/ONEPAGER.md`.

## Que es

Web oficial de Michelle Relayze — portfolio y presencia artística

## Como se ejecuta

```bash
python -m http.server 8080
```

Abre `http://127.0.0.1:8080/`. Sin build: HTML estatico.

## Verificacion

```bash
node --test tests/
```

El test de humo comprueba que el arbol esperado existe y que el HTML o el paquete no esta roto.

## Estructura

```
404.html
AGENTS.md
BIBLIA.md
CHANGELOG.md
CODEOWNERS
CODE_OF_CONDUCT.md
CONTRIBUTING.md
LICENSE
README.md
SECURITY.md
SECURITY_AUDIT_PROTOCOL.md
accesibilidad.html
```

## Entorno

- Node.js 20+ o Python 3.11+ segun el stack detectado.
- Windows 10/11, PowerShell 5.1 o bash.

## Licencia

MIT. Ver `LICENSE`.
