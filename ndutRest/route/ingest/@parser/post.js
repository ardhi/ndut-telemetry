module.exports = {
  schema: {
    description: 'Ingest unstructured data with pre-defined or custom parser ',
    tags: ['Telemetry'],
    params: {
      type: 'object',
      properties: {
        parser: {
          type: 'string',
          description: 'Type of parser to use'
        }
      },
      required: ['parser']
    },
    body: {
      type: 'object'
    }
  },
  async handler (request, reply) {
    const { _, fs, iterateNduts } = this.ndut.helper
    if (_.isEmpty(request.body)) throw this.Boom.badData('badData', { ndut: 'telemetry' })
    let parserFile
    await iterateNduts(async function (cfg) {
      const file = `${cfg.dir}/ndutTelemetry/parser/${(request.params.parser || '').toLowerCase()}.js`
      if (!parserFile && fs.existsSync(file)) parserFile = file
    })
    if (!parserFile) throw this.Boom.notFound('unknownParser', { ndut: 'telemetry' })
    let parser = require(parserFile)
    if (_.isFunction(parser)) parser = { handler: parser }
    if (!parser.handler) throw this.Boom.internal('noHandlerFound', { ndut: 'telemetry' })
    if (parser.key && request.query.key !== parser.key) throw this.Boom.unauthorized('invalidKey', { ndut: 'telemetry' })
    return await parser.handler.call(this, request, reply)
  }
}
