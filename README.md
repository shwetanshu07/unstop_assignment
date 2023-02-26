# Unstop Seat Reservation Assignment

🌐 **Live Website** - https://unstop-assignment-five.vercel.app/

📗 **Seat booking logic code** - <a href="https://github.com/shwetanshu07/unstop_assignment/blob/3c9d2f7759589f6c2ee4b9ba914d4406b1c3c41f/src/bookSeat.js">File link</a>

## Assumptions
1. First priority is to book as many seats in 1 row (acc. to Point 3 in Problem Description).
2. Proximity within one row is not taken into consideration as it was not explicitly stated. So consider the example - 

R1 - | vacant  | vacant  | vacant | vacant  | vacant | vacant  | vacant |

R2 - | vacant  | vacant  | booked| vacant | vacant  | vacant | vacant |

In this case if you were to book 5 seats it can be allotted in R2 as they are still all together in one row (but not all together as there is one other booking).

3. If there are some seats that cannot be booked in one single row, they will be booked in the next closet row which can accommodate them.

## General Logic of seat booking
1. If the total empty seats < seats to book -> return error
2. Otherwise, get the number of empty seats in each row.
3. First try to book all the seats in one row R. Here R will be such a row that it has the least number of empty seats capable to fully accomodate the number of seats to book. Example - R1 with 7 empty seats and R2 with 5 empty seats and we need to book 3 seats , we will choose R2.
4. If there is no row capable of booking all the seats in one row then choose that row which has the maximum number of empty seats, so we can book as many seats in same row as possible.
5. Then check the number of seats left, say X, find a row which can fully accomodate the X seats and which is closest to the previous booked row and choose that row.
6. If no such row exists then book row with second highest empty seats - priority given to booking as many seats in one row. Continue step 5 and 6 till there are no seats left.

Explanation for point 4.
<img src="https://github.com/shwetanshu07/unstop_assignment/blob/587d5cd5de78d48ab36cd47801dd960ffc3b65ac/images/explanation.png">

## Shortcomings in the algo. right now
<img src="https://github.com/shwetanshu07/unstop_assignment/blob/587d5cd5de78d48ab36cd47801dd960ffc3b65ac/images/shortcoming1.png">
<img src="https://github.com/shwetanshu07/unstop_assignment/blob/587d5cd5de78d48ab36cd47801dd960ffc3b65ac/images/shortcoming2.png">
