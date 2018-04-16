
// @flow
import mysql from 'mysql';
import { programRender, ProgramRender } from "./app.js"
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

class User {
  address: string;
  email: string;
  first_name: string;
  password: string;
  picture: any;
  status: number;
  surname: string;
  user_id: number;
  user_type: number;
  zipcode: number;
}

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'g_oops_23',
    password: 'sIrRhlP1',
    database: 'g_oops_23'
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error: Error) => {
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
  getEmployees(): Promise< ?Object> {
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

  getSignedInUser(): Promise<User[]> {
    let item: User[] = localStorage.getItem('signedInUser'); // Get User-object from browser
    if(!item) return null
    return JSON.parse(item);
  }

  getSignedInUser2(): Promise<User[]> {
    return new Promise((resolve, reject) => {
    let item: User[] = localStorage.getItem('signedInUser'); // Get User-object from browser
    if(!item) return null
    resolve(JSON.parse(item));
  })
  }

  getEmployee(mail: string): Promise<User[]> {
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

  getLogin(mail: string): Promise<User[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE email=?', [mail], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        console.log(result)
        resolve(result);
      });
    });
  }

  signOut() {
    localStorage.removeItem('signedInUser')
    programRender.forceUpdate()
    history.push("/page1")
  }

  getEvents(): Promise< ?Object> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM events', (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }
  getEvent(id): Promise< ?Object> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM events WHERE id=?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }
  getExtContact(id): Promise< ?Object> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM external_contact WHERE contact_id=?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result[0]);
      });
    });
  }

  getShifts(id): Promise< ?Object> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM shift', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  setPassive(id, from_date, to_date): Promise< ?Object> {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO passive(employee_id, from_date,to_date) VALUES( ?, ?, ? )', [id, from_date, to_date], (error, result) => {
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
