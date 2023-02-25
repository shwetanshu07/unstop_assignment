import { MIN_SEAT_LIMIT, MAX_SEAT_LIMIT, getSeatNumber } from "./helper";

/**
 * Checks any errors before booking seats
 * @param seat_matrix 
 * @param seats_to_book 
 * @returns error
 */
export function errorCheck(seat_matrix, seats_to_book) {
    // check if seats to book fall in the given range
    if (seats_to_book < MIN_SEAT_LIMIT 
      || seats_to_book > MAX_SEAT_LIMIT) {
      return {'error' : true, 'msg' : "Enter a valid number between 1 and 7"};
    }
  
    // check sufficient amount of empty seats left
    let empty_seats = 0;
    for (let row=0; row < seat_matrix.length; row++) {
      for (let seat=0; seat < seat_matrix[row].length; seat++) {
          if(!seat_matrix[row][seat]) {
              empty_seats++;
          }
      }
    }
    if (seats_to_book > empty_seats) {
      return {'error' : true, 'msg' : "Sufficient seats not available"};
    }
  
    return {'error' : false, 'msg' : ""};
}

/**
 * Books empty seats in a single row.
 * @param seat_matrix 
 * @param booked_seat_arr 
 * @param row_no 
 * @param seats_to_book 
 * @returns seat left which could not be booked
 */
function bookSeatsInARow(seat_matrix, booked_seat_arr, row_no, seats_to_book) {
    for (let i=0; i<seat_matrix[row_no].length && seats_to_book > 0; i++) {
        if(!seat_matrix[row_no][i]) {
            seat_matrix[row_no][i] = true;
            booked_seat_arr.push(getSeatNumber(row_no, i));
            seats_to_book--;
        }
    }
    return seats_to_book;
}

/**
 * Main function to book the seats
 * @param seat_matrix 
 * @param seats_to_book 
 * @returns booked seat matrix and the seat numbers which are booked
 */
export function bookSeat(seat_matrix, seats_to_book) {
    let booked_seat_arr = [];
    let booked_rows = new Set();

    // Find the no. of empty seats in each row (row, empty_seats).
    let row_empty_seats = [];
    for (let row=0; row < seat_matrix.length; row++) {
        let empty_seats = 0;
        for (let seat=0; seat < seat_matrix[row].length; seat++) {
            if(!seat_matrix[row][seat]) {
                empty_seats++;
            }
        }
        row_empty_seats.push([row,empty_seats]);
    }

    /* There are two possibilities while booking - 
    1. Row with max empty seats still has less seats than seats to book. In that case seats
    will be booked across different rows.
    2. There is some row which has the least amount of empty seats capable to accomodate seats
    to book. In this case seat booking will be done in a single row. */
    let sorted_row_seats = row_empty_seats.slice().sort((a, b) => b[1] - a[1]);
    let ptr, selected_row;
    for (ptr=0; ptr<sorted_row_seats.length; ptr++) {
        // at any point if seats to book is more than empty seats, book the 
        // previous row unless it was the first row.
        if (seats_to_book > sorted_row_seats[ptr][1]) {
            break;
        }
    }
    if (ptr == 0) selected_row = sorted_row_seats[ptr][0];
    else selected_row = sorted_row_seats[ptr-1][0];

    booked_rows.add(selected_row);
    let seats_left = bookSeatsInARow(seat_matrix, booked_seat_arr, selected_row, seats_to_book);

    while (seats_left > 0) {
        /* If there are some seats still left to book check if any other row is present
        which can accomodate all the remaining seats are not. If there are multiple 
        such rows. We will choose the one closest to the previously booked row. */
        let capable_row = null;
        let closest_distance = Number.POSITIVE_INFINITY;
        row_empty_seats.forEach((item) => {
            let row = item[0];
            let empty_seats = item[1];
            if (booked_rows.has(row)) return;
            if (empty_seats >= seats_left) {
                // this is a capable row. is it closest.
                let distance = Math.abs(selected_row - row);
                if (distance < closest_distance) {
                    capable_row = row;
                    closest_distance = distance;
                }
            }
        });

        // If there is some capable row then book seats in that row
        if (capable_row != null) {
            booked_rows.add(capable_row);
            seats_left = bookSeatsInARow(seat_matrix, booked_seat_arr, capable_row, seats_left);
        }

        /* otherwise, there are no rows right now capable of fully accomodating the remaining seats.
        So, choose that row which has the next most empty seats. Proximity to the previous 
        row does not matter as main priority is to book as much people in 1 row together */
        else {
            ptr++;
            selected_row = sorted_row_seats[ptr][0];
            booked_rows.add(selected_row);
            seats_left = bookSeatsInARow(seat_matrix, booked_seat_arr, selected_row, seats_left);
        }
    }

    return [seat_matrix, booked_seat_arr];
}