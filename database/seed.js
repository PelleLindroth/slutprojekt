const User = require('../models/userModel')
const Task = require('../models/taskModel')
const Message = require('../models/messageModel')

const seed = async () => {
  await User.create({ name: 'Client1', password: 'Grillkorv', email: 'client1@yahoo.com' })
  await User.create({ name: 'Client2', password: 'Grillkorv', email: 'client2@yahoo.com' })
  await User.create({ name: 'Client3', password: 'Grillkorv', email: 'client3@yahoo.com' })

  await User.create({ name: 'Worker1', password: 'Grillkorv', email: 'worker1@yahoo.com', role: 'worker' })
  await User.create({ name: 'Worker2', password: 'Grillkorv', email: 'worker2@yahoo.com', role: 'worker' })
  await User.create({ name: 'Worker3', password: 'Grillkorv', email: 'worker3@yahoo.com', role: 'worker' })

  await User.create({ name: 'Pelle', password: 'Grillkorv', email: 'pelle@yahoo.com', role: 'admin' })
  await User.create({ name: 'Emma', password: 'Grillkorv', email: 'emma@yahoo.com', role: 'admin' })
  await User.create({ name: 'Renzo', password: 'Grillkorv', email: 'renzo@yahoo.com', role: 'admin' })

  await Task.create({ title: 'Köp tapeter', clientId: 1, workerId: 4 })
  await Task.create({ title: 'Sätt upp tapeter', clientId: 2, workerId: 5 })
  await Task.create({ title: 'Renovera badrum', clientId: 3, workerId: 6 })

  await Message.create({ content: 'Vilka tapeter ville du ha?', UserId: 4, TaskId: 1 })
  await Message.create({ content: 'Vilken badrumskran ska vi ta?', UserId: 6, TaskId: 3 })
}

seed()


