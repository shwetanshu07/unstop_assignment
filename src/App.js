import './App.css';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as helper from './helper';
import { bookSeat, errorCheck }from './bookSeat';

// Creating a matrix of 12 rows each row having 7 seats each and the last row has 3 seats
let matrix = new Array(helper.TOTAL_ROWS - 1);
for (let row=0; row<helper.TOTAL_ROWS - 1; row++) {
  matrix[row] = new Array(helper.SEATS_PER_ROW).fill(false);
}
matrix.push(new Array(3).fill(false));

// Randomly book some seats, as it is stated in assignment to have some pre-booked seats.
let random_row, random_col;
for (let i=0; i<5; i++) {
  random_row = Math.floor(Math.random() * (helper.TOTAL_ROWS - 1));
  random_col = Math.floor(Math.random() * helper.SEATS_PER_ROW);
  matrix[random_row][random_col] = true;
}

function App() {
  const [booked_seats_arr, setBookedSeatsArr] = useState([]);

  const [seat_matrix, setSeatMatrix] = useState(matrix);
  const handleSeatBooking = () => {
    let matrix_copy = [...seat_matrix];
    let error_result = errorCheck(matrix_copy, seats_to_book);
    if (error_result.error) {
      toast.error(error_result.msg, {position: 'top-right'});
      return;
    }

    let [latest_booked_matrix, booked_seats_arr] = bookSeat(matrix_copy, seats_to_book);
    setBookedSeatsArr(booked_seats_arr);
    setSeatMatrix(latest_booked_matrix);
    toast.success("Seat booked successfully.", {position: 'top-right'});
  };
  
  const [seats_to_book, setSeatsToBook] = useState('');
  const handleSeatInput = (event) => {
    setSeatsToBook(event.target.value);
  }
  
  return (
    <div className="App">
      {/* Navbar::starts */}
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Unstop Seat Reservation Assignment</span>
        </div>
      </nav>{/* Navbar::ends */}

      <div className='container-sm d-flex justify-content-around mt-3 main-wrapper'>
        <div>
          {/* Seat booking form::starts */}
          <form>
            <label htmlFor="seats-to-book" className="form-label">Enter the number of seats you want to book.</label>
            <input type="number" id="seats-to-book" className="form-control" value={seats_to_book} onChange={handleSeatInput}/>
            <div id="help-block" className="form-text">
              You can book a maximum of 7 seats at a time.
            </div>
            <button type="button" className="btn btn-primary mt-2" onClick={handleSeatBooking}>Book seats</button>
          </form>{/* Seat booking form::ends */}

          {/* Seat no. that has been booked by user */}
          {booked_seats_arr.length > 0 && 
          <div className='mt-2'>
            <div><strong>You have been allotted the following seats : </strong></div>
            {booked_seats_arr.join(", ")}
          </div>
          }
        </div>
        
        <div className="grid-wrapper">
          {/* Grid heading & legend::starts */}
          <div>
            <p><strong>Seat Arrangement</strong></p>
            <dl>
              <dt className='vacant-seat-legend'>[green]</dt>
              <dd> - Vacant Seat </dd>

              <dt className='booked-seat-legend'>[red]</dt>
              <dd> - Booked Seat </dd>
            </dl>
          </div>{/* Grid heading & legend::ends */}

          {/* Seat grid table::starts */}
          <table className="matrix">
            <tbody>
              {seat_matrix.map((row, row_index) => (
                <tr key={row_index}>
                  {row.map((seat, seat_index) => {
                    return (<td key={seat_index} className={seat ? 'booked-seat' : 'vacant-seat'}>
                      {helper.getSeatNumber(row_index, seat_index)}
                    </td>)
                  })}
                </tr>
              ))}
            </tbody>
          </table>{/* Seat grid table::ends */}

        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
