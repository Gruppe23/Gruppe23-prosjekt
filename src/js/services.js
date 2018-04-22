// @flow
import mysql from 'mysql';
import {programRender, ProgramRender} from "./app.js"
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
let error: Error;
// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({host: 'mysql.stud.iie.ntnu.no', user: 'g_oops_23', password: 'sIrRhlP1', database: 'g_oops_23'});

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error)
      throw error; // If error, show error in console and return from this function
    }
  );

  // Add connection error handler
  connection.on('error', (error : Error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    } else {
      throw error;
    }
  });
}
connect();
class ExtContact {
  contact_id: number;
  first_name: string;
  last_name: string;
  phone_number: number;
}
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
  tlf: number;
  shiftscore: number;

}

class userCertificates {
  first_name: string;
  surname: string;
  username: string;
  user_id: number;
  certificate_name: string;
  certificate_id: number;
  employee_id: number;
  tlf: number;
  shiftscore: number;
}
class userRoles {
  first_name: string;
  surname: string;
  username: string;
  user_id: number;
  role_id: number;
  role_name: string;
  role_description: string
  shiftscore: number;
}

class roleCertificates {
  role_id: number;
  certificate_id: number;
  role_name: number;
  certificate_name: string;
  valid_time: number;
}



// Class that performs database queries related to notes
class getEmployee {
//Gettign employee name, id etc..
  getEmployees(): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT username, user_id, first_name, surname, adress, zipcode, status FROM employee', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
//Getting employee mail and number from database
  getEmployee(mail : number): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE user_id=?', [mail], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result[0]);
        console.log(result[0])
      });
    });
  }
  //Getting employee query that gets first_name & surname
  getEmployeeByName(fname: string, lname: string): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE first_name=? AND surname=?', [fname, lname], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result[0]);
        console.log(result[0])
      });
    });
  }
//Query for gettingexternal contacts
  getExternalContacts(): Promise<ExtContact>{
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM external_contact", (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result)
      })
    })
  }
//Query for getting a external_contact by id
  getExternalContact(id): Promise<ExtContact>{
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM external_contact WHERE contact_id=?", [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        console.log(result[0])
        resolve(result[0])
      })
    })
  }
//Add new ext. contact query
newExtContact(first_name: string, last_name: string, phone_number: number) {
  return new Promise((resolve, reject) => {
    let date = new Date()
    connection.query('INSERT INTO external_contact (first_name, last_name, phone_number) VALUES (?, ?, ?)', [
      first_name, last_name, phone_number
    ], (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve("Certificate was successfully added to database");
    });
  });
}
//Get availeable employees when you create a new event...
  getAvailableEmployeesEventCreation(prepDate: Date, endDate: Date): Promise<User[]>{
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM employee e WHERE NOT EXISTS (SELECT * FROM passive p WHERE from_date BETWEEN ? AND ? AND p.employee_id = e.user_id)", [prepDate, endDate], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result)
      })
    })
  }


//Get new user that has signed up for approval


  getNewUsers(): Promise<User[]> {
    let nada = 0;
    return new Promise((resolve, reject) => {
      connection.query('SELECT first_name, surname, adress, email, user_id FROM employee where status = ? ORDER BY surname', [nada], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
//Accept users that waits for approval
  acceptNewUser(id : number): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE employee SET status = 1 WHERE user_id = ?', [id], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
//Deactivate account query
  deactivateAccount(employeeid : number): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE employee SET status = 0 WHERE user_id = ?', [employeeid], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      })
    })
  }


  //Bruker 2 forskjellige, kommer litt an på hva man må bruke det til, ofte hvis jeg brukte det i sammarbeid med react var ikke et resolve svar funksjonelt siden resolve gir et object som svar, og det vil ikke react ha noe av.

  getSignedInUser2(): Promise<User[]> {
    let item = localStorage.getItem('signedInUser'); // Get User-object from browser
    return JSON.parse(item)
  }


  getSignedInUser(): Promise<User[]> {
    return new Promise((resolve, reject) => {
    let item: User[] = localStorage.getItem('signedInUser'); // Get User-object from browser
    if(!item) return null
    resolve(JSON.parse(item));
  })
  }


//Get relevant roles base on certificate etc....
  getRoles(): Promise<roleCertificates[]> {
    return new Promise((resolve, reject) => {
      connection.query('select role.role_id, rc.certificate_id, c.certificate_name, role.role_name from (role_certificate rc inner join certificate c on c.certificate_id = rc.certificate_id) INNER JOIN role on role.role_id = rc.role_id', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
//Getting specific roles
  getRole(id): Promise<roleCertificates[]> {
    let nada = 0;
     return new Promise((resolve, reject) => {
      connection.query('select * from role where role_id = ?', [id], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result[0]);
      });
    });
  }

  //Getting distinct roles...
  getDistinctRoles(): Promise<roleCertificates[]> {
    let nada = 0;
     return new Promise((resolve, reject) => {
      connection.query('select * from role', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
//Another solution for getting role for a spesific user
  getUserRoles2(id : number): Promise<userRoles[]> {
    return new Promise((resolve, reject) => {
      connection.query("select ra.role_id, ra.role_name, rec.employee_id, first_name, surname from ( select rc.role_id, r.role_name, count(*) as antall from role_certificate rc INNER JOIN role r on rc.role_id = r.role_id group by role_id ) ra INNER JOIN ( select eec.first_name, eec.surname, rc.role_id, employee_id, count(*) as antall from ( SELECT * FROM employee_certificate ec INNER JOIN employee e ON ec.employee_id = e.user_id having ec.confirmed = 1 ) eec INNER JOIN role_certificate rc ON rc.certificate_id = eec.certificate_id group by role_id, employee_id ) rec ON ra.role_id = rec.role_id where ra.antall = rec.antall AND rec.employee_id = ?", [id], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      })
    })
  }
//Bigass query for getting shifts that match the roles needed
    getShiftsMatchingUserRoles(id: number): Promise<shift[]> {
      return new Promise((resolve, reject) => {
        connection.query('SELECT s.start, s.shift_id, (SELECT case when employee_id is not null then true else false end from interest where shift_id = s.shift_id AND employee_id = ?) AS interest, s.end, e.id, s.employee_id, s.role_id, s.shift_name, e.title, e.address, e.hostname, e.postal, e.ext_contact_id, e.contact_id, em.first_name AS contact_first_name, em.surname AS contact_last_name, em.tlf AS contact_tlf, ec.first_name AS ec_first_name, ec.last_name AS ec_last_name, ec.phone_number AS ec_tlf FROM shift s INNER JOIN ( employee em inner join ( events e INNER JOIN external_contact ec ON e.ext_contact_id = ec.contact_id ) on e.contact_id = em.user_id ) on s.event_id = e.id where exists (select ra.role_id, ra.role_name, rec.employee_id, first_name, surname from ( select rc.role_id, r.role_name, count(*) as antall from role_certificate rc INNER JOIN role r on rc.role_id = r.role_id group by rc.role_id ) ra INNER JOIN ( select eec.first_name, eec.surname, rc.role_id, employee_id, count(*) as antall from ( SELECT * FROM employee_certificate ec INNER JOIN employee e ON ec.employee_id = e.user_id having ec.confirmed = 1 ) eec INNER JOIN role_certificate rc ON rc.certificate_id = eec.certificate_id group by role_id, employee_id ) rec ON ra.role_id = rec.role_id where ra.antall = rec.antall and ra.role_id = s.role_id AND rec.employee_id=?)', [id, id], (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        })
      })
    }
//Query for setting up interest in a shift/event
    setInterest(employee_id, shift_id){
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO interest (employee_id, shift_id) VALUES (?, ?)', [employee_id, shift_id], (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        })
      })
    }
//For removing interest in shift/event
    removeInterest(employee_id, shift_id){
      return new Promise((resolve, reject) => {
        connection.query('DELETE FROM interest where employee_id = ? AND shift_id = ?', [employee_id, shift_id], (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        })
      })
    }
//Get roles that is not in a spesific event
  getRolesNotInEvent(id : number): Promise<userRoles[]> {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM role WHERE role_id NOT IN (SELECT role_id from shift where event_id = 1)", [id], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      })
    })
  }
//Getting user with a spesific role
  getAvailableUsersWithRole(shift_date, id : number): Promise<Object[]> {
    console.log(shift_date)
    return new Promise((resolve, reject) => {
      connection.query("SELECT COUNT(*) AS CertCount, rc.role_id, e.first_name, e.surname, e.user_id FROM employee e INNER JOIN ( employee_certificate ec INNER JOIN role_certificate rc ON rc.certificate_id = ec.certificate_id ) ON e.user_id = ec.employee_id AND rc.role_id = ? WHERE NOT EXISTS ( SELECT * FROM passive p WHERE ( ? BETWEEN p.from_date AND p.to_date ) AND(p.employee_id = e.user_id) AND(p.employee_id = ec.employee_id) ) AND NOT EXISTS ( SELECT * FROM shift s WHERE ( ? BETWEEN s.start AND s.end ) AND(s.employee_id = e.user_id) AND(s.employee_id = ec.employee_id) ) AND e.status = 1 GROUP BY e.user_id HAVING CertCount =( SELECT COUNT(*) FROM role_certificate WHERE role_id = ? GROUP BY rc.role_id )", [
         id, shift_date, shift_date, id
      ], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      })
    })
  }
//Updating
setShiftEmployee(employee_id, shift_id){
  console.log()
  return new Promise((resolve, reject) => {
    connection.query('UPDATE shift SET employee_id = ? where shift_id = ?', [employee_id, shift_id], (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    })
  })
}
//Query for getting sertificats
  getCertificates(): Promise<userCertificates[]> {
     return new Promise((resolve, reject) => {
      connection.query('select * from certificate', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
//For adding certificates
  addCertificate(user_id : number, certificate_id : number, confirmed: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let date = new Date()
      connection.query('INSERT INTO employee_certificate (employee_id, certificate_id, certification_date, confirmed) VALUES (?, ?, ?, ?)', [
        user_id, certificate_id, date, confirmed
      ], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve("Certificate was successfully added to database");
      });
    });
  }
//For accepting new certificates added
  acceptCertificate(employeeid : number, certificateid : number): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE employee_certificate SET confirmed = 1 WHERE employee_id = ? AND certificate_id = ?', [
        employeeid, certificateid
      ], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      })
    })
  }
//certificates stil not confirmed
  getUnconfirmedCertificates(): Promise<userCertificates[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT employee.username, certificate.certificate_id, employee.first_name, employee.email, employee.adress, employee.surname, employee.user_id, certificate.certificate_name FROM ((employee INNER JOIN employee_certificate ON employee.user_id = employee_certificate.employee_id) INNER JOIN certificate ON certificate.certificate_id = employee_certificate.certificate_id) WHERE employee_certificate.confirmed = 0 ORDER BY surname', (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      })
    })
  }
//Get certification for specific user
  getUserCertifications(id : number): Promise<userCertificates[]> {
    return new Promise((resolve, reject) => {
      connection.query("select * from employee_certificate ec inner join certificate c on c.certificate_id = ec.certificate_id where employee_id = ?", [id], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
//...
  getUnobtainedUserCertifications(id : number): Promise<userCertificates[]> {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * From certificate WHERE certificate_id NOT IN (SELECT certificate_id FROM employee_certificate WHERE employee_id = ?)", [id], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
//Confirmed by admin and is OK
  getConfirmedUserCertifications(id : number): Promise<userCertificates[]> {
    return new Promise((resolve, reject) => {
      connection.query("Select ec.certificate_id, c.certificate_name From (employee_certificate ec inner join employee e on ec.employee_id = e.user_id) INNER JOIN certificate c ON ec.certificate_id = c.certificate_id WHERE ec.confirmed = 1 AND ec.employee_id = ?", [id], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
// Creating new events
  createEvent(start, end, prep, title, hostname, description, address, postal, contact_id, ext_contact_id){
    return new Promise((resolve, reject) => {
      let date = new Date()
      connection.query('INSERT INTO events (start, end, prep, title, hostname, description, address, postal, contact_id, ext_contact_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        start, end, prep, title, hostname, description, address, postal, contact_id, ext_contact_id
      ], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }
//Creating shifts in events
  createShift(id, role_id, start, end, shift_name){
    return new Promise((resolve, reject) => {
      let date = new Date()
      connection.query('INSERT INTO shift (event_id, role_id, start, end, shift_name) VALUES (?, ?, ?, ?, ?)', [
        id, role_id, start, end, shift_name
      ], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        console.log(result)
        resolve(result);
      });
    });
  }

//Gettin login infor from users
  getLogin(mail: string): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM employee WHERE username=?', [mail], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result[0]);
      });
    });
  }
//Sign out query
  signOut() {
    localStorage.removeItem('signedInUser')
    programRender.forceUpdate()
    history.push("/page1")
  };
  //Hente ut alle certifikater som ikke har blitt godkjent

  signUp(first_name : string, surname : string, email : string, adress : string, zipcode : number, password : string, username : string, tlf : string): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO employee (first_name, surname, email, adress, zipcode, password, username, tlf) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
        first_name,
        surname,
        email,
        adress,
        zipcode,
        password,
        username,
        tlf
      ], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

//get events
  getEvents(): Promise< ?Object> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT id, start, end, prep, address, postal, gmaps, title, contact_id, ext_contact_id, description, hostname, allDay, (select count(*) from shift where event_id=id and employee_id IS NULL) AS empty_shifts from events', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result)
      })
    })
}




getEventsAvailable(date): Promise< ?Object> {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM events WHERE ? BETWEEN prep AND end',[date], (error, result) => {
      if(error) {
        reject(error);
        return;
      }
      console.log(result)
      resolve(result)
    })
  })
}




//Creating templates for event
  createTemplate(name: string, description: string): Promise<Object[]>{
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO shift_template (template_name, description) VALUES (?, ?)', [
        name, description
      ], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  }

//Get event by id
  getEvent(id: number): Promise< ?Object> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM events WHERE id=?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result[0]);
      });
    });
  }
// Gettin external contact for event
  getExtContact(id: number): Promise< ?Object> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM external_contact WHERE contact_id=?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result[0]);
      })
    })
}
//Adding roles to event templates
  addRolesToTemplate(template_id: string, role_id: number, amount: number): Promise<void>{
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO shift_template_roles (template_id, role_id, amount) VALUES (?, ?, ?)', [template_id, role_id, amount], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();

      });
    });
  }

// Get shifts query
  getShifts(id: number): Promise< ?Object> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT s.start, s.shift_id, (SELECT case when employee_id is not null then true else false end from interest where shift_id = s.shift_id AND employee_id = ?) AS interest, s.end, e.id, s.employee_id, s.role_id, s.shift_name, e.title, e.address, e.hostname, e.postal, e.ext_contact_id, e.contact_id, em.first_name AS contact_first_name, em.surname AS contact_last_name, em.tlf AS contact_tlf, ec.first_name AS ec_first_name, ec.last_name AS ec_last_name, ec.phone_number AS ec_tlf FROM shift s INNER JOIN ( employee em inner join ( events e INNER JOIN external_contact ec ON e.ext_contact_id = ec.contact_id ) on e.contact_id = em.user_id ) on s.event_id = e.id group by shift_id', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        console.log(result)
        resolve(result)
      })
    })
  }
//Get single shifts
  getShift(id: number){
    return new Promise((resolve, reject) => {
      connection.query('select * from shift where shift_id = ?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        console.log(result[0])
        resolve(result[0])
      })
    })
  }



  getFrontPageShifts(id: number){
    return new Promise((resolve, reject) => {
      connection.query('select * from shift where employee_id = ?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result)
      })
    })
  }


// Get roles from templates
  getTemplateRoles(id: number): Promise<Object[]>{
    return new Promise((resolve, reject) => {
      connection.query('SELECT * from shift_template_roles st INNER JOIN role r ON st.role_id = r.role_id where template_id = ?', [id], (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }
// Set user to passive if they don't want the shift
  setPassive(id: number, from_date, to_date): Promise< ?Object> {
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




// Get the made templates from database
getTemplates(): Promise<Object[]>{
  return new Promise((resolve, reject) => {
   connection.query('select * from shift_template', (error: Error, result) => {
     if (error) {
       reject(error);
       return;
     }
     resolve(result);
   });
 });

}
// Remove template from database
removeTemplate(id: number): Promise<void>{
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM shift_template_roles where template_id=?', [id], (error, result)=> {
      if(error){
        reject(error)
        return;
      }
    })
   connection.query('DELETE FROM shift_template WHERE template_id=?', [id], (error: Error, result) => {
     if (error) {
       reject(error);
       return;
     }
     resolve();
   });
 });
}
// Get the passive days from users
getUserPassiveDays(id: number): Promise< ?Object> {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM passive WHERE employee_id=?', [id], (error, result) => {
      if(error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}
//Remove passive events from where passive is set ut
removePassiveEvent(id: number): Promise< ?Object> {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM passive WHERE passive_id=?', [id], (error, result) => {
      if(error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

getUserByMail(mail: string): Promise< ?Object> {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM employee WHERE email = ?', [mail], (error, result) => {
      if(error) {
        reject(error);
        return;
      }
      resolve(result[0]);
    });
  });
}
resetPw(password: string, mail: string): Promise<?Object> {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE employee SET password =? WHERE email= ?', [password, mail], (error, result) => {
      if(error) {
        reject(error);
        return;
      }
      resolve(result);
    });
   });
}


}


let employee = new getEmployee();
export {
  employee,
  User,
  userCertificates,
  ExtContact
};
