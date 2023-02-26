const express = require('express');
const cors = require('cors');
require("colors")
const jwt = require('jsonwebtoken')
// const { query } = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { urlencoded } = require('express');
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


console.log(process.env.DB_USER)
// function verifyjwt(req, res, next) {

//   const authHeader = (req.headers.authorization)
//   if (!authHeader) {
//     return res.status(401).send({ messeage: 'unauthorisedd access' })
//   }
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({ message: 'forbidden access' })
//     }
//     req.decoded = decoded;
//     next();
//   })
// }




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ploggwb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// async function run() {
//   try {
//     const visaServices = client.db('hconsultant').collection('visacategories');
//     const reviewsCollections = client.db('hconsultant').collection('reviews');

//     app.post('/jwt', (req, res) => {
//       const user = req.body;
//       const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
//       res.send({ token })
//       console.log(user)
//     })
//     app.get('/visacategory', async (req, res) => {
//       const query = {}
//       const cursor = visaServices.find(query);
//       const visaCat = await cursor.limit(3).toArray();
//       res.send(visaCat)
//     })
//     app.get('/visacategories', async (req, res) => {
//       const query = {}
//       const cursor = visaServices.find(query);
//       const visaCat = await cursor.toArray();
//       res.send(visaCat)
//     })
//     app.get('/visacategories/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const visaDetails = await visaServices.findOne(query);
//       res.send(visaDetails)
//     })
//    
app.get('/reviews', async (req, res) => {
  // const decoded = req.decoded;
  // console.log('insert api', decoded);
  // if (decoded.email !== req.query.email) {
  //   return res.status(403).send({ message: 'unauthorized access' })
  // }
  let query = {}
  if (req.query.email) {
    query = { email: req.query.email }
  }
  const cursor = reviewsCollections.find(query);
  const userreview = await cursor.toArray();
  res.send(userreview)
  console.log(req.query)
})

//     app.post('/reviews', async (req, res) => {
//       const reviews = req.body;
//       const result = await reviewsCollections.insertOne(reviews);
//       res.send(result)
//     })
app.patch('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  const message = req.body.message
  const query = { _id: new ObjectId(id) };
  const updatemsg = {
    $set: {
      message: message
    }
  }
  const result = await reviewsCollections.updateOne(query, updatemsg);
  res.send(result)
})
app.delete('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await reviewsCollections.deleteOne(query);
  res.send(result)
})



async function DBConnect() {
  try {
    await client.connect()
    console.log('database connected'.red)
  } catch (error) {
    console.log(error.name.red, error.message.orange)
  }
}
DBConnect()

const visaServices = client.db('hconsultant').collection('visacategories');
const reviewsCollections = client.db('hconsultant').collection('reviews');

app.get('/reviews', async (req, res) => {
  // const decoded = req.decoded;
  // console.log('insert api', decoded);
  // if (decoded.email !== req.query.email) {
  //   return res.status(403).send({ message: 'unauthorized access' })
  // }
  let query = {}
  if (req.query.email) {
    query = { email: req.query.email }
  }
  const cursor = reviewsCollections.find(query);
  const userreview = await cursor.toArray();
  res.send(userreview)
  console.log(req.query)
})
//add Reviews

app.post('/reviews', async (req, res) => {
  const reviews = req.body;
  const result = await reviewsCollections.insertOne(reviews);
  res.send(result)
})

//add service or categories

app.post("/visacategories", async (req, res) => {
  try {
    const result = await visaServices.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.title} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the category",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});
app.get("/visacategories", async (req, res) => {
  try {
    const cursor = visaServices.find({});
    const visaCat = await cursor.toArray();
    res.send({
      success: true,
      message: `Successfully got `,
      data: visaCat
    });

  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});
app.get("/visacategoriesspecific", async (req, res) => {
  try {
    const cursor = visaServices.find({});
    const visaCat = await cursor.limit(3).toArray();
    res.send({
      success: true,
      message: `Successfully got `,
      data: visaCat
    });

  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});
app.get("/visacategories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const VisaCatOne = await visaServices.findOne({ _id: new ObjectId(id) });

    if (VisaCatOne?._id) {
      res.send({
        success: true,
        message: `Successfully got `,
        data: VisaCatOne
      });
    } else {
      res.send({
        success: false,
        error: `Couldn't connect ${VisaCatOne.title}`,
      });
    }

  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// app.get('/catreviews', async (req, res) => {
app.get('/catreviews', async (req, res) => {
  let { query } = {}
  if (req.query.categories) {
    query = { categories: req.query.categories }
  }

  const cursor = reviewsCollections.find(query);
  const result = await cursor.toArray();
  res.send(result)
  console.log(result)
})

//     if (categories) {
//       res.send({
//         success: true,
//         message: `category  found ${categories} `,
//         data: catreviewsAll
//       });
//     } else {
//       res.send({
//         success: false,
//         error: `Couldn't connect ${categories.title}`,
//       });
//     }

//   } catch (error) {
//     console.log(error.name.bgRed, error.message.bold);
//     res.send({
//       success: false,
//       error: error.message,
//     });
//   }
// });
// app.patch("/reviews/:id", async (req, res) => {
//   const { id } = req.params;
//   const { email } = req.query

//   try {
//     const result = await reviewsCollections.updateOne({ _id: ObjectId(id) }, { email }, { $set: req.body });

//     if (result.matchedCount) {
//       res.send({
//         success: true,
//         message: `successfully updated ${req.body.name}`,
//       });
//     } else {
//       res.send({
//         success: false,
//         error: "Couldn't update  the product",
//       });
//     }
//   } catch (error) {
//     res.send({
//       success: false,
//       error: error.message,
//     });
//   }
// });

app.get('/', (req, res) => {
  res.send('express server is running')
})

app.listen(port, () => {
  client.connect((err) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log('connected to client')
    }
  }
  )
  console.log(`H Consultancy Running On ${port}`.cyan.bold)
})