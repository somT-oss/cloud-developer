// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as uuid from 'uuid'
import { getUserId } from '../../lambda/utils';
import { TodoItem } from '../../models/TodoItem';
// import * as createError from 'http-errors'

import { CreateTodoRequest } from "../../requests/CreateTodoRequest";

// TODO: Implement businessLogic
export function createNewTodo(todoRequest: CreateTodoRequest, event: APIGatewayProxyEvent): TodoItem {
    const todoId = uuid.v4()
    const todoItem = {
      todoId: todoId,
      userId: getUserId(event),
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: '',
      ...todoRequest
    }

    return todoItem as TodoItem
}

