const express = require('express');
const router = express.Router();

// home page
router.get('/', function(req, res, next) {

    const {con} = req;
    const {user} = req.query;
    let filter;

    if (user) {
        filter = 'WHERE userid = ?';
    }

    con.query(`SELECT * FROM account ${filter}`, user, (err, data)=> {
        
        if (err) {
            console.log(err);
        }



        // use index.ejs
        res.render('index', { title: 'Account Information', data, user });
    });

});

// add page
router.get('/add', (req, res, next)=> {

    // use userAdd.ejs
    res.render('userAdd', { title: 'Add User', msg: '' });
});

// add post
router.post('/userAdd', (req, res, next)=> {

    const {con} = req;

    // check userid exist
    // let userid = req.body.userid;
    const {userid} = req.body;
    con.query('SELECT userid FROM account WHERE userid = ?', userid, (err, rows)=> {
        if (err) {
            console.log(err);
        }

        
        if (rows.length > 0) {

            const msg = 'Userid already exists.';
            res.render('userAdd', { title: 'Add User', msg });

        } else {
            const {userid,password,email} = req.body;
            const sql = {
                userid,
                password,
                email
            };

            //console.log(sql);
            con.query('INSERT INTO account SET ?', sql, (err, rows)=> {
                if (err) {
                    console.log(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.redirect('/');
            });
        }
    });


});

// edit page
router.get('/userEdit', (req, res, next) =>{

    const {id} = req.query;
    //console.log(id);

    const {con} = req;
    

    con.query('SELECT * FROM account WHERE id = ?', id, (err, rows)=> {
        if (err) {
            console.log(err);
        }

        let data = rows;
        res.render('userEdit', { title: 'Edit Account', data });
    });

});


router.post('/userEdit', function(req, res, next) {

    const {con} = req;

    const {id} = req.body;

    const {userid,password,email} = req.body;

    const sql = {
        userid,
        password,
        email,
    };

    con.query('UPDATE account SET ? WHERE id = ?', [sql, id], (err, rows)=> {
        if (err) {
            console.log(err);
        }

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/');
    });

});


router.get('/userDelete', (req, res, next)=> {

    const {id} = req.query;

    const {con} = req;

    con.query('DELETE FROM account WHERE id = ?', id, (err, rows)=> {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
