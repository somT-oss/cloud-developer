import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'


// Changes
import { createTodoGroup } from '../../helpers/todosAcess'
import { createNewTodo } from '../../helpers/todos'

// import { createTodo } from '../../businessLogic/todos'
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    // TODO: Implement creating a new TODO item
    const mainTodo = createNewTodo(newTodo, event)
    const createdTodoItem = await createTodoGroup(mainTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: createdTodoItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
