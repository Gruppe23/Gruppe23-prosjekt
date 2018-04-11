
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
class userRoles {
  first_name: string;
  surname: string;
  username: string;
  user_id: number;
  role_id: number;
  role_name: string;
  role_description: string;
}

class roleCertificates {
  role_id: number;
  certificate_id: number;
  role_name: number;
  certificate_name: string;
  valid_time: number;
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
      connection.query('SELECT username, user_id, first_name, surname, adress, zipcode, status FROM employee', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

  getEmployee(mail: number): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE user_id=?', [mail], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
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

  deactivateUser(employeeid: number): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE employee SET status = 0 WHERE employee_id = ?', [employeeid, certificateid], (error, result)=> {
        if(error) {
          reject(error);
          return;
        }
          resolve();
      })
    })
  }

  getSignedInUser(): Promise<User[]> {
    return new Promise((resolve, reject) => {
    let item = localStorage.getItem('signedInUser'); // Get User-object from browser
    resolve(JSON.parse(item));
  })
  }

  getSignedInUser2(): Promise<User[]> {
    let item = localStorage.getItem('signedInUser'); // Get User-object from browser
    return JSON.parse(item)
  }



  getRoles(): Promise<roleCertificates[]> {
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

  getDistinctRoles(): Promise<roleCertificates[]> {
    let nada = 0
    return new Promise((resolve, reject) => {
      connection.query('select * from role', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

  getUserRoles(id: number): Promise<userRoles[]> {
    return new Promise ((resolve, reject) => {
      let userRolesReturn = []
      employee.getRoles().then((roles) => {
        employee.getUserCertifications(id).then((user_cert) => {
          employee.getDistinctRoles().then((distinct_roles) => {
          let x: ArrayIndex;
          let rolesArr = []
          rolesArr.push(new Array())
          //SKjekker hvert rolle opp imot kvalifikasjonene
          for (x in roles){
            rolesArr.push(new Array())
            rolesArr[roles[x].role_id].push(roles[x].certificate_id)
            }
          for (x in rolesArr) {
            let y;
            let matchCounter = 0
            for (y in rolesArr[x]) {
              let z;
              for (z in user_cert) {
                if (rolesArr[x][y] == user_cert[z].certificate_id){
                  matchCounter++
                } else {
                }
              }
            }
            if (matchCounter == rolesArr[x].length && matchCounter != 0){
              let d;
              for (d in distinct_roles) {
                let c;
                if (distinct_roles[d].role_id == x){
                  userRolesReturn.push({role_name: roles[d].role_name, role_id: x})
                }
              }
            }
          }
          resolve(userRolesReturn)
        })
      })
      })
    })
  }

  getUsersWithRole(id: number, count: number): Promise<Object[]>  {
  return new Promise((resolve, reject) => {
    connection.query("Select count(*) as CertCount, rc.role_id, e.user_id from employee e inner Join (employee_certificate ec INNER JOIN role_certificate rc on rc.certificate_id = ec.certificate_id) on e.user_id = ec.employee_id where rc.role_id = ? GROUP BY e.user_id HAVINg CertCount = ?", [id, count], (error, result) => {
      if(error) {
        reject(error);
        return;
      }
      resolve();
    })
  })
}

  getCertificates(): Promise<userCertificates[]> {
    let nada = 0
    return new Promise((resolve, reject) => {
      connection.query('select * from certificate', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

  addCertificate(user_id: number, certificate_id: number, confirmed): Promise<string>{
    return new Promise((resolve, reject) => {
      let date = new Date()
      connection.query('INSERT INTO employee_certificate (employee_id, certificate_id, certification_date, confirmed) VALUES (?, ?, ?, ?)', [user_id, certificate_id, date, confirmed], (error, result) => {
        if(error) {
          reject(error);
          return;
        }

          resolve("Certificate was successfully added to database");
      });
    });
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

  getUserCertifications(id: number): Promise<userCertificates[]> {
    return new Promise ((resolve, reject) => {
      connection.query("select * from employee_certificate ec inner join certificate c on c.certificate_id = ec.certificate_id where employee_id = ?", [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }


  getLogin(mail: string): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE username=?', [mail], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
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



  signUp(first_name: string, surname: string, email: string, adress: string, zipcode: number, password: string, username: string, tlf: string ): Promise<void>{
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO employee (first_name, surname, email, adress, zipcode, password, username, tlf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [first_name, surname, email, adress, zipcode, password, username, tlf], (error, result) => {
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
