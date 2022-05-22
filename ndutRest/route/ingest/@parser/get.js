const getIngestParser = require('../../../../lib/get-ingest-parser')

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
    }
  },
  async handler (request, reply) {
    request.query = request.query || {}
    const parser = await getIngestParser.call(this, request, request.query.body)
    return await parser.handler.call(this, request, reply)
  }
}
