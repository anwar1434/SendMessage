const { connectToWhatsApp, sendMessage } = require( "./whatsapp" );
const express = require( "express" );
const mongoose = require( "mongoose" );
const cors = require ("cors");
const app = express();
const port = 3000;

// MongoDB connection string
const mongoDB = "mongodb+srv://abdalrhmanobeid19:5JGwccFDvmnR8Zcz@cluster0.a4mmoaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use( express.json() );
app.use(cors())

app.get( "/sendMessage", ( req, res ) => [
  res.send("aaaa")
])

// API Route to trigger sending a message
app.post( "/sendMessage", async ( req, res ) =>
{
  const { message, students } = req.body;


  // تحقق إذا كانت البيانات مدخلة بشكل صحيح
  if ( !students|| !message ) { return res.status( 400 ).send( "chatId and message are required." );}
  try
  {
    students.forEach( async student =>
    {
      await sendMessage( `963${student.phoneNumber}@s.whatsapp.net`, message );

    } );
    res.status( 200 ).send( "Message sent successfully." );
  } catch ( error )
  {
    console.error( "Error sending message:", error );
    res.status( 500 ).send( "Error sending message." );
  }
} );

// MongoDB connection and server startup
mongoose
  .connect( mongoDB )
  .then( () =>
  {
    console.log( "MongoDB connection successful." );
    app.listen( port, () =>
    {
      console.log( `Server is running on http://localhost:${ port }` );
    } );

    // Start WhatsApp connection
    connectToWhatsApp();
  } )
  .catch( ( error ) =>
  {
    console.error( "MongoDB connection error:", error );
  } );
