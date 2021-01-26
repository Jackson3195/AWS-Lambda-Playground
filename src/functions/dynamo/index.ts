export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'dynamo/{id}'
      }
    },
    {
      http: {
        method: 'post',
        path: 'dynamo'
      }
    },
    {
      http: {
        method: 'patch',
        path: 'dynamo/{id}'
      }
    },
    {
      http: {
        method: 'delete',
        path: 'dynamo/{id}'
      }
    }
  ]
}
