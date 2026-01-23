import fs from 'node:fs'

const path = './public/openapi.json'
const doc = JSON.parse(fs.readFileSync(path, 'utf8'))

function fixRefs(obj) {
  if (Array.isArray(obj)) return obj.forEach(fixRefs)
  if (!obj || typeof obj !== 'object') return

  for (const key of Object.keys(obj)) {
    if (key === '$ref' && typeof obj[key] === 'string') {
      // remove everything after ":" only for components/schemas refs
      obj[key] = obj[key].replace(
        /(#[/](components)[/](schemas)[/][^:]+):.*/,
        '$1',
      )
    } else {
      fixRefs(obj[key])
    }
  }
}

fixRefs(doc)

fs.writeFileSync('./public/openapi.fixed.json', JSON.stringify(doc, null, 2))
console.log('✅ Saved: public/openapi.fixed.json')
