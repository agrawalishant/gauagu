// JSON data
const users = [{
        id: 1,
        name: "Gaugau",
        email: "Gaugau@test.com",
    },
    {
        id: 2,
        name: "AS",
        email:"gilfoyle@test.com",
    },
];

// Router
const router = app => {
    app.get('/', (request, response) => {
        response.send({
            message: 'Node.js and Express REST API'
        });
    });

    app.get('/users', (request, response) => {
        console.log("test");
        //response.send(users);
    });
}

// Export the router
module.exports = router;
