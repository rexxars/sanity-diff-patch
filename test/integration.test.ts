/* eslint-disable no-sync, import/no-dynamic-require, max-nested-callbacks */
import fs from 'fs'
import path from 'path'
import PQueue from 'p-queue'
import SanityClient from '@sanity/client'
import {diffPatch} from '../src'

function omitIgnored(obj: {[key: string]: any}): {[key: string]: any} {
  const {_type, _createdAt, _updatedAt, _rev, ...rest} = obj
  return rest
}

/* eslint-disable no-process-env */
const projectId = process.env.SANITY_TEST_PROJECT_ID || ''
const dataset = process.env.SANITY_TEST_DATASET || ''
const token = process.env.SANITY_TEST_TOKEN || ''
/* eslint-enable no-process-env */

const queue = new PQueue({concurrency: 4})
const describeIt = projectId && dataset && token ? describe : describe.skip

interface FixturePair {
  input: any
  output: any
}

type Fixture = JsonFixture | JsFixture

interface JsonFixture {
  file: string
  name?: string
  fixture: FixturePair
}

interface JsFixture {
  file: string
  name?: string
  fixture: {[key: string]: any}
}

describeIt('integration tests', () => {
  const client = new SanityClient({projectId, dataset, token, useCdn: false})
  const fixturesDir = path.join(__dirname, 'fixtures')
  const jsonFixturesDir = path.join(fixturesDir, 'integration')

  const jsonFixtures: Fixture[] = fs
    .readdirSync(jsonFixturesDir)
    .filter(file => /^\d+\.json$/.test(file))
    .map(file => ({file, fixture: require(path.join(jsonFixturesDir, file))}))

  const jsFixtures: Fixture[] = fs
    .readdirSync(fixturesDir)
    .filter(file => /\.ts$/.test(file))
    .map(file => ({file, fixture: require(path.join(fixturesDir, file))}))
    .reduce((acc: Fixture[], item: JsFixture) => {
      const entries = Object.keys(item.fixture)
      return acc.concat(
        entries.reduce((set: Fixture[], key: string) => {
          for (let x = 0; x < entries.length; x++) {
            const input = item.fixture[key]
            const output = item.fixture[entries[x]]
            const name = `${item.file} (${key} vs ${entries[x]})`
            set.push({file: item.file, name, fixture: {input, output}})
          }

          return set
        }, [])
      )
    }, [])

  const fixtures: Fixture[] = [...jsonFixtures, ...jsFixtures]

  fixtures.forEach(fix =>
    test(fix.name || fix.file, async () => {
      const _type = 'test'
      const _id = `fix-${fix.name || fix.file}`
        .replace(/[^a-z0-9-]+/gi, '-')
        .replace(/(^-|-$)/g, '')

      const input = Object.assign({}, fix.fixture.input, {_id, _type})
      const output = Object.assign({}, fix.fixture.output, {_id, _type})
      const diff = diffPatch(input, output)

      const trx = client
        .transaction()
        .createOrReplace(input)
        .serialize()

      const result = await queue.add(() =>
        client.transaction(trx.concat(diff)).commit({visibility: 'async', returnDocuments: true})
      )

      expect(omitIgnored(result[0])).toEqual(omitIgnored(output))
    })
  )
})
