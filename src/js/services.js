
// @flow
import mysql from 'mysql';
import { programRender, ProgramRender } from "./app.js"
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

class User {
  adress: string;
  email: string;
  first_name: string;
  password: string;
  picture: any;
  status: number;
  surname: string;
  user_id: number;
  user_type: number;
  zipcode: number;
  certificate_name: string;
}

class Signup {
  first_name: string;
  surname: string;
  email: string;
  adress: string;
  zipcode: number;
  password: string;
}

class Newuser {
  first_name: string;
  surname: string;
  email: string;
  adress: string;
  zipcode: number;
  password: string;
}
class userCertificates {
  first_name: string;
  surname: string;
  username: string;
  user_id: number;
  certificate_name: string;
  certificate_id: number;
  employee_id: number;
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

  getEmployees(): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT username, first_name, surname, adress, zipcode FROM employee', (error, result) => {
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

  getEmployee(mail: number): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE user_id=?', [mail], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        console.log(result)
        resolve(result);
      });
    });
  }



  getNewUsers(): Promise<User[]> {
    let nada = 0
    return new Promise((resolve, reject) => {
      connection.query('SELECT first_name, surname, adress, email, user_id FROM employee where status = ? ORDER BY surname', [nada], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

  getRoles(): Promise<Object[]> {
    let nada = 0
    return new Promise((resolve, reject) => {
      connection.query('select role.role_id, rc.certificate_id, c.certificate_name, role.role_name from (role_certificate rc inner join certificate c on c.certificate_id = rc.certificate_id) INNER JOIN role on role.role_id = rc.role_id', [nada], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

  getUserCertifications(id): Promise<Object[]> {
    return new Promise ((resolve, reject) => {
      connection.query("select * from employee_certificate where employee_id = ?", [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      })
    })
  }

  getUserRoles(id: number): Promise<Object[]> {
    return new Promise ((resolve, reject) => {
      let userRolesReturn = []
      employee.getRoles().then((roles) => {
        employee.getUserCertifications(id).then((user_cert) => {
          let x;
          let rolesArr = []
          rolesArr.push(new Array())
          for (x in roles){
            rolesArr.push(new Array())
            rolesArr[roles[x].role_id].push(roles[x].certificate_id)
            }
            console.log(user_cert)
            console.log (roles)
          for (x in rolesArr) {
            let y;
            let matchCounter = 0
            for (y in rolesArr[x]) {
              let z;

              for (z in user_cert) {
                console.log(rolesArr[x][y] +" " + user_cert[z].certificate_id)
                if (rolesArr[x][y] == user_cert[z].certificate_id){
                  console.log("MATCH")
                  matchCounter++
                } else {
                console.log("NOTMATCH")
                }
              }
            }
            if (matchCounter == rolesArr[x].length && matchCounter != 0){
              let d;
              for (d in roles) {
                let c;
                if (roles[d].role_id == x){
                  console.log("USER QUALIFIED AS: " +  roles[d].role_name)
                  userRolesReturn.push({role_name: roles[d].role_name, role_id: x})
                }
              }
            }
          }
        })
      })
      resolve(userRolesReturn)
    })
  }

  acceptNewUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE employee SET status = 1 WHERE user_id = ?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }


  getLogin(mail: string): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT username, email, password, status, user_type FROM employee WHERE username=?', [mail], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        console.log(result)
        resolve(result[0]);
      });
    });
  }

  signOut() {
    localStorage.removeItem('signedInUser')
    programRender.forceUpdate()
    history.push("/page1")
  }
  //Hente ut alle certifikater som ikke har blitt godkjent


  getUnconfirmedCertificates(): Promise<userCertificates[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT employee.username, certificate.certificate_id, employee.first_name, employee.email, employee.adress, employee.surname, employee.user_id, certificate.certificate_name FROM ((employee INNER JOIN employee_certificate ON employee.user_id = employee_certificate.employee_id) INNER JOIN certificate ON certificate.certificate_id = employee_certificate.certificate_id) WHERE employee_certificate.confirmed = 0 ORDER BY surname', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      })
    })
  }

  acceptCertificate(employeeid: number, certificateid: number): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE employee_certificate SET confirmed = 1 WHERE employee_id = ? AND certificate_id = ?', [employeeid, certificateid], (error, result)=> {
        if(error) {
          reject(error);
          return;
        }
          resolve();
      })
    })
  }


  signUp(first_name: string, surname: string, email: string, adress: string, zipcode: number, password: string, username: string ): Promise<void>{
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO employee (first_name, surname, email, adress, zipcode, password, username) VALUES (?, ?, ?, ?, ?, ?, ?)', [first_name, surname, email, adress, zipcode, password, username], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
          resolve();
      });
    });
  }
}


let employee = new getEmployee();
export { employee, User, userCertificates };
