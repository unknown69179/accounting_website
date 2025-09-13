const express = require("express");
const cors = require("cors");
const sql = require("mysql2");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const striper = require("stripe");

dotenv.config();
const stripe = new striper(process.env.STRIPE_SECRET_KEY);

const server = express();


const corsOption = {
    origin:["http://localhost:5173"],
    credentials: true,
};

const db = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements:true
})

db.connect((err)=>{
    if(err){
        console.log("error connecting",err);
    }
})

server.use(cors(corsOption));
server.use(express.json())
server.use(cookieParser())

const SECRET = process.env.JWT_SECRET;

function autherisation(req,res,next){
    const token = req.cookies?.token;
    if(token == null) 
        return res.status(401).json({message:"Not autherized"});
    try{
            jwt.verify(token,SECRET ,(err,user) => {
            req.user = user;
            next();

        });
    }
    catch(err){
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

server.post("/",(req,res)=>{
  const {userSelect1} = req.body;
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);
  
    db.query(`select * from ${userSelect1}_${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_transactions;`,(err,resulte)=>{
        if(err){
            console.log("error in get method in query",err);
        }
        return res.status(200).json(resulte);
        
    })
});

server.get("/invoices",(req,res)=>{
    const token = req.cookies?.token;
    const decoded = jwt.verify(token,SECRET);
    db.query(`select * from ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_invoices;`,(err,resulte)=>{
        if(err){
            console.log("error in get method in invoices query",err);
        }
        return res.json(resulte);
        
    })
})

server.post("/transactions",(req,res) => {
  
    const {date,type,account,amount,description,userSelect} = req.body;
    const token = req.cookies?.token;
    const decoded = jwt.verify(token,SECRET);

    const Amount = Number(amount).toFixed(2);

    const taple = `${userSelect}_${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_transactions`;
    
    

    db.query(`insert into ${taple} (date_time,type_,account_,amount,description_) values(?,?,?,?,?)`,[date,type,account,Amount,description],(err)=>{
        if (err){
            console.log("error storing data",err);
        }
        return res.status(200).json({success:true})

    })
    
})

server.post("/invoices",(req,res) => {
    const {date,client,status,amount,email,message} = req.body;
    const token = req.cookies?.token;
    const decoded = jwt.verify(token,SECRET);

    if (decoded.email == email) {
      return res.status(200).json({message:"you can't send an invoce to your self"})
    }

    db.query(`insert into ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_invoices(date_time,client,status,amount) values(?,?,?,?)`,[date,client,status,amount],(err)=>{
        if (err){
            console.log("error storing data",err);
            return res.status(500).json({success:false});
        }
    db.query(`select user_name from accounts where email = ?`,[decoded.email],(err,resulte) =>{
      if (err){
        console.log("error #1",err);
        return res.status(404).json({sucess:false})
      }
      db.query(`insert into ${email.replace(/[^a-zA-Z0-9_]/g, "")}_mail_box(date_time,name,message,email,amount) values(?,?,?,?,?)`,[date,resulte[0].user_name,message,decoded.email,amount],(err) => {
        if (err){
        console.log("error #2",err);
        return res.status(404).json({sucess:false})
        }
        return res.status(200).json({success:true});
      })
    })
    })
})

server.delete("/",(req,res) => {
    const {id,userSelect1} = req.body;
    const token = req.cookies?.token;
    const decoded = jwt.verify(token,SECRET);

    db.query(`delete from ${userSelect1}_${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_transactions where id = ?`,[id],(err) => {
        if (err){
          console.log("error deleting invoces",err);
          return res.status(500).json({success:false})
        }
        return res.status(200).json({success:true});
    })
})
server.delete("/invoices",(req,res) => {
    const {id} = req.body;
    const token = req.cookies?.token;
    const decoded = jwt.verify(token,SECRET);

    db.query(`delete from ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_invoices where id = ?`,[id],(err) => {
        if (err){
          console.log("error deleting envoice's",err);
          return res.status(500).json({success:false});
        }
        return res.status(200).json({success:false});
    })
})

server.delete("/invoices/all",(req,res) => {
    const token = req.cookies?.token;
    const decoded = jwt.verify(token,SECRET);
    db.query(`delete from ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_invoices`,(err) =>{
      if(err){
        console.log("error in delete all B.E",err);
        return res.status(500).json({success:false}) 
      }
    })
    return res.status(200).json({success:true});
})

server.post("/signup", async (req, res) => {
  const { name, birth_date, email, password } = req.body;

  db.query(
    "SELECT * FROM accounts WHERE email = ? OR user_name = ?",
    [email, name],
    async (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "Server error" });

      if (result.length > 0) {
        const duplicate = result[0];
        if (duplicate.email === email) {
          return res.json({ success: false, message: "This email is already used" });
        }
        if (duplicate.user_name === name) {
          return res.json({ success: false, message: "This username is already used" });
        }
      }

      try {
        const hashed = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO accounts(user_name, birth_date, email, password) VALUES (?, ?, ?, ?)",
          [name, birth_date, email, hashed],
          (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });

            const token = jwt.sign({ id: result.insertId, email }, SECRET, { expiresIn: "7d" });

            const tablesQuery = `
              CREATE TABLE client_${email.replace(/[^a-zA-Z0-9_]/g, "")}_transactions(
                id int primary key auto_increment,
                date_time date,
                type_ varchar(10),
                account_ varchar(20),
                amount decimal(65,2),
                description_ varchar(30)
              );
              CREATE TABLE freelancer_${email.replace(/[^a-zA-Z0-9_]/g, "")}_transactions(
                id int primary key auto_increment,
                date_time date,
                type_ varchar(10),
                account_ varchar(20),
                amount decimal(65,2),
                description_ varchar(30)
              );
              CREATE TABLE ${email.replace(/[^a-zA-Z0-9_]/g, "")}_invoices(
                id int primary key auto_increment,
                date_time date,
                client varchar(30),
                status varchar(6),
                amount decimal(65,2)
              );
              CREATE TABLE ${email.replace(/[^a-zA-Z0-9_]/g, "")}_mail_box(
                id int primary key auto_increment,
                date_time date,
                name varchar(30),
                message varchar(300),
                amount decimal(65,2),
                email varchar(30)
              );
              CREATE TABLE ${email.replace(/[^a-zA-Z0-9_]/g, "")}_reports(
                id int primary key auto_increment,
                date_time date,
                name varchar(30),
                message varchar(300),
                email varchar(30)
              );
              CREATE TABLE ${email.replace(/[^a-zA-Z0-9_]/g, "")}_bills(
                id int primary key auto_increment,
                date_time date,
                name varchar(30),
                message varchar(300),
                email varchar(30),
                amount decimal(65,2)
              );
            `;

            db.query(tablesQuery, (err) => {
              if (err) {
                console.log("Error creating tables", err);
                return res.status(500).json({ success: false, message: "Error creating tables" });
              }

              res.cookie("token", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production",
              });

              return res.status(200).json({ success: true, message: "Account created successfully", token });
            });
          }
        );
      } catch (hashErr) {
        return res.status(500).json({ success: false, message: "Error hashing password" });
      }
    }
  );
});

server.post("/login2", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM accounts WHERE email = ?", [email], async (err, result) => {
    if(err || result.length === 0) return res.status(404).json({ message:"email is not found!" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if(match){
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7*24*60*60*1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production", });
  return res.status(200).json({ message: "", token });
    } else {
      return res.status(404).json({ message:"wrong password"});
    }

  });
});

server.get("/check_login", (req, res) => {
  const token = req.cookies?.token;
  
  if (!token) return res.status(200).json({ logged: false });

  try {
    const decoded = jwt.verify(token, SECRET);
    
    return res.status(200).json({ logged: true, user: decoded });
  } catch (err) {
    return res.status(200).json({ logged: false });
  }
});

server.post("/logout",(req,res) =>{
    res.clearCookie("token",{
      httpOnly:true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logged out successfully" });
})

server.get("/profile",(req,res) =>{
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);
  db.query(`SELECT * FROM accounts WHERE email = ?`,[decoded.email],(err,resulte) =>{
    if(err){
      console.log("error in email retreval",err)
      return res.status(403)}
    else{
      return res.status(200).json(resulte);
    }
  })
})

server.delete("/profile",(req,res) =>{
  const {id} = req.body;
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, error: "Token not provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  const tablesQuery = `
              DROP TABLE client_${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_transactions;
              DROP TABLE freelancer_${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_transactions;
              DROP TABLE ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_invoices;
              DROP TABLE ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_mail_box;
              DROP TABLE ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_reports;
              DROP TABLE ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_bills;
            `;

  db.query(`DELETE FROM accounts WHERE id = ?`,[id],(err) =>{
    if (err) {
      console.log("error deleting account in b.e",err);
      return res.status(500).json({ error: "Failed to delete account" });
    }
    db.query(tablesQuery,(err) =>{
      if(err){
        console.log("error deleting table",err);
        return res.status(500).json({success:false})
      }
      return res.status(200).json({success:true});
    })
  })
});

server.post("/Dchecker",async (req,res) => {
  const {password} = req.body;
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET)

  db.query(`select password from accounts where email = ?`,[decoded.email] , async(err,result) =>{
    if (err){
      return res.status(403).json({success:false});
    }
      const match = await bcrypt.compare(password,result[0].password)
      if(match){
        return res.status(200).json({success:true})
      }
      else{
        return res.status(401).json({success:false})
      }
  })
})

server.get("/balance", async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    return res.json(balance);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

server.post("/cardSaver", (req, res) => {
  const token = req.cookies?.token;
  let decoded;
  try {
    decoded = jwt.verify(token, SECRET);
  } catch (err) {
    console.log("invalid token in /cardSaver", err);
    return res.status(401).json({ error: "unauthenticated" });
  }

  db.query(
    "SELECT id, stripeCustomerId FROM accounts WHERE email = ? LIMIT 1",
    [decoded.email],
    async (err, results) => {
      if (err) {
        console.log("db error selecting account in /cardSaver", err);
        return res.status(500).json({ error: "db error" });
      }
      const account = results && results[0];
      if (!account) return res.status(404).json({ error: "Account not found" });

      try {
        let customerId = account.stripeCustomerId;

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: decoded.email,
            description: decoded.email,
          });
          customerId = customer.id;

          db.query(
            "UPDATE accounts SET stripeCustomerId = ? WHERE id = ?",
            [customerId, account.id],
            (uErr) => {
              if (uErr) console.log("failed to save stripeCustomerId", uErr);
            }
          );
        }

        const setupIntent = await stripe.setupIntents.create({
          customer: customerId,
          payment_method_types: ["card"],
        });

        return res.json({ clientSecret: setupIntent.client_secret });
      } catch (stripeErr) {
        console.log("error in saving card post", stripeErr);
        return res.status(500).json({ error: "stripe error" });
      }
    }
  );
});
server.post("/savePaymentMethod", (req, res) => {
  console.log(req.body);
  
  const token = req.cookies?.token;
  let decoded;
  try {
    decoded = jwt.verify(token, SECRET);
  } catch (err) {
    console.log("invalid token in /savePaymentMethod", err);
    return res.status(401).json({ error: "unauthenticated" });
  }
  const { payment_method } = req.body;
  if (!payment_method) return res.status(400).json({ error: "missing payment_method" });

  db.query(
    "SELECT id, stripeCustomerId FROM accounts WHERE email = ? LIMIT 1",
    [decoded.email],
    async (err, results) => {
      if (err) {
        console.log("db error selecting account in /savePaymentMethod", err);
        return res.status(500).json({ error: "db error" });
      }
      const account = results && results[0];
      if (!account) return res.status(404).json({ error: "Account not found" });

      try {
        await stripe.paymentMethods.attach(payment_method, { customer: account.stripeCustomerId });
        await stripe.customers.update(account.stripeCustomerId, {
          invoice_settings: { default_payment_method: payment_method },
        });
        db.query(
          "UPDATE accounts SET savedPaymentMethod = ? WHERE id = ?",
          [payment_method, account.id],
          (uErr) => {
            if (uErr) {
              console.log("failed to save payment method in DB", uErr);
              return res.status(500).json({ error: "db update failed" });
            }
            return res.json({ ok: true });
          }
        );
      } catch (stripeErr) {
        console.log("error attaching payment method", stripeErr);
        return res.status(500).json({ error: "stripe error" });
      }
    }
  );
});

server.post("/pay", async (req, res) => {
  const { amount,email,date } = req.body; 
  const token = req.cookies?.token;
  const decoded = jwt.verify(token, SECRET);

  try {
    const [user] = await new Promise((resolve, reject) => {
      db.query(`SELECT stripeCustomerId, savedPaymentMethod, balance FROM accounts WHERE email = ?`, [decoded.email], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!user || !user.savedPaymentMethod) {
      return res.status(400).json({ error: "No saved payment method" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      customer: user.stripeCustomerId,
      payment_method: user.savedPaymentMethod,
      off_session: true,
      confirm: true
    });

    const newBalance = parseFloat(user.balance || 0) + parseFloat(amount);
 await new Promise((resolve, reject) => {
  const freelancerTable = `freelancer_${email.replace(/[^a-zA-Z0-9_]/g, "")}_transactions`;
  const clientTable = `client_${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_transactions`;

  db.query(
    `INSERT INTO ${freelancerTable} (date_time,type_,account_,amount,description_) VALUES (?,?,?,?,?)`,
    [date, 'income', 'bank account', amount, 'Payment received'],
    (err) => {
      if (err) return reject(err);

      db.query(
        `INSERT INTO ${clientTable} (date_time,type_,account_,amount,description_) VALUES (?,?,?,?,?)`,
        [date, 'expense', 'bank account', amount, 'Payment sent'],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    }
  );
});

    return res.json({ success: true, paymentIntent, newBalance });
  } catch (err) {
    if (err.code === "authentication_required") {
      return res.status(402).json({
        requires_action: true,
        payment_intent_client_secret: err.raw.payment_intent.client_secret
      });
    }
    console.log("Error in /pay:", err);
    return res.status(500).json({ error: err.message });
  }
});


server.put("/jobType",(req,res) => {
  const {job} = req.body
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);
  db.query(`update accounts set jobType = ? where email = ?`,[job,decoded.email],(err) =>{
    if(err){
      console.log("error updating joptype",err);
      return res.status(500).json({success:false});
    }
  })
  return res.status(200).json({success:true})
})

server.get("/jobType",(req,res) =>{
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);

  db.query(`select jobType from accounts where email = ?`,[decoded.email],(err,resulte) =>{
    if(err){
      console.log("error getting joptype in B.E",err);
      return res.status(500).json({success:false});
    }
    return res.status(200).json(resulte);
  })
})

server.put("/description",(req,res) =>{
  const {desc} = req.body;
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);

  db.query(`update accounts set jobDescription = ? where email = ?`,[desc,decoded.email],(err) =>{
    if(err){
      console.log("error inserting description");
      return res.status(500).json({success:false});
    }
    return res.status(200).json({success:true});
  })
})

server.get("/description",(req,res) =>{
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);

  db.query(`select jobDescription from accounts where email = ?`,[decoded.email],(err,resulte) =>{
    if(err){
      console.log("error getting jobDescription in B.E",err);
      return res.status(500).json({success:false});
    }
    return res.status(200).json(resulte);
  })
})

server.get(`/getFreelancer`,(req,res) =>{
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);
  db.query(`select id,user_name,jobType,jobDescription,email from accounts where jobType  is not null AND email != ?`,[decoded.email],(err,result)=>{
    if(err){
      console.log("error retreaving freelancers");
      return res.status(404).json({success:false});
    }
    else {
      return res.status(200).json(result);
    }
  })
})

server.get(`/getMail`,(req,res) =>{
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);

  db.query(`select * from ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_mail_box`,(err,resulte) =>{
    if(err){
      console.log("error getting mail");
      return res.status(500).json({success:false});
    }
    return res.status(200).json(resulte);
  })
})

server.post(`/sendMail`,(req,res) =>{
  const {today,email,message} = req.body;
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);

  db.query(`select user_name from accounts where email = ?`,[decoded.email],(err,result) =>{
    if(err){
      console.log("error getting name in request");
      return res.status(500).json({success:false});
    }
    
      db.query(`insert into ${email.replace(/[^a-zA-Z0-9_]/g, "")}_mail_box(date_time,name,message,email) values(?,?,?,?)`,[today,result[0].user_name,message,decoded.email],(err)=>{
        if(err){
          console.log("error sending request in B.E",err);
          return res.status(200).json({success:false});
        }
        return res.status(200).json({success:true})
      })
    })
})

server.post(`/request`,(req,res) =>{
  const {today,email,request,amount} = req.body
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);

  let message

  if(amount){
    message = `${request}\n\nPayment Amount:${amount}`
  }
  else{
    message = request;
  }

  console.log(message);
  

  db.query(`select user_name from accounts where email = ?`,[decoded.email],(err,result) =>{
    if(err){
      console.log("error getting name in request");
      return res.status(500).json({success:false});
    }
    
      db.query(`insert into ${email.replace(/[^a-zA-Z0-9_]/g, "")}_reports(date_time,name,message,email) values(?,?,?,?)`,[today,result[0].user_name,message,decoded.email],(err)=>{
        if(err){
          console.log("error sending request in B.E",err);
          return res.status(200).json({success:false});
        }
        return res.status(200).json({success:true})
      })
    })
  })

  server.get(`/getReport`,(req,res) =>{
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);

  db.query(`select * from ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_reports`,(err,result) =>{
    if(err){
      console.log("error retreaving report's");
      return res.status(500).json({success:false});
    }    
    return res.status(200).json(result);
  })
  })

server.delete(`/deleteMail`,(req,res) => {
  const {id} = req.body;
  const token = req.cookies?.token;
  const decoded = jwt.verify(token,SECRET);

  db.query(`delete from ${decoded.email.replace(/[^a-zA-Z0-9_]/g, "")}_mail_box where id = ?`,[id],(err) =>{
    if(err){
      console.log("error deleting mail in B.E");
      return res.status(500).json({success:false});
    }
    return res.status(200).json({success:true});
  })
})

server.listen(5000,() =>{
    console.log("running on 5000");
})