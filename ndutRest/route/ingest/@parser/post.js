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
    },
    body: {
      type: 'object'
    }
  },
  async handler (request, reply) {
    const parser = await getIngestParser.call(this, request, request.body)
    return await parser.handler.call(this, request, reply)
  }
}
