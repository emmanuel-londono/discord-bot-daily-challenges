import { Client, Events, GatewayIntentBits } from 'discord.js'

// Import necessary libraries
import express from 'express'

// Function to run the app
const runApp = () => {
//   const app = express()

  // Define routes, middleware, etc.
//   app.get('/', (req, res) => {
    
//     res.send('Hello World!')
//   })

  // Start the server
//   const PORT = process.env.PORT || 3000
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
//   })
// }


const token = process.env.TOKEN

    // Create a new client instance
    const client = new Client({ intents: [GatewayIntentBits.Guilds] })

    // When the client is ready, run this code (only once).
    // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
    // It makes some properties non-nullable.
    client.once(Events.ClientReady, readyClient => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`)
    })

    console.log(token)

    // Log in to Discord with your client's token
    client.login(token)


// Export the runApp function
export default runApp
