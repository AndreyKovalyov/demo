import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import ts from 'typescript'

const root = path.resolve('apps/web/src')
const layers = ['shared', 'entities', 'features', 'widgets', 'pages', 'app']
async function files(dir) {
  const result = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      result.push(...(await files(full)))
    } else if (/\.(ts|vue)$/.test(entry.name)) {
      result.push(full)
    }
  }
  return result
}
const problems = []
for (const file of await files(root)) {
  const source = await readFile(file, 'utf8')
  const code = file.endsWith('.vue')
    ? (source.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '')
    : source
  const ast = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true)
  const [fromLayer, fromSlice] = path.relative(root, file).split(path.sep)
  const imports = []
  function collect(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      imports.push(node.moduleSpecifier.text)
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      imports.push(node.arguments[0].text)
    }
    ts.forEachChild(node, collect)
  }
  collect(ast)
  for (const specifier of imports) {
    if (!specifier.startsWith('@/') && !specifier.startsWith('.')) {
      continue
    }
    const target = specifier.startsWith('@/')
      ? path.resolve(root, specifier.slice(2))
      : path.resolve(path.dirname(file), specifier)
    const segments = path.relative(root, target).split(path.sep)
    const [toLayer, toSlice] = segments
    if (!layers.includes(toLayer)) {
      continue
    }
    const sameSlice = fromLayer === toLayer && fromSlice === toSlice
    const sameFlatLayer = fromLayer === toLayer && ['app', 'shared'].includes(fromLayer)
    if (!sameSlice && !sameFlatLayer && layers.indexOf(toLayer) >= layers.indexOf(fromLayer)) {
      problems.push(`${file}: запрещён импорт ${specifier}`)
    }
    if (fromLayer !== toLayer && !['app', 'shared'].includes(toLayer) && segments.length > 2) {
      problems.push(`${file}: импорт через public API: ${specifier}`)
    }
  }
}
if (problems.length) {
  console.error(problems.join('\n'))
  process.exitCode = 1
} else {
  console.log('FSD: направления импортов и public API проверены.')
}
