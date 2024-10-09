
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();
const Customer = require('./models/customer');


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


function showMenu() {
  console.log("\nWhat would you like to do?\n");
  console.log("1. Create a customer");
  console.log("2. View all customers");
  console.log("3. Update a customer");
  console.log("4. Delete a customer");
  console.log("5. Quit");
}


async function createCustomer() {
  const name = prompt("Enter customer name: ");
  const age = parseInt(prompt("Enter customer age: "));

  const customer = new Customer({ name, age });
  await customer.save();
  console.log(`Customer '${name}' created successfully!`);
}


async function viewCustomers() {
  const customers = await Customer.find({});
  if (customers.length === 0) {
    console.log("No customers available.");
  } else {
    console.log("\nCustomer List:");
    customers.forEach(customer => {
      console.log(`ID: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
    });
  }
}


async function updateCustomer() {
  await viewCustomers();
  const customerId = prompt("\nEnter the ID of the customer to update: ");
  
  const customer = await Customer.findById(customerId);
  if (customer) {
    const newName = prompt(`Enter new name for customer '${customer.name}': `);
    const newAge = parseInt(prompt(`Enter new age for customer '${customer.name}': `));
    customer.name = newName;
    customer.age = newAge;
    await customer.save();
    console.log("Customer updated successfully!");
  } else {
    console.log("Customer not found.");
  }
}


async function deleteCustomer() {
  await viewCustomers();
  const customerId = prompt("\nEnter the ID of the customer to delete: ");
  
  const result = await Customer.findByIdAndDelete(customerId);
  if (result) {
    console.log(`Customer '${result.name}' deleted successfully.`);
  } else {
    console.log("Customer not found.");
  }
}


async function mainMenu() {
  let running = true;
  console.log("Welcome to the CRM");

  while (running) {
    showMenu();
    const choice = prompt("Number of action to run: ");
    
    switch (choice) {
      case '1':
        await createCustomer();
        break;
      case '2':
        await viewCustomers();
        break;
      case '3':
        await updateCustomer();
        break;
      case '4':
        await deleteCustomer();
        break;
      case '5':
        console.log("Exiting the application...");
        running = false;
        break;
      default:
        console.log("Invalid choice, please choose a valid option.");
    }
  }

  mongoose.disconnect();
}

mainMenu();