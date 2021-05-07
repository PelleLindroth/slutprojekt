const taskController = require("../controllers/taskController");

const authRedirect = () => {
  return async (req, res, next) => {
    const role = req.user.role;
    if (role === "client") {
      res.json(await taskController.getClientsTasks(req));
    }
    if (role === "worker") {
      res.json(await taskController.getWorkerTasks(req));
    }
  };
};

module.exports = authRedirect;
