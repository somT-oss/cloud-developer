import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
// import { TodoUpdate } from '../models/TodoUpdate';

import { TodoItem } from "../models/TodoItem"
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
const todoTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()

// // TODO: Implement the dataLayer logic
export async function createTodoGroup(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todoTable,
      Item: todo
    }).promise()

    return todo
  }

export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
  const result = await docClient.query({
    TableName:  todoTable,
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId'
    },
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()

  const items = result.Items
  return items as TodoItem[]

}

export async function updateTodo(todo: TodoItem): Promise<TodoItem> {
  const result = await docClient.update({
    TableName:  todoTable,
    Key: {
      userId: todo.userId,
      todoId: todo.todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': todo.attachmentUrl
    }
  }).promise()

  return result.Attributes as TodoItem
}

// name, dueDate and done.
export async function updateTodoItem(todoId: string, userId: string, updatedTodo: UpdateTodoRequest): Promise<void > {
  await docClient.update({
    TableName:  todoTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done', 
    ExpressionAttributeValues: {
      ':name': updatedTodo.name,
      ':dueDate': updatedTodo.dueDate,
      ':done': updatedTodo.done
    },
    ExpressionAttributeNames: {
      "#name": 'name'
    }
  }).promise()
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  await docClient.delete({
    TableName:  todoTable,
    Key: {
      todoId,
      userId
    }
  }).promise()

}

export async function getTodoById(todoId: string): Promise<TodoItem> {
  const result = await docClient.query({
    TableName:  todoTable,
    IndexName: index,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId
    }
  }).promise()

  const items = result.Items
  if (items.length !== 0)
    return items[0] as TodoItem

}

function createDynamoDBClient() {
if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
    })
}

return new XAWS.DynamoDB.DocumentClient()

}