const fs = require('fs')
const path = require('path')
const yaml = require('yamljs')
const dates = require('../meta/dates.json')
const colors = require('../meta/colors.json')
const releases = require('../meta/releases.json')
const readmes = require('../meta/readmes.json')
const apps = []

fs.readdirSync(path.join(__dirname, '../apps'))
.filter(filename => {
  return fs.statSync(path.join(__dirname, `../apps/${filename}`)).isDirectory()
})
.forEach(slug => {
  const yamlFile = path.join(__dirname, `../apps/${slug}/${slug}.yml`)
  const app = Object.assign(
    {slug: slug},
    yaml.load(yamlFile),
    {
      icon: `${slug}-icon.png`,
      icon32: `${slug}-icon-32.png`,
      icon64: `${slug}-icon-64.png`,
      icon128: `${slug}-icon-128.png`,
      date: dates[slug],
      iconColors: colors[slug].palette
    },
    releases[slug],
    readmes[slug]
  )

  app.goodColorOnWhite = app.goodColorOnWhite || colors[slug].goodColorOnWhite
  app.goodColorOnBlack = app.goodColorOnBlack || colors[slug].goodColorOnBlack
  app.faintColorOnWhite = app.faintColorOnWhite || colors[slug].faintColorOnWhite

  apps.push(app)
})

fs.writeFileSync(
  path.join(__dirname, '../index.json'),
  JSON.stringify(apps, null, 2)
)
