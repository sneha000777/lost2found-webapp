const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); // Import the cors package
const path = require('path'); // Import the path module

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors()); // Use the cors middleware
app.use(bodyParser.json());
// Function to read items from items.json
function getItemsFromFile() {
    const filePath = path.join(__dirname, '../src/items.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  
  // Function to write items to items.json
  function writeItemsToFile(items) {
    const filePath = path.join(__dirname, '../src/items.json');
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
  }

  app.get('/api/items', (req, res) => {
    const items = getItemsFromFile();
    res.json(items);
  });
  
  // Add item endpoint
  app.post('/api/items', (req, res) => {
    const newItem = req.body;
    const items = getItemsFromFile();
    newItem.id = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    items.push(newItem);
    writeItemsToFile(items);
    res.json({ message: 'Item added successfully', newItem });
  });
  
  // Edit item endpoint
  app.put('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedItem = req.body;
    const items = getItemsFromFile();
    const index = items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem };
      writeItemsToFile(items);
      res.json({ message: 'Item updated successfully', updatedItem });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
    // Endpoint to add a new item
    app.post('/api/add-item-endpoint', (req, res) => {
        const newItem = req.body;
    
        // Read the existing items from items.json
        const filePath = path.join(__dirname, '../src/items.json');
        const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
        // Assign a unique ID to the new item
        newItem.id = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    
        // Add the new item to the existing items
        items.push(newItem);
    
        // Write the updated items back to items.json
        fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
    
        res.json({ message: 'Item added successfully', newItem });
    });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });