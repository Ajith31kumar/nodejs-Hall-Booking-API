const express = require('express');
const { request, response } = require('express');
const dotenv = require('dotenv');

const app = express(); // Instantiate the express app
app.use(express.json());

const PORT = process.env.PORT || 3050;

//Local variable to store rooms data
const rooms = [
  {
    roomID: 0,
    roomName: "300",
    noOfSeatsAvailable: "2",
    amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
    pricePerHr: 100,
    bookedStatus: false,
    customerDetails: {
      customerName: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  },
  {
    roomID: 1,
    roomName: "301",
    noOfSeatsAvailable: "2",
    amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
    pricePerHr: 100,
    bookedStatus: true,
    customerDetails: {
      customerName: "Rajesh",
      date: "16/10/2021",
      startTime: 1100,
      endTime: 1800,
    },
  },
  {
    roomID: 2,
    roomName: "302",
    noOfSeatsAvailable: "2",
    amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
    pricePerHr: 100,
    bookedStatus: false,
    customerDetails: {
      customerName: "Mallesh",
      date: "18/10/2021",
      startTime: 1000,
      endTime: 1800,
    },
  },
  {
    roomID: 3,
    roomName: "303",
    noOfSeatsAvailable: "2",
    amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
    pricePerHr: 100,
    bookedStatus: false,
    customerDetails: {
      customerName: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  },
  {
    roomID: 4,
    roomName: "304",
    noOfSeatsAvailable: "2",
    amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
    pricePerHr: 100,
    bookedStatus: false,
    customerDetails: {
      customerName: "Priya",
      date: "16/11/2021",
      startTime: 1200,
      endTime: 2000,
    },
  },
];


// Home page route
app.get("/", (request, response) => {
  response.send("Hall Booking API");
});

// Creating a room
app.post("/rooms/create", (request, response) => {
  const newRoom = request.body;
  rooms.push(newRoom);
  response.send(newRoom);
});

// Booking a room
app.post("/rooms", (request, response) => {
  const booking = request.body;

  rooms.map((room) => {
    if (room.roomID == booking.roomID) {
      console.log(room);
      if (room.customerDetails.date != booking.date) {
        room.customerDetails.customerName = booking.customerName;
        room.customerDetails.date = booking.date;
        room.customerDetails.startTime = booking.startTime;
        room.customerDetails.endTime = booking.endTime;
        room.bookedStatus = !room.bookedStatus;
        response.send("Room booked successfully");
      } else {
        response.send("Room already booked for that date. Please choose another room");
      }
    }
    return room;
  });
});

// List all rooms with booked data
app.get("/rooms", (request, response) => {
  response.send(
    rooms.map((room) => {
      if (room.bookedStatus == true) {
        return {
          "Room name": room.roomName,
          "Booked Status": "Booked",
          "Customer Name": room.customerDetails.customerName,
          "Date": room.customerDetails.date,
          "Start Time": room.customerDetails.startTime,
          "End Time": room.customerDetails.endTime,
        };
      } else {
        return { "Room name": room.roomName, "Booked Status": "Vacant" };
      }
    })
  );
});

// List all customers with booked data
app.get("/customers", (request, response) => {
  response.send(
    rooms.map((room) => {
      if (room.bookedStatus === true) {
        return {
          "Customer name": room.customerDetails.customerName,
          "Room name": room.roomName,
          Date: room.customerDetails.date,
          "Start Time": room.customerDetails.startTime,
          "End Time": room.customerDetails.endTime,
        };
      }
      return null; // Include non-booked rooms in the response as well
    }).filter((customer) => customer !== null)
  );
});

app.listen(PORT, () => console.log("Server has started at:", PORT));