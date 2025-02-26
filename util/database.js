import { MongoClient } from 'mongodb'
const url = 'mongodb+srv://audgns1947:r2ZWgsKbyTKReiia@cluster0.q9b1i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const options = { useNewUrlParser: true }
let connectDB

if (process.env.NODE_ENV === 'development') {
  if (!global._mongo) {
    global._mongo = new MongoClient(url, options).connect()
  }
  connectDB = global._mongo
} else {
  connectDB = new MongoClient(url, options).connect()
}
export { connectDB }
//세팅 코드이므로 이해 필요x
