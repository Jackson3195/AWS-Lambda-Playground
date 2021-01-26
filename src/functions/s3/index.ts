export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 's3'
      }
    },
    {
      http: {
        method: 'patch',
        path: 's3/{key}'
      }
    },
    {
      http: {
        method: 'delete',
        path: 's3/{key}'
      }
    }
  ]
}
