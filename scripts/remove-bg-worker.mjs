// Worker isolado de remoção de fundo.
//
// Roda num processo `node` separado de propósito: o @imgly/background-removal-node
// (onnxruntime) e o `sharp` carregam bibliotecas nativas que CONFLITAM no Windows
// quando importadas no mesmo processo (ERR_DLOPEN_FAILED / segfault). Aqui só o
// onnx é carregado; o sharp fica no processo pai.
//
//   node scripts/remove-bg-worker.mjs <entrada.png> <saida.png> [small|medium]

import { removeBackground } from "@imgly/background-removal-node";
import { readFile, writeFile } from "node:fs/promises";

const [, , inPath, outPath, model = "medium"] = process.argv;

if (!inPath || !outPath) {
  console.error("uso: node remove-bg-worker.mjs <entrada> <saida> [model]");
  process.exit(2);
}

const entrada = await readFile(inPath);
const blob = await removeBackground(new Blob([entrada], { type: "image/png" }), {
  model,
  output: { format: "image/png" },
});
await writeFile(outPath, Buffer.from(await blob.arrayBuffer()));
