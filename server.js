const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Local variables to store data
let rooms = [];
let bookings = [];

// Create a Room
app.post('/createRoom',express.json(), (req, res) => {
  const { seats, amenities, pricePerHour } = req.body;
  console.log(req.body)
  const room = {
    id: rooms.length + 1,
    seats,
    amenities,
    pricePerHour,
  };
  rooms.push(room);
  res.json({ message: 'Room created successfully', room });
});

// Book a Room
app.post('/bookRoom', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  console.log(rooms,roomId)
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const booking = {
    id: bookings.length + 1, 
    customerName,
    date,
    startTime,
    endTime,
    roomId,
  };
  bookings.push(booking);
  res.json({ message: 'Room booked successfully', booking });
});

// List all Rooms with Booked Data
app.get('/listRooms', (req, res) => {
  const roomList = rooms.map((room) => {
    const bookedData = bookings.find((booking) => booking.roomId === room.id);
    return {
      roomName: `Room ${room.id}`,
      bookedStatus: bookedData ? 'Booked' : 'Available',
      customerName: bookedData ? bookedData.customerName : '',
      date: bookedData ? bookedData.date : '',
      startTime: bookedData ? bookedData.startTime : '',
      endTime: bookedData ? bookedData.endTime : '',
    };
  });
  res.json(roomList);
});

// List all customers with booked Data
app.get('/listCustomers', (req, res) => {
  const customerList = bookings.map((booking) => ({
    customerName: booking.customerName,
    roomName: `Room ${booking.roomId}`,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
  }));
  res.json(customerList);
});

// List how many times a customer has booked the room
app.get('/customerBookingHistory/:customerName', (req, res) => {
  const { customerName } = req.params;
  const customerHistory = bookings
    .filter((booking) => booking.customerName === customerName)
    .map((booking) => ({
      customerName: booking.customerName,
      roomName: `Room ${booking.roomId}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.id,
      bookingDate: new Date().toISOString(),
      bookingStatus: 'Booked',
    }));
  res.json(customerHistory);
});

const PORT = 3050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
