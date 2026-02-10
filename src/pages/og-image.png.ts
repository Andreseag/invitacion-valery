import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  // 1. Cargar fuentes
  const playfairPath = path.resolve(
    process.cwd(),
    "src/fonts/PlayfairDisplay-Italic.ttf",
  );
  const montserratPath = path.resolve(
    process.cwd(),
    "src/fonts/Montserrat-Light.ttf",
  );
  const fontPlayfair = fs.readFileSync(playfairPath);
  const fontMontserrat = fs.readFileSync(montserratPath);

  // 2. Cargar la FOTO
  const imagePath = path.resolve(process.cwd(), "public/image-1.jpeg");
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

  // 3. Generar el diseño
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#FFF9F5",
          backgroundImage:
            "radial-gradient(circle at 75% 50%, #FFD1DC 0%, #FFF9F5 100%)",
        },
        children: [
          // LADO IZQUIERDO: FOTO (Ahora va primero)
          {
            type: "div",
            props: {
              style: {
                width: "40%",
                height: "100%",
                display: "flex",
              },
              children: [
                {
                  type: "img",
                  props: {
                    src: base64Image,
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  },
                },
              ],
            },
          },
          // LADO DERECHO: TEXTO
          {
            type: "div",
            props: {
              style: {
                width: "60%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 30,
                      color: "#5c4d42",
                      marginBottom: 10,
                      fontFamily: "Montserrat",
                    },
                    children: "RESERVA ESTE DÍA",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 85,
                      color: "#D4A5A5",
                      marginBottom: 5,
                      fontFamily: "Playfair Display",
                    },
                    children: "Valery García",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 40,
                      color: "#5c4d42",
                      marginBottom: 30,
                      fontFamily: "Montserrat",
                    },
                    children: "28 . 02 . 2026",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 28,
                      color: "#7d4e57", // Tu azul favorito
                      letterSpacing: "0.1em",
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                    },
                    children: "#Mis15ConValery",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Playfair Display",
          data: fontPlayfair,
          weight: 400,
          style: "italic",
        },
        {
          name: "Montserrat",
          data: fontMontserrat,
          weight: 300,
          style: "normal",
        },
      ],
    },
  );

  // 4. Render y Respuesta
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  const pngData = resvg.render().asPng();
  return new Response(new Uint8Array(pngData), {
    headers: { "Content-Type": "image/png" },
  });
}
