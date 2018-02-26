import mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'andreafv',
    password: '8H4z4Btw',
    database: 'andreafv'
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

// Class that performs database queries related to notes
class getEmployee {
  getEmployees() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee', (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  getEmployee(mail) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE first_name=?', [mail], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  getLogin(mail) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE email=?', [mail], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

}


// // Class that performs database queries related to customers
// class getEmployee {
//   getEmployees(callback) {
//       connection.query('SELECT * FROM certificate', (error, result) => {
//       if (error) throw error;
//
//       callback(result);
//     });
//   }
//
//   getEmployeeByMail(mail, callback) {
//     connection.query('SELECT * FROM employees WHERE email=?', [id], (error, result) => {
//       if (error) throw error;
//
//       callback(result[0]);
//     });
//   }
//
//   addEmployee(firstName, city, callback) {
//     connection.query('INSERT INTO Customers (firstName, city) values (?, ?)', [firstName, city], (error, result) => {
//       if (error) throw error;
//
//       callback();
//     });
//
//   }
// }
let employee = new getEmployee();

export { employee };
