import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodoById, updateTodo } from '../../helpers/dataLayer/todosAcess'
import { getUploadUrl } from '../../helpers/dataLayer/attachmentUtils'

// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

const bucketname = process.env.ATTACHMENT_S3_BUCKET

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const todo = await getTodoById(todoId)
    todo.attachmentUrl = `https://${bucketname}.s3.amazonaws.com/${todoId}`
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    
    await updateTodo(todo)

    const url = await getUploadUrl(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
