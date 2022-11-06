const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app=express()
const port=process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
const serviceCollection= client.db("geniousCar").collection("services");
const ordersCollection=client.db("geniousCar").collection("orders");

app.get('/services', async (req, res)=>{
  const query={};
  const cursor=serviceCollection.find(query);
  const services = await cursor.toArray();
  res.send(services);
});

app.get('/services/:id', async (req, res)=>{
  const  id=req.params.id;
  const query={_id: ObjectId(id)};
  const service= await serviceCollection.findOne(query);
  res.send(service);
});

// orders api 

app.get('/orders', async (req, res)=>{
  let query ={};
  if(req.query.email){
    query={email: req.query.email}
  }
  const cursor= ordersCollection.find(query);
  const result=await cursor.toArray()
  res.send(result);
})

app.post('/orders', async (req, res)=>{
  const order=req.body
  const result=await ordersCollection.insertOne(order)
  res.send(result);
});

// delete operation 
app.delete('/orders/:id', async (req, res)=>{
  const id =req.params.id;
  const query={_id: ObjectId(id)};
  const result= await ordersCollection.deleteOne(query);
  res.send(result);
});

// update data 

app.patch('/orders/:id', async (req, res)=>{
  const id = req.params.id;
  const status= req.body.status
  const query={_id: ObjectId(id)}
  const updatedDoc={
    $set:{
      status: status
    }
    
  }
  const result= await ordersCollection.updateOne(query,updatedDoc)
  res.send(result);
})

}
finally{

}
}
run().catch(error=>console.error(error));

app.get('/', (req, res)=>{
    res.send('Genious Car Api is running on the server')
});


app.listen(port,()=>{
    console.log(`genious car serverr running on the ${port}`)
})