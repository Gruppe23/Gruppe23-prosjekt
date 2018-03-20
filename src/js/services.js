
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
  certificate_name
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
    let item = localStorage.getItem('signedInUser'); // Get User-object from browser
    return JSON.parse(item);
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

  getNewUsers(): Promise<any> {
    let nada = 0
    return new Promise((resolve, reject) => {
      connection.query('SELECT first_name, surname FROM employee where status = ? ORDER BY surname', [nada], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result)
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
  //Hente ut alle certifikater som ikke har blitt godkjent
  getUnconfirmedCertificates(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT employee.first_name, employee.surname, employee.user_id, certificate.certificate_name FROM ((employee INNER JOIN employee_certificate ON employee.user_id = employee_certificate.employee_id) INNER JOIN certificate ON certificate.certificate_id = employee_certificate.certificate_id) WHERE employee_certificate.confirmed = 0 ORDER BY surname', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      })
    })
  }

  signUp(first_name, surname, email, adress, zipcode, password): Promise<void>{
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO employee (first_name, surname, email, adress, zipcode, password) VALUES (?, ?, ?, ?, ?, ?)', [first_name, surname, email, adress, zipcode, password], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
          resolve();
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

export { employee, User };
