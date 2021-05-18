# Inge Bra Bygg

A REST API built by Pelle Lindroth, Renzo Santa Maria and Emma Dawson.
### CLEAN INSTALL
- Clone codebase
- Run npm install
- Add .env file with variables JWT_SECRET and PORT
- Run project with npm start

| Endpoint                 | Requested information                                  | AuthRoles             | Expected response                                |
| ------------------------ | ------------------------------------------------------ | --------------------- | ------------------------------------------------ |
| POST /authenticate       | Req body: email and password                           | client, worker, admin | User object: id, email, name, role, JWT token    |
| GET /me                  | --                                                     | client, worker, admin | User object: id, email, name, role               |
| PATCH /me                | email name password + confirmPassword role(admin only) | client, worker, admin | message: User with id \_ updated                 |
| GET /users               | Possible query params: role=role search=name           | worker, admin         | Array: users                                     |
| GET /users/:id           | --                                                     | client, worker, admin | User object: id, email, name, role               |
| POST /users              | Req body: name email password role(optional)           | admin                 | User object: id, email, name, role               |
| PATCH /users/:id         | Req body:email name role password + confirmPassword    | admin                 | message: User with id \_ updated                 |
| DELETE /users/:id        | --                                                     | admin                 | message: User with id \_ deleted successfully    |
| DELETE /tasks/:id        | --                                                     | admin                 | message: Task with id \_ DESTROYED!              |
| GET /reviews             | --                                                     | admin                 | Array of all reviews for all tasks               |
| POST /tasks              | Req body: title clientEmail                            | worker                | Task object: id, title, done, clientId, workerId |
| GET /tasks               | worker can query filter=done/incomplete search=name    | client, worker        | Array of own task objects                        |
| GET /tasks/:id           | --                                                     | client, worker        | Task object (client can only fetch own tasks)    |
| PATCH /tasks/:id         | Req body: title done                                   | worker                | Updated task object                              |
| GET /tasks/:id/messages  | worker can query page= per_page=                       | client, worker        | Object: Messages array, messages count           |
| POST /tasks/:id/messages | Req body: content                                      | client, worker        | Message object: id, content, UserId, TaskId      |
| DELETE /messages/:id     | --                                                     | client, worker        | message: Message with ID \_ deleted successfully |
| POST /tasks/:id/image    | multi-part-form image:imageFile.png/jpg                | worker                | Image object: id, title, TaskId                  |
| DELETE /images/:id       | --                                                     | worker                | message: image with id: \_ deleted.              |
| POST /tasks/:id/error    | Req body:content                                       | client                | ErrorReport object: id, content, TaskId          |
| POST /errors/:id/image   | multi-part-form image:imageFile.png/jpg                | client                | ErrorReport object: id, content, image, TaskId   |
| POST /tasks/:id/review   | Req body: content rating                               | client                | Review object: id, content, review, TaskId       |
